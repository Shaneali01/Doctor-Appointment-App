import express from 'express'
import { AddDoctor, ApproveDoctor, CancelAppointment, ClearNotifications, CompleteAppointment, DeleteDoctor, FindDoctor, GetAppointments, GetApprovedDoctors, GetDoctorProfile, GetNotifications, GetNumberOfDoctors, GetNumberOfPatients, GetRequestedDoctors,  GetTotalEarnings, LatestAppointments, TotalAppointments } from '../Controllers/Doctor.js';
const router = express.Router();

router.post('/add-doctor',AddDoctor);
router.get('/get-doctor/:id', GetDoctorProfile);
router.get('/get-approved-doctors',GetApprovedDoctors);
router.get('/get-requested-doctors',GetRequestedDoctors);
router.put(`/approve-doctor/:id`,ApproveDoctor);
router.get('/total-doctors',GetNumberOfDoctors);
router.get('/total-earnings/:id',GetTotalEarnings);
router.get('/total-patients/:doctorId',GetNumberOfPatients);
router.delete('/delete-doctor/:id',DeleteDoctor);
router.get('/get-appointments/:id',GetAppointments);
router.put('/complete-appointments/:doctorId/:appointmentId',CompleteAppointment);
router.put('/cancel-appointments/:doctorId/:appointmentId',CancelAppointment);
router.get('/latest-appointments/:doctorId',LatestAppointments);
router.get('/total-appointments/:doctorId',TotalAppointments);
router.get("/find-doctors",FindDoctor);
router.get("/get-notifications/:doctorId",GetNotifications);
router.delete("/clear-notifications/:doctorId",ClearNotifications);
// router.get(`total-patients/:id`,GetNumberOfPatients);


export default router