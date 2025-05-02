import { Routes, Route } from "react-router-dom";
import Home from "../Pages/User/Home";
import Appointment from "../Pages/User/Appointment";
import ContactForm from "../Pages/User/Contact";
import ServicesSection from "../Pages/User/Services";
import DoctorsPage from "../Pages/User/Doctors";
import DoctorApplication from "../Pages/User/DoctorApply";
import Profile from "../Components/User/Profile";
import BookedAppointments from "../Pages/User/BookedAppointments";
import AppointmentSuccess from "../Pages/User/AppointmentSuccess";
import AdminRefundRequests from "../Pages/User/RefundRequestForm";
import RefundRequestForm from "../Pages/User/RefundRequestForm";
import ChatPage from "../Pages/Chatbot/ChatPage";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../Pages/User/NotFound";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesSection />} />
      <Route path="/contact" element={<ContactForm />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/doctors/:doctorcategory" element={<DoctorsPage />} />
      <Route path="/apply" element={<DoctorApplication />} />
      <Route path="/appointment/:id" element={<Appointment />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/booked-appointments" element={<BookedAppointments />} />
      <Route path='/appointment/success' element={<AppointmentSuccess/>}/>
      <Route path='/RefundRequest/:appointmentId' element={<RefundRequestForm/>}/>
      <Route path='/chatbot' element={<ChatPage/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path="*" element={<NotFound/>} /> {/* Catch-all route for 404 */}








    </Routes>
  );
}

export default UserRoutes;
