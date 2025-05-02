import cloudinary from "../Config/Cloudinary.js";
import Doctor from "../Models/DoctorModel.js";
import bcrypt from "bcryptjs";
import User from "../Models/User.js";
import mongoose from "mongoose"
export const AddDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialty,
      image,
      fees,
      degree,
      experience,
      address,
      about,
    } = req.body;
    const findEmailUser=await User.findOne({email})
    const findEmail=await Doctor.findOne({email})
    if(findEmail || findEmailUser){
      return res.status(400).json({ message: "Email already exists" });
    }
    const encryptedPassword = await bcrypt.hash(password,10)


    if (!name || !email || !password || !specialty || !fees || !degree || !experience || !address || !about) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let imageResult;

    if (image) {
      const result = await cloudinary.uploader.upload(image, { folder: "Doctor-Appoinment_Web-App/Doctors" });
      imageResult = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }
const defaultImage='https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-doctor-avatar-icon-illustration-png-image_8537702.png'
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
      image: imageResult?.url || defaultImage, // Add image object only if image was uploaded
    });

    await doctor.save();

    return res.status(200).json({
      message: "Doctor added successfully",
      data: {
        name,
        email,
        password,
        specialty,
        fees,
        degree,
        experience,
        address,
        about,
        image: imageResult, 
      },
    });

  } catch (error) {
    console.error("Error in AddDoctor:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
export const GetDoctorProfile=async(req,res)=>{
  try{
    const {id}=req.params
    const doctor=await Doctor.findById(id);
    if(!doctor){
      return res.status(404).json({ message: "No doctor found" });
    }
    return res.status(200).json(doctor)

  }
  catch(error){
    console.error("Error in GetDoctorProfile:", error);
    return res.status(500).json({ message: "Something went wrong", error });

  }
}
export const DeleteDoctor=async(req,res)=>{
  try{
    const {id}=req.params
    const doctor=await Doctor.findByIdAndDelete(id);
    if(!doctor){
      return res.status(404).json({ message: "No doctor found" });
    }
    return res.status(200).json({message:"Doctor deleted successfully"})

  }
  catch(error){
    console.error("Error in DeleteDoctor:", error);
    return res.status(500).json({ message: "Something went wrong", error });

  }
}
export const GetApprovedDoctors=async(req,res)=>{
  try{
    const doctors=await Doctor.find({status:"approved"});
    return res.status(200).json(doctors)
  }
  catch(error){
    console.error("Error in GetApprovedDoctors:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const GetRequestedDoctors=async(req,res)=>{
  try{
    const doctors=await Doctor.find({status:"pending"});
    return res.status(200).json(doctors)
  }
  catch(error){
    console.error("Error in GetRequestedDoctors:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const ApproveDoctor=async(req,res)=>{
  try{
    const {id}=req.params
    const doctor=await Doctor.findById(id);
    if(!doctor){
      return res.status(404).json({ message: "No doctor found" });
    }
    doctor.status="approved"
    await doctor.save()
    return res.status(200).json({message:"Doctor approved successfully",doctor})

  }
  catch(error){
    console.error("Error in ApproveDoctor:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const GetNumberOfDoctors=async(req,res)=>{
  try{
    const totalNoOfDoctors=await Doctor.countDocuments({status:"approved"});
    return res.status(200).json({message:"Total number of doctors",totalNoOfDoctors})
  }
  catch(error){
    console.error("Error in GetNumberOfDoctors:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const GetTotalEarnings=async(req,res)=>{
  try{
    const {id}=req.params
    const doctor=await Doctor.findById(id);
    if(!doctor){
      return res.status(404).json({ message: "No doctor found" });
    }
    const totalEarnings=doctor.earnings;
    return res.status(200).json({message:"Total earnings",totalEarnings})

  }
  catch(error){
    console.error("Error in GetTotalEarnings:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}
export const GetAppointments=async(req,res)=>{
  try {
    console.log('working1')
    const doctorId = req.params.id;
    console.log(doctorId)
    const doctor = await Doctor.findById(doctorId).populate("appointments.patientId", "name age image");
    if (!doctor) {
      console.log("no working")
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Promise.all(
      doctor.appointments.map(async (appt) => {
        const patient = await User.findById(appt.patientId);
        return {
          _id: appt._id,
          patientName: appt.patientName,
          patientImage: patient?.image,
          patientAge: patient?.age,
          appointmentDate: appt.appointmentDate,
          time: appt.time,
          status: appt.status,
          feePaid: appt.feePaid,
        };
      })
    );

    res.json({ appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const CompleteAppointment=async(req,res)=>{
  try {
    const { doctorId, appointmentId } = req.params;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Find the appointment subdocument by _id
    const appointment = doctor.appointments.find(
      (appt) => appt._id.toString() === appointmentId
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Check status
    if (appointment.status !== "Pending") {
      return res.status(400).json({ message: "Cannot complete a non-pending appointment" });
    }

    // Update appointment status and earnings
    appointment.status = "Completed";
    doctor.earnings = (doctor.earnings || 0) + doctor.fees;
    await doctor.save();

    // Sync with Patient's record
    const patientUpdateResult = await User.updateOne(
      { "appointments._id": appointmentId },
      { $set: { "appointments.$.status": "Completed" } }
    );

    if (patientUpdateResult.matchedCount === 0) {
      console.warn("No matching patient appointment found for ID:", appointmentId);
    }

    // Find patient by appointment ID
    const patient = await User.findOne({ "appointments._id": appointmentId });
    if (patient) {
      patient.notifications.push({
        message: `Your appointment with Dr. ${doctor.name} on ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.time} has been completed.`,
        timestamp: new Date(),
        isRead: false,
      });
      await patient.save();
    } else {
      console.warn("No patient found with appointment ID:", appointmentId);
    }

    res.json({ message: "Appointment completed successfully" });
  } catch (error) {
    console.error("Error completing appointment:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const CancelAppointment=async(req,res)=>{
  try {
    const { doctorId, appointmentId } = req.params;
    console.log("appointment id is coming")
    console.log(appointmentId)
    console.log(doctorId)

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointment = doctor.appointments.id(appointmentId);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.status !== "Pending") {
      return res.status(400).json({ message: "Cannot cancel a non-pending appointment" });
    }

    appointment.status = "Cancelled";
    await doctor.save();

    const user =await User.updateOne(
      { "appointments._id": appointmentId },
      { $set: { "appointments.$.status": "Cancelled" } }
    );
    console.log(user)

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Server error" });
  }
}
export const GetNumberOfPatients=async(req,res)=>{
  try {
    const { doctorId } = req.params;

    // Verify doctorId matches authenticated user
   

    // Find doctor and count unique patientIds in appointments
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const uniquePatients = new Set(doctor.appointments.map((appt) => appt.patientId.toString()));
    const patientCount = uniquePatients.size;

    res.json({ patients: patientCount });
  } catch (error) {
    console.error("Error fetching total patients:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const LatestAppointments=async(req,res)=>{
    try {
      const { doctorId } = req.params;
  
      // Verify doctorId matches authenticated user
     
      // Find doctor
      const doctor = await Doctor.findById(doctorId).lean();
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      // Get latest 5 appointments, sorted by appointmentDate
      const latestAppointments = doctor.appointments
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
        .slice(0, 5)
        .map((appt) => ({
          id: appt._id.toString(), // Match frontend's `appt.id`
          patient: appt.patientName || "Unknown",
          time: `${new Date(appt.appointmentDate).toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })} ${appt.time}`,
          status: appt.status,
        }));
  
      res.json({ latestAppointments });
    } catch (error) {
      console.error("Error fetching latest appointments:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
}
export const TotalAppointments=async(req,res)=>{
  try {
    const { doctorId } = req.params;

    // Verify doctorId matches authenticated user

    // Find doctor
    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointmentCount = doctor.appointments.length;

    res.json({ appointments: appointmentCount });
  } catch (error) {
    console.error("Error fetching appointment count:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export const FindDoctor=async(req,res)=>{
  try {
    const { name, specialty, available } = req.query;
    const query = {};

    if (name) query.name = { $regex: name, $options: 'i' }; 
    if (specialty) query.specialty = { $regex: specialty, $options: 'i' };
    const doctors = await Doctor.find(query);
    res.json({ doctors });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
export const GetNotifications=async(req,res)=>{
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

      const entity = await Doctor.findById(doctorId, "notifications");

    if (!entity) {
      return res.status(404).json({ error: `${entityType} not found` });
    }

    // Sort notifications by timestamp (newest first)
    const notifications = entity.notifications.sort((a, b) => b.timestamp - a.timestamp);
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}
export const ClearNotifications=async(req,res)=>{
  try {
    const { doctorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "doctor not found" });
    }

    doctor.notifications = [];
    await doctor.save();

    res.status(200).json({ message: "Notifications cleared" });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ error: "Failed to clear notifications" });
  }
}
