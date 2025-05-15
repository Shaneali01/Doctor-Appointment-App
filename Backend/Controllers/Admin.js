import Doctor from "../Models/DoctorModel.js";
import RefundRequest from "../Models/RefundRequest.js";
export const GetLatestAppointments=async(req,res)=>{
    try {
       
        // Fetch doctors with appointments
        const doctors = await Doctor.find({ "appointments.0": { $exists: true } })
          .populate("appointments.patientId", "name")
          .lean();
    
        // Extract and format appointments
        let appointments = [];
        doctors.forEach((doctor) => {
          doctor.appointments.forEach((appt) => {
            appointments.push({
              id: appt._id,
              patient: appt.patientId?.name || "Unknown",
              doctor: doctor.name || "Unknown",
              date: new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              time: appt.time,
              status: appt.status,
            });
          });
        });
    
        // Sort by appointment date (descending) and limit to 5
        appointments = appointments
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
          .slice(0, 5);
    
        res.status(200).json(appointments);
      } catch (error) {
        console.error("Error fetching latest appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
}
export const GetAllAppointmetns=async(req,res)=>{
    try {
       
        // Fetch doctors with appointments
        const doctors = await Doctor.find({ "appointments.0": { $exists: true } })
          .populate("appointments.patientId", "name")
          .lean();
    
        // Extract and format appointments
        let appointments = [];
        doctors.forEach((doctor) => {
          doctor.appointments.forEach((appt) => {
            appointments.push({
              id: appt._id,
              patient: appt.patientId?.name || "Unknown",
              doctor: doctor.name || "Unknown",
              date: new Date(appt.appointmentDate).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }),
              time: appt.time,
              status: appt.status,
            });
          });
        });
    
        // Sort by appointment date (descending) and limit to 5
        appointments = appointments
          .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
        res.status(200).json(appointments);
      } catch (error) {
        console.error("Error fetching latest appointments:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }

}
export const GetTotalEarnings=async(req,res)=>{
    try {
        let totalSum = 0;
        const doctors = await Doctor.find({}).lean();
  
        doctors.forEach((doctor) => {
          totalSum += doctor.earnings || 0; 
        });
  
        res.status(200).json({ totalEarnings: totalSum.toLocaleString()});
      } catch (error) {
        console.error("Error fetching total earnings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
      }
}
export const DeleteAppointment=async(req,res)=>{
  try {
    const { appointmentId } = req.params;
    const result = await Doctor.updateOne(
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
export const TotalRefundRequest = async (req, res) => {
  try {
    // Count all documents in the RefundRequest collection
    const RefundCount = await RefundRequest.countDocuments({status:"Approved"});

    // Send success response with the count
    return res.status(200).json({
      success: true,
      totalRefunds: RefundCount,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Error counting refund requests:", error.message);

    // Send error response
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve refund request count",
    });
  }
};