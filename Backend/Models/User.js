import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    medicalHistory: {
      type: String,
    },
    image: {
      type: String,
      required: false
    },
    isAdmin: {
      type: Boolean,
      default: false, // Add for admin role
    },
    appointments: [
      {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
        appointmentDate: Date,
        time: String,
        status: {
          type: String,
          enum: ["Pending", "Completed", "Cancelled", "Cancellation Requested"],
          default: "Pending",
        },
        paymentIntentId: { type: String }, // For Stripe refunds
      },
    ],
    notifications: [
      {
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        isRead: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const Patient = mongoose.model("User", patientSchema);
export default Patient;