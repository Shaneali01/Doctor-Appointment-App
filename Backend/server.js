import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors"
import DoctorRoutes from './Routes/DoctorRoutes.js'
import AuthRoutes from './Routes/Auth.js'
import UserRoutes from './Routes/User.js'
import Refund from "./Routes/Refund.js"
import AdminRoute from "./Routes/Admin.js"
import Chatbot from "./Routes/Chatbot.js"
dotenv.config();
const app=express();
app.use(cors({
    origin: "http://localhost:5173",  // Allow only your frontend origin
    methods: "GET,POST,PUT,DELETE",   // Allowed HTTP methods
    credentials: true                 // Allow cookies and authorization headers
  }));
app.use(express.json({limit: '50mb'}));
mongoose.connect((process.env.MONGO_URI))
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
})
app.get('/', (req, res) => {
    res.send('Hello, World!');
})
app.use('/api/doctor', DoctorRoutes);
app.use('/api/auth', AuthRoutes);
app.use('/api/user', UserRoutes);
app.use("/api/refund",Refund);
app.use("/api/admin",AdminRoute)
app.use("/api/chatbot",Chatbot)
app.listen(process.env.PORT, () => {
    console.log('Server started on port 5000');
})
