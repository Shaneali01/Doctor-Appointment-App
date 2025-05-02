import express from 'express'
import { ApplyasDoctor, CancelAppointment, ClearNotifications, DeleteAppointment, GetAppointment, GetNotifications, GetNumberOfPatients, GetProfile, GetUserAppointments, PaymentMethod, SetAppointment }  from '../Controllers/User.js';
import VerifyToken from '../Middlewares/Verify-Token.js';
import verifyToken from '../Middlewares/Verify-Token.js';

const router=express.Router();
router.get('/profile/:id',VerifyToken, GetProfile);
router.post("/apply",ApplyasDoctor);
router.get('/total-patients',GetNumberOfPatients);
router.post('/set-appointment',VerifyToken,SetAppointment);
router.get('/get-appointments',VerifyToken,GetUserAppointments)
router.put("/cancel-appointment/:patientId/:appointmentId",CancelAppointment);
router.post("/create-checkout-session",VerifyToken,PaymentMethod);
router.get("/appointment/:appointmentId",verifyToken,GetAppointment)
router.put('/cancel-appointments/:patientId/:appointmentId',CancelAppointment);
router.delete('/delete-appointment/:appointmentId',DeleteAppointment);
router.get("/get-notifications/:userId",GetNotifications);
router.delete("/clear-notifications/:userId",ClearNotifications)

export default router