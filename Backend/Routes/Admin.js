import express from "express"
import { DeleteAppointment, GetAllAppointmetns, GetLatestAppointments, GetTotalEarnings, TotalRefundRequest } from "../Controllers/Admin.js";

const router=express.Router();
router.get("/GetLatestAppointments",GetLatestAppointments);
router.get("/GetAllAppointments",GetAllAppointmetns);
router.get("/TotalEarnings",GetTotalEarnings);
router.delete("/delete-appointment/:appointmentId",DeleteAppointment);
router.get("/total-refunds",TotalRefundRequest)

export default router;