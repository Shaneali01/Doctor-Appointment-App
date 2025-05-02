import mongoose from "mongoose";
import RefundRequest from "../Models/RefundRequest.js";
import Doctor from "../Models/DoctorModel.js";
import User from "../Models/User.js";
import stripe from "stripe";
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);
export const CreateRefundRequest = async (req, res) => {
    try {
        const { appointmentId, reason } = req.body;
        const patientId = req.user.id;
    
        // Validate inputs
        if (!appointmentId || !reason) {
          return res.status(400).json({ message: "Missing required fields" });
        }
    
        // Validate appointmentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
          console.error(`Invalid appointmentId format: ${appointmentId}`);
          return res.status(400).json({ message: "Invalid appointment ID format" });
        }
    
        // Convert appointmentId to ObjectId
        const objectId = new mongoose.Types.ObjectId(appointmentId);
    
        // Find the appointment in the Doctor model
        const doctor = await Doctor.findOne({ "appointments._id": objectId });
       
    
        // Find the specific appointment
        const appointment = doctor.appointments.find(
          (appt) => appt._id.toString() === appointmentId
        );
        if (!appointment) {
          console.error(`Appointment with ID ${appointmentId} not found in doctor's appointments array`);
          return res.status(404).json({ message: "Appointment not found" });
        }
    
        // Verify patient and appointment status
        if (appointment.patientId.toString() !== patientId) {
          console.error(`Unauthorized: Patient ${patientId} does not match appointment patientId ${appointment.patientId}`);
          return res.status(403).json({ message: "Unauthorized: Not your appointment" });
        }
        if (appointment.status !== "Cancelled") {
          console.error(`Invalid status: Appointment status is ${appointment.status}, expected Cancellation Requested`);
          return res.status(400).json({ message: "Appointment must be in Cancellation Requested status" });
        }
        if (!appointment.feePaid || !appointment.paymentIntentId) {
          console.error(`No payment found: feePaid=${appointment.feePaid}, paymentIntentId=${appointment.paymentIntentId}`);
          return res.status(400).json({ message: "No payment found for this appointment" });
        }
    
        // Check if refund request already exists
        const existingRequest = await RefundRequest.findOne({ appointmentId: objectId });
        if (existingRequest) {
          console.error(`Refund request already exists for appointmentId: ${appointmentId}`);
          return res.status(409).json({ message: "Refund request already submitted" });
        }
    
        // Create refund request
        const refundRequest = new RefundRequest({
          appointmentId: objectId,
          patientId,
          doctorId: doctor._id,
          paymentIntentId: appointment.paymentIntentId,
          amount: doctor.fees * 100, // Amount in cents
          reason,
        });
    
        await refundRequest.save();
        const admin=await User.findOne({role:"admin"});
        console.log(admin)
        admin.notifications.push({
          message:`A new refund request has been submitted by ${req.user.name}`,
          timestamp:Date.now(),
          isRead:false

        })
        await admin.save();
    
        res.status(201).json({ message: "Refund request submitted successfully", refundRequestId: refundRequest._id });
      } catch (error) {
        console.error("Error submitting refund request:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
}
export const GetRefundRequests = async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    const refundRequests = await RefundRequest.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 });

    // Add appointment details to response
    const enrichedRequests = await Promise.all(
      refundRequests.map(async (req) => {
        const doctor = await Doctor.findById(req.doctorId);
        const appointment = doctor.appointments.find(
          (appt) => appt._id.toString() === req.appointmentId.toString()
        );
        return {
          ...req._doc,
          appointment: appointment
            ? {
                appointmentDate: appointment.appointmentDate,
                time: appointment.time,
              }
            : null,
        };
      })
    );

    res.status(200).json(enrichedRequests);
  } catch (error) {
    console.error("Error fetching refund requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const GetAllRefundRequests = async (req, res) => {
  try {
    // const user = await User.findById(req.user.id);
    // if (!user || !user.isAdmin) {
    //   return res.status(403).json({ message: "Unauthorized: Admin access required" });
    // }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const refundRequests = await RefundRequest.find()
      .populate("patientId", "name email")
      .populate("doctorId", "name specialty")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await RefundRequest.countDocuments();

    const enrichedRequests = await Promise.all(
      refundRequests.map(async (req) => {
        const doctor = await Doctor.findById(req.doctorId);
        const appointment = doctor?.appointments.find(
          (appt) => appt._id.toString() === req.appointmentId.toString()
        );
        return {
          id: req._id,
          patient: req.patientId?.name || "Unknown",
          patientEmail: req.patientId?.email || "N/A",
          doctor: req.doctorId?.name || "Unknown",
          doctorSpecialty: req.doctorId?.specialty || "N/A",
          appointmentDate: appointment
            ? new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })
            : "N/A",
          appointmentTime: appointment?.time || "N/A",
          amount: (req.amount / 100).toFixed(2),
          reason: req.reason,
          status: req.status,
        };
      })
    );

    res.status(200).json({ refundRequests: enrichedRequests, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (error) {
    console.error("Error fetching all refund requests:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const HandleRefundRequest = async (req, res) => {
  try {
    const { requestId, action } = req.params;
    console.log(requestId);

    const refundRequest = await RefundRequest.findById(requestId);
    const patientid = refundRequest.patientId;
    if (!refundRequest) {
      return res.status(404).json({ message: "Refund request not found" });
    }

    if (action === "approve") {
      if (refundRequest.status !== "Pending") {
        return res.status(400).json({ message: "Refund request is not pending" });
      }

      // Process refund via Stripe
      const refund = await stripeClient.refunds.create({
        payment_intent: refundRequest.paymentIntentId,
        amount: refundRequest.amount,
      });

      // Update refund request status
      refundRequest.status = "Approved";
      refundRequest.refundedAt = new Date();
      await refundRequest.save();

      // Add notification to user's notifications array
      const user = await User.findById(patientid);
      if (user) {
        user.notifications.push({
          message: "Your refund request for appointment has been approved",
          timestamp: new Date(),
          isRead: false,
        });
        await user.save();
      } else {
        console.warn(`User with ID ${patientid} not found for notification`);
      }

      res.status(200).json({ message: "Refund processed successfully" });
    } else if (action === "reject") {
      refundRequest.status = "Rejected";
      await refundRequest.save();

      // Add notification to user's notifications array
      const user = await User.findById(patientid);
      if (user) {
        user.notifications.push({
          message: "Your refund request for appointment has been rejected",
          timestamp: new Date(),
          isRead: false,
        });
        await user.save();
      } else {
        console.warn(`User with ID ${patientid} not found for notification`);
      }

      res.status(200).json({ message: "Refund request rejected" });
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } catch (error) {
    console.error("Error handling refund request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};