const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json());

// ============ REPLACE WITH YOUR RAZORPAY KEYS ============
// Step 1: Go to https://dashboard.razorpay.com/app/keys
// Step 2: Copy your Key ID and Key Secret
// Step 3: Replace below
// =========================================================

const razorpay = new Razorpay({
  key_id: "rzp_test_Stc58qwwwWGkkN", // 🔴 REPLACE THIS
  key_secret: "KWn4vB0xEhwmOihmWM2cyLMi", // 🔴 REPLACE THIS
});

// Create order endpoint
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    const options = {
      amount: amount * 100, // Amount in paise (e.g., 59900 = ₹599)
      currency: currency || "INR",
      receipt: receipt || "order_" + Date.now(),
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    console.log("Order created:", order);
    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment endpoint
app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", "KWn4vB0xEhwmOihmWM2cyLMi") // 🔴 REPLACE THIS
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is successful
      console.log("Payment verified successfully:", razorpay_payment_id);
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      });
    } else {
      console.log("Payment verification failed");
      res.json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get Razorpay Key ID (for frontend)
app.get("/api/get-key", (req, res) => {
  res.json({ key_id: "rzp_test_Stc58qwwwWGkkN" }); // 🔴 REPLACE THIS
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`💰 Payment server running on http://localhost:${PORT}`);
  console.log(`Ready to accept payments!`);
});
