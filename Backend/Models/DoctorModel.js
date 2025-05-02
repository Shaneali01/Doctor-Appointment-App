import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    specialty: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "doctor",
    },
    fees: {
        type: Number,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        enum: ["approved", "pending"],
        default: "approved",
    },
    appointments: [
        {
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            patientName: String,
            appointmentDate: Date,
            time: String,
            status: { 
                type: String, 
                enum: ["Pending", "Completed", "Cancelled", "Cancellation Requested"], 
                default: "Pending" 
            },
            feePaid: { type: Boolean, default: false },
            paymentIntentId: { type: String }, // For Stripe refunds
            sessionId: { type: String }, // Keep for payment session tracking
        },
    ],
    earnings: {
        type: Number,
        default: 0
    },
    notifications: [
        {
          message: { type: String, required: true },
          timestamp: { type: Date, default: Date.now },
          isRead: { type: Boolean, default: false },
        },
      ],
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;