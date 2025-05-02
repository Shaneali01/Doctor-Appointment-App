import express from 'express'
import { Chat } from '../Controllers/Chatbot.js';
const router=express.Router();
router.post('/get-chat',Chat);

export default router