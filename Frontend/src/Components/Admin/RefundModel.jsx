import React from 'react'

const RefundModel = ({selectedRefund, closeRefundDetails}) => {
  return (
    <div>
         <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeInUp">
                <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
                  <h3 className="text-xl font-bold text-teal-700 mb-4">Refund Request Details</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><span className="font-semibold">Patient:</span> {selectedRefund.patient}</p>
                    <p><span className="font-semibold">Doctor:</span> {selectedRefund.doctor}</p>
                    <p><span className="font-semibold">Date:</span> {selectedRefund.appointmentDate}</p>
                    <p><span className="font-semibold">Time:</span> {selectedRefund.appointmentTime}</p>
                    <p><span className="font-semibold">Amount:</span> ${selectedRefund.amount}</p>
                    <p><span className="font-semibold">Reason:</span> {selectedRefund.reason}</p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          selectedRefund.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedRefund.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedRefund.status}
                      </span>
                    </p>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={closeRefundDetails}
                      className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-all duration-200 transform hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
      
    </div>
  )
}

export default RefundModel
