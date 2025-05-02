import express from 'express';
import User from '../Models/User.js';
import Doctor from '../Models/DoctorModel.js';
import cloudinary from '../Config/Cloudinary.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../Config/CreateToken.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { sendEmail } from '../Config/SendEmail.js';
dotenv.config();
export const Signup = async (req, res) => {
  try {
    const { name, email, password, age, gender, address, medicalHistory, image } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    const doctorEmailExists = await Doctor.findOne({ email });
    if (emailExists || doctorEmailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }


    let imageResult;
    if (image) {
      // Optional: Check base64 string size (approx 1MB limit)
      const base64SizeInMB = (image.length * 3) / 4 / (1024 * 1024); // Rough estimate
      if (base64SizeInMB > 1) {
        return res.status(400).json({ message: "Image size exceeds 1MB limit" });
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(image, {
        folder: "Doctor-Appoinment_Web-App/Doctors",
      });
      imageResult = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // Define a default image URL (or empty string if preferred)
    const defaultImageUrl = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; // Example default image
    const hashpassword = await bcrypt.hash(password,10)

    // Create new user
    const user = new User({
      name,
      email,
      password: hashpassword, // Note: You should hash the password before saving (e.g., using bcrypt)
      age,
      gender,
      address,
      medicalHistory,
      image: imageResult?.url || defaultImageUrl, // Use uploaded image URL or default
    });

    const token = await createToken(user);

    await user.save();
    return res.status(200).json({ message: "User created successfully",user:{id:user._id,name:user.name,
        role:user.role,
        email:user.email,
        image:user.image
    },token:token });
  } catch (error) {
    console.error("Error in signup:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
export const Login = async (req, res) => {
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email})
    if(!user){
      const doctor=await Doctor.findOne({email})
      if(!doctor){
        return res.status(404).json({ message: "User not found" });
      }
      else{
        const status=doctor.status;
        if(status!=="approved"){
          return res.status(401).json({ message: "Your account is not approved yet" });
        }
        const isPasswordValid = await bcrypt.compare(password,doctor.password);
        if(!isPasswordValid){
          return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = await createToken(doctor);
        return res.status(200).json({message:"Login successful",user:{id:doctor._id,name:doctor.name,role:doctor.role,email:doctor.email},token:token})
      }
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = await createToken(user);
    return res.status(200).json({message:"Login successful",user:{id:user._id,name:user.name,role:user.role,email:user.email,image:user.image},token:token})

  }
  catch(error){
    console.error("Error in Login:", error);
    return res.status(500).json({ message: "Something went wrong", error: error.message });

  }
}
export const ForgotPassword = async(req,res)=> {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    // Save token and expiry
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    const resetUrl = `http://localhost:5173/reset-password?token=${token}`;
    const html = `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your Medical AI Assistant account.</p>
      <p>Click the link below to reset your password (valid for 1 hour):</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007E85; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      to: email,
      subject: 'Password Reset - Medical AI Assistant',
      html
    });

    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
export const Resetpassword=async(req,res)=>{
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }
    console.log(token)

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findOne({
      _id: decoded.userId,
     
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }
    const hashpassword = await bcrypt.hash(password,10)
    // Update password
    user.password = hashpassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}