// src/components/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader2,
  DollarSign,
} from "lucide-react";
import { axiosInstance } from "../../Lib/axios";
import toast from "react-hot-toast";
import RefundModel from "./RefundModel";
import ConfirmModal from "../Common/ConfirmationModel";

export const Dashboard = () => {
  const [doctorsCount, setDoctorsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [latestAppointments, setLatestAppointments] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedRefundAction, setSelectedRefundAction] = useState(null); // Track refund ID and action

  useEffect(() => {
    const fetchDashboardData = async () => {
      let newErrors = {};

      try {
        const doctorsResponse = await axiosInstance.get("/doctor/total-doctors");
        setDoctorsCount(doctorsResponse.data.totalNoOfDoctors || 0);
      } catch (err) {
        newErrors.doctors = "Failed to fetch doctors count.";
        console.error("Doctors fetch error:", err);
        toast.error("Error loading doctors count");
      }

      try {
        const appointmentsResponse = await axiosInstance.get("/admin/TotalEarnings");
        setAppointmentsCount(appointmentsResponse.data.totalEarnings || 0);
      } catch (err) {
        newErrors.appointments = "Failed to fetch total earnings.";
        console.error("Appointments fetch error:", err);
        toast.error("Error loading appointments count");
      }

      try {
        const patientsResponse = await axiosInstance.get("/user/total-patients");
        setPatientsCount(patientsResponse.data.totalNoOfPatients || 0);
      } catch (err) {
        newErrors.patients = "Failed to fetch patients count.";
        console.error("Patients fetch error:", err);
        toast.error("Error loading patients count");
      }

      try {
        const appointmentsResponse = await axiosInstance.get("/admin/GetLatestAppointments");
        setLatestAppointments(appointmentsResponse.data || []);
      } catch (err) {
        newErrors.appointmentsList = "Failed to fetch latest appointments.";
        console.error("Appointments fetch error:", err);
        toast.error("Error loading latest appointments");
      }

      try {
        const refundRequestsResponse = await axiosInstance.get(
          `/refund/all-refund-requests?page=${page}&limit=${limit}`
        );
        setRefundRequests(refundRequestsResponse.data.refundRequests || []);
        setTotalPages(Math.ceil(refundRequestsResponse.data.total / limit));
      } catch (err) {
        newErrors.refundRequests = "Failed to fetch refund requests.";
        console.error("Refund requests fetch error:", err);
        toast.error("Error loading refund requests");
      }

      setErrors(newErrors);
      setLoading(false);
    };

    fetchDashboardData();
  }, [page, limit]);

  const handleRefundAction = async (requestId, action) => {
    try {
      const response = await axiosInstance.put(`/refund/ApproveRefund/${requestId}/${action}`);
      toast.success(response.data.message || `Refund request ${action}d successfully`);
      setRefundRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: action === "approve" ? "Approved" : "Rejected" } : req
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} refund request`);
      console.error(`Error ${action}ing refund request:`, err);
    }
  };

  const openRefundModal = (requestId, action) => {
    setSelectedRefundAction({ requestId, action });
    setIsModalOpen(true);
  };

  const confirmRefundAction = () => {
    if (selectedRefundAction) {
      handleRefundAction(selectedRefundAction.requestId, selectedRefundAction.action);
      setIsModalOpen(false);
      setSelectedRefundAction(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRefundAction(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const openRefundDetails = (refund) => {
    setSelectedRefund(refund);
  };

  const closeRefundDetails = () => {
    setSelectedRefund(null);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
      <div className="bg-white p-6 rounded-2xl shadow-xl border-t-4 border-teal-500 animate-fadeInUp">
        <h2 className="text-2xl sm:text-3xl text-teal-700 font-bold mb-6">
          Admin Dashboard
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-10 animate-fadeInUp delay-100">
            <div className="flex items-center gap-3 bg-white p-6 rounded-lg shadow-lg">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
              <p className="text-lg font-medium text-gray-700">Loading dashboard...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-100">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Users className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Doctors</p>
                  {errors.doctors ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{doctorsCount}</p>
                  )}
                </div>
              </div>
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-200">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <DollarSign className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Earnings</p>
                  {errors.appointments ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">${appointmentsCount}</p>
                  )}
                </div>
              </div>
              <div className="bg-teal-600 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-4 transform hover:scale-105 animate-fadeInUp delay-300">
                <div className="p-3 bg-yellow-400 rounded-full">
                  <Users className="w-8 h-8 text-teal-800" />
                </div>
                <div>
                  <p className="text-sm font-medium text-teal-100">Total Patients</p>
                  {errors.patients ? (
                    <p className="text-sm text-red-300">Error</p>
                  ) : (
                    <p className="text-2xl font-bold text-white">{patientsCount}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Latest Appointments */}
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-teal-700 mb-4 animate-fadeInUp delay-400">
                Latest Appointments
              </h3>
              {errors.appointmentsList ? (
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-400">
                  <p className="text-lg font-medium text-red-600">{errors.appointmentsList}</p>
                </div>
              ) : latestAppointments.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-400">
                  <p className="text-lg text-gray-500 font-medium">No recent appointments found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {latestAppointments.map((appt, index) => (
                    <div
                      key={appt.id}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                      style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-100 rounded-full">
                          <Calendar className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-bold text-sm sm:text-base">{appt.patient}</p>
                          <p className="text-sm text-gray-600">
                            {appt.time} | {appt.doctor} | {appt.date}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                          appt.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : appt.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : appt.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {appt.status === "Completed" && <CheckCircle className="w-4 h-4" />}
                        {appt.status === "Cancelled" && <XCircle className="w-4 h-4" />}
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refund Requests */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-teal-700 mb-4 animate-fadeInUp delay-400">
                Refund Requests
              </h3>
              {errors.refundRequests ? (
                <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 text-center animate-fadeInUp delay-400">
                  <p className="text-lg font-medium text-red-600">{errors.refundRequests}</p>
                </div>
              ) : refundRequests.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg shadow-md animate-fadeInUp delay-400">
                  <p className="text-lg text-gray-500 font-medium">No refund requests found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {refundRequests.map((req, index) => (
                    <div
                      key={req.id}
                      className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-100 hover:bg-teal-50/50 transform hover:scale-[1.02] animate-fadeInUp"
                      style={{ animationDelay: `${(index + 5) * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-100 rounded-full">
                          <Users className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-bold text-sm sm:text-base">{req.patient}</p>
                          <p className="text-sm text-gray-600">{`Amount: $${req.amount}`}</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        {req.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => openRefundModal(req.id, "approve")}
                              className="flex items-center gap-2 px-4 py-1.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() => openRefundModal(req.id, "reject")}
                              className="flex items-center gap-2 px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                            <button
                              onClick={() => openRefundDetails(req)}
                              className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:scale-105"
                            >
                              <Info className="w-4 h-4" />
                              Details
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1 text-sm rounded-full font-medium flex items-center gap-2 ${
                              req.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {req.status === "Approved" && <CheckCircle className="w-4 h-4" />}
                            {req.status === "Rejected" && <XCircle className="w-4 h-4" />}
                            {req.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {totalPages > 1 && (
                    <div className="flex justify-center gap-4 mt-6 animate-fadeInUp delay-400">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 font-medium">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                      >
                        Next
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Refund Details Modal */}
            {selectedRefund && (
              <RefundModel
                selectedRefund={selectedRefund}
                closeRefundDetails={closeRefundDetails}
              />
            )}

            {/* Confirm Modal for Refund Actions */}
            <ConfirmModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onConfirm={confirmRefundAction}
              title={`Confirm Refund ${selectedRefundAction?.action === "approve" ? "Approval" : "Rejection"}`}
              message={`Are you sure you want to ${selectedRefundAction?.action} this refund request?`}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;