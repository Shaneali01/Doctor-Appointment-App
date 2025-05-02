import React from "react";
import { Route, Routes } from "react-router-dom";
import DoctorPage from "../Pages/Doctor/DoctorHome";


const DoctorRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/*" element={<DoctorPage />} />
      </Routes>
    </div>
  );
};

export default DoctorRoutes;
