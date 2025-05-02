import express from 'express'
import { CreateRefundRequest, GetAllRefundRequests, HandleRefundRequest } from '../Controllers/Refund.js';
import verifyToken from '../Middlewares/Verify-Token.js';
const router=express.Router();
router.post('/request',verifyToken,CreateRefundRequest);
router.get("/all-refund-requests",GetAllRefundRequests);
router.put("/ApproveRefund/:requestId/:action",HandleRefundRequest)

export default router
