import express from "express"
import { DeleteAppointment, GetAllAppointmetns, GetLatestAppointments, GetTotalEarnings } from "../Controllers/Admin.js";

const router=express.Router();
router.get("/GetLatestAppointments",GetLatestAppointments);
router.get("/GetAllAppointments",GetAllAppointmetns);
router.get("/TotalEarnings",GetTotalEarnings);
router.delete("/delete-appointment/:appointmentId",DeleteAppointment);

export default router;