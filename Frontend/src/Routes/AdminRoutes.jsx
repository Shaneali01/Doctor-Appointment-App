import { Routes, Route } from "react-router-dom";
import AdminHome from "../Pages/Admin/AdminHome";
import { AdminNavbar } from "../Components/Admin/AdminNavbar";
import NotFound from "../Pages/User/NotFound";

function UserRoutes() {
  return (
    <>
    <AdminNavbar/>
     <Routes>
      <Route path="/*" element={<AdminHome />} />
      <Route path="*" element={<NotFound/>} /> {/* Catch-all route for 404 */}

     
    </Routes>
    </>
      );

   
}

export default UserRoutes;
