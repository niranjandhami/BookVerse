import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/orderModel.js";

let razorpay = null;

if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

export const getRazorpayKey = (req, res) => {
  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
  });
};
console.log("KEY:", process.env.RAZORPAY_KEY_ID);
console.log("SECRET:", process.env.RAZORPAY_KEY_SECRET);
console.log("RAZORPAY OBJECT:", razorpay);
export const createRazorpayOrder = async (req, res) => {
  if (!razorpay) {
    return res.status(500).json({
      message: "Razorpay is not configured yet.",
    });
  }

  try {
    const { amount } = req.body;

    const options = {
      amount: Math.round(amount * 100), // ₹ → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to create Razorpay order" });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  if (!razorpay) {
    return res.status(500).json({
      message: "Razorpay is not configured yet.",
    });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    order.paymentResult = {
      id: razorpay_payment_id,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
      email_address: "",
    };

    await order.save();

    res.json({
      success: true,
      message: "Payment Successful",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};