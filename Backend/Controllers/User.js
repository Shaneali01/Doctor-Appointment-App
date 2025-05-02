import Doctor from '../Models/DoctorModel.js';
import User from '../Models/User.js'
import bcrypt from 'bcryptjs';
import cloudinary from '../Config/Cloudinary.js';
import { mongoose } from 'mongoose';
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const GetProfile=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id);
        if(!user){
            return res.status(404).json({ message: "No user found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}

export const ApplyasDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialty,
      image, // Expecting base64 string from frontend
      fees,
      degree,
      experience,
      address,
      about,
    } = req.body;

    // Check if email already exists in User or Doctor collections
    const findEmailUser = await User.findOne({ email });
    const findEmailDoctor = await Doctor.findOne({ email });

    if (findEmailUser || findEmailDoctor) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate required fields
    if (!name || !email || !password || !specialty || !fees || !degree || !experience || !address || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Handle image upload to Cloudinary
    let imageResult;
    const defaultImage = "https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-doctor-avatar-icon-illustration-png-image_8537702.png";

    if (image) {
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: "Doctor-Appoinment_Web-App/Doctors",
        });
        imageResult = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
      }
    }

    // Create new Doctor document
    const doctor = new Doctor({
      name,
      email,
      password: encryptedPassword,
      specialty,
      fees,
      degree,
      experience,
      address,
      about,
      status: "pending",
      image: imageResult?.url || defaultImage, // Use uploaded image or default
    });

    // Save to database
    await doctor.save();

    // Push notification to admin
    const admin = await User.findOne({ role: "admin" });
    if (admin) {
      admin.notifications.push({
        message: `New doctor application submitted by ${name}`,
        timestamp: new Date(),
        isRead: false,
      });
      await admin.save();
    } else {
      console.warn("No admin user found for notification");
    }

    // Send success response
    return res.status(201).json({ message: "Doctor application submitted successfully" });
  } catch (error) {
    console.error("Error in ApplyasDoctor:", error);
    return res.status(500).json({ message: "Server error. Please try again later." });
  }
};
export const GetNumberOfPatients=async(req,res)=>{
  try{
    const totalNoOfPatients=await User.countDocuments();
    return res.status(200).json({message:"Total number of patients",totalNoOfPatients})
  }
  catch(error){
    console.error("Error in GetNumberOfPatients:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const SetAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, sessionId } = req.body;
    const patientId = req.user.id; // From JWT token

    // Validate inputs
    if (!doctorId || !date || !time || !sessionId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if appointment already exists for this sessionId
    const existingDoctorAppt = await Doctor.findOne({
      "appointments.sessionId": sessionId,
    });
    if (existingDoctorAppt) {
      return res.status(409).json({ message: "Appointment already booked for this payment session" });
    }

    // Verify Stripe payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Convert date string to Date object
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Check if the doctor exists and is approved
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== "approved") {
      return res.status(404).json({ message: "Doctor not found or not approved" });
    }

    // Verify payment amount matches doctor's fees
    if (session.amount_total !== doctor.fees * 100) {
      return res.status(400).json({ message: "Payment amount does not match doctor's fees" });
    }

    // Check if the slot is already booked for the doctor
    const isDoctorSlotTaken = doctor.appointments.some(
      (appt) =>
        appt.appointmentDate.toISOString() === appointmentDate.toISOString() &&
        appt.time === time &&
        appt.status !== "Cancelled" &&
        appt.status !== "Cancellation Requested"
    );
    if (isDoctorSlotTaken) {
      // Initiate refund
      try {
        await stripe.refunds.create({
          payment_intent: session.payment_intent,
        });
      } catch (refundError) {
        console.error("Refund error:", refundError);
        return res.status(500).json({ message: "Slot taken and refund failed. Please contact support." });
      }
      return res.status(409).json({ message: "This time slot is already booked with the doctor. Payment has been refunded." });
    }

    // Check if the patient already has an appointment at this time
    const patient = await User.findById(patientId);
    if (!patient) {
      // Initiate refund
      try {
        await stripe.refunds.create({
          payment_intent: session.payment_intent,
        });
      } catch (refundError) {
        console.error("Refund error:", refundError);
        return res.status(500).json({ message: "Patient not found and refund failed. Please contact support." });
      }
      return res.status(404).json({ message: "Patient not found. Payment has been refunded." });
    }

    const isPatientSlotTaken = patient.appointments.some(
      (appt) =>
        appt.appointmentDate.toISOString() === appointmentDate.toISOString() &&
        appt.time === time &&
        appt.status !== "Cancelled" &&
        appt.status !== "Cancellation Requested"
    );
    if (isPatientSlotTaken) {
      // Initiate refund
      try {
        await stripe.refunds.create({
          payment_intent: session.payment_intent,
        });
      } catch (refundError) {
        console.error("Refund error:", refundError);
        return res.status(500).json({ message: "Slot taken and refund failed. Please contact support." });
      }
      return res.status(409).json({
        message: "You already have an appointment scheduled at this time. Payment has been refunded.",
      });
    }
    const appointmenId = new mongoose.Types.ObjectId();

    // Appointment data
    const appointmentForDoctor = {
      _id: appointmenId,
      patientId,
      patientName: patient.name || "Unknown",
      appointmentDate,
      time,
      status: "Pending",
      feePaid: true,
      sessionId,
      paymentIntentId: session.payment_intent,
    };

    const appointmentForPatient = {
      _id: appointmenId,
      doctorId,
      appointmentDate,
      time,
      status: "Pending",
      paymentIntentId: session.payment_intent,
    };

    // Update both documents
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      doctorId,
      { $push: { appointments: appointmentForDoctor } },
      { new: true }
    );

    await User.findByIdAndUpdate(
      patientId,
      { $push: { appointments: appointmentForPatient } },
      { new: true }
    );

    // Add notification to patient's notifications array
    const formattedDate = appointmentDate.toLocaleDateString();
    // Add notification to doctor's notifications array
    await Doctor.findByIdAndUpdate(doctorId, {
      $push: {
        notifications: {
          message: `A new appointment with ${patient.name || "Unknown"} has been booked for ${formattedDate} at ${time}`,
          timestamp: new Date(),
          isRead: false,
        },
      },
    });

    // Get the ID of the newly added appointment
    const newAppointment = updatedDoctor.appointments.find(
      (appt) =>
        appt.appointmentDate.toISOString() === appointmentDate.toISOString() &&
        appt.time === time &&
        appt.patientId.toString() === patientId
    );

    res.status(201).json({ message: "Appointment booked successfully", appointmentId: newAppointment._id });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const GetUserAppointments=async(req,res)=>{
  try {
    console.log(req.user)
    const patientId = req.user.id;
    if (!patientId) {
      return res.status(403).json({ message: "Unauthorized: You can only view your own appointments" });
    }

    const patient = await User.findById(patientId).populate("appointments.doctorId", "name specialty image fees");
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const appointments = patient.appointments.map((appt) => ({
      _id: appt._id,
      doctorName: appt.doctorId?.name || "Unknown Doctor",
      doctorImage: appt.doctorId?.image || "https://via.placeholder.com/40",
      specialty: appt.doctorId?.specialty || "N/A",
      appointmentDate: appt.appointmentDate,
      time: appt.time,
      fees: appt.doctorId?.fees || "N/A",
      status: appt.status,
    }));

    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching patient appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const CancelAppointment=async(req,res)=>{
  try {
    const { patientId, appointmentId } = req.params;

    // Verify patientId matches authenticated user (assumed handled by middleware)

    // Find patient
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Find appointment in patient's appointments
    const patientAppointment = patient.appointments.id(appointmentId);
    if (!patientAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check if appointment is Pending
    if (patientAppointment.status !== "Pending") {
      return res.status(400).json({ message: "Only pending appointments can be cancelled" });
    }

    // Update patient appointment status
    patientAppointment.status = "Cancelled";
    await patient.save();

    // Find doctor and update their appointment status
    const doctor = await Doctor.findOne({ "appointments._id": appointmentId });
    if (!doctor) {
      console.warn("Doctor not found for appointment ID:", appointmentId);
      return res.status(200).json({ message: "Appointment cancelled successfully (doctor record not found)" });
    }

    const doctorAppointment = doctor.appointments.id(appointmentId);
    if (doctorAppointment) {
      doctorAppointment.status = "Cancelled";

      // Create notification for doctor
      let patientName = patient.name || "a patient"; // Adjust based on User schema
      const appointmentDate = doctorAppointment.appointmentDate || patientAppointment.date; // Prefer doctor's date if available
      const formattedDate = appointmentDate
        ? new Date(appointmentDate).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })
        : "an unspecified date";
      const notificationMessage = `Your appointment with ${patientName} on ${formattedDate} was canceled by the patient.`;

      // Push notification to doctor's notifications array
      doctor.notifications.push({
        message: notificationMessage,
        timestamp: new Date(),
        isRead: false,
      });

      await doctor.save();
    } else {
      console.warn("Appointment ID not found in doctor's appointments:", appointmentId);
    }

    res.status(200).json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const PaymentMethod=async(req,res)=>{
  try {
    const { doctorId, date, time, amount, patientId } = req.body;

    // Debug: Log request body

    // Verify patientId matches authenticated user
    if (patientId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized: Invalid patient ID" });
    }

    // Validate inputs
    if (!doctorId || !date || !time || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert date string to Date object
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor || doctor.status !== "approved") {
      return res.status(404).json({ message: "Doctor not found or not approved" });
    }

    // Verify amount matches doctor's fees
    if (amount !== doctor.fees * 100) {
      return res.status(400).json({ message: "Invalid payment amount" });
    }

    // Check if the slot is already booked for the doctor
    const isDoctorSlotTaken = doctor.appointments.some(
      (appt) =>
        appt.appointmentDate.toISOString() === appointmentDate.toISOString() &&
        appt.time === time &&
        appt.status !== "Cancelled" 
    );
    if (isDoctorSlotTaken) {
      return res.status(409).json({ message: "This time slot is already booked with the doctor" });
    }

    // Check if the patient already has an appointment at this time
    const patient = await User.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isPatientSlotTaken = patient.appointments.some(
      (appt) =>
        appt.appointmentDate.toISOString() === appointmentDate.toISOString() &&
        appt.time === time &&
        appt.status !== "Cancelled"
    );
    if (isPatientSlotTaken) {
      return res.status(409).json({
        message: "You already have an appointment scheduled at this time",
      });
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Appointment with ${doctor.name}`,
              description: `Date: ${new Date(date).toLocaleDateString()}, Time: ${time}`,
            },
            unit_amount: amount, // Amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/appointment/success?session_id={CHECKOUT_SESSION_ID}&doctorId=${doctorId}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&patientId=${patientId}`,
      cancel_url: `${req.headers.origin}/appointment/cancel`,
      metadata: {
        doctorId,
        date,
        time,
        patientId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }

}
export const GetAppointment = async (req, res) => {
  try {
  const { appointmentId } = req.params;
  const patientId = req.user.id;
  
  // Find the patient
  const patient = await User.findById(patientId);
  if (!patient) {
  return res.status(404).json({ message: "Patient not found" });
  }
  
  // Find the appointment
  const appointment = patient.appointments.find(
  (appt) => appt._id.toString() === appointmentId
  );
  if (!appointment) {
  return res.status(404).json({ message: "Appointment not found" });
  }
  
  // Get doctor details
  const doctor = await Doctor.findById(appointment.doctorId);
  if (!doctor) {
  return res.status(404).json({ message: "Doctor not found" });
  }
  
  // Construct response
  const appointmentDetails = {
  _id: appointment._id,
  doctorName: doctor.name,
  specialty: doctor.specialty,
  appointmentDate: appointment.appointmentDate,
  time: appointment.time,
  fees: doctor.fees,
  status: appointment.status,
  doctorImage: doctor.image,
  };
  
  res.status(200).json({ appointment: appointmentDetails });
  } catch (error) {
  console.error("Error fetching appointment:", error);
  res.status(500).json({ message: "Server error", error: error.message });
  }
  };
export const DeleteAppointment=async(req,res)=>{
  try {
    const { appointmentId } = req.params;
    const result = await User.updateOne(
      { "appointments._id": appointmentId },
      { $pull: { appointments: { _id: appointmentId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const GetNotifications=async(req,res)=>{
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId, "notifications");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Sort notifications by timestamp (newest first)
    const notifications = user.notifications.sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}
export const ClearNotifications=async(req,res)=>{
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.notifications = [];
    await user.save();

    res.status(200).json({ message: "Notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
}