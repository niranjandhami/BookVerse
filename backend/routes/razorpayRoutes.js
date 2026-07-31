import express from "express";
import {
  getRazorpayKey,
  createRazorpayOrder,
  verifyPayment,
} from "../controllers/razorpayController.js";

const router = express.Router();

router.get("/key", getRazorpayKey);
router.post("/create-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);

export default router;