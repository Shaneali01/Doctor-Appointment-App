import express from 'express'
import {  ForgotPassword, Login, Resetpassword, Signup } from '../Controllers/Auth.js';
const router = express.Router();

router.post('/signup',Signup);
router.post('/login',Login);
router.post("/forgot-password",ForgotPassword);
router.post("/reset-password",Resetpassword)

export default router