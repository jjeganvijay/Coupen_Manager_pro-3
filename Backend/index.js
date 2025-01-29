const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose
  .connect("mongodb+srv://co:co@coupen.wtjqd.mongodb.net/")
  .then(() => console.log("MongoDB Connection Successful"))
  .catch((err) => console.log("MongoDB Connection Unsuccessful", err));

// Define Coupon Schema
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  expirationDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

const Coupon = mongoose.model("Coupon", couponSchema);

// Create a new coupon
app.post("/create-coupon", async (req, res) => {
  try {
    const { code, discount, expirationDate } = req.body;
    const newCoupon = new Coupon({ code, discount, expirationDate });
    await newCoupon.save();
    res.status(201).json({ message: "Coupon created successfully" });
  } catch (err) {
    res.status(400).json({ message: "Error creating coupon", error: err });
  }
});

// Get all active coupons
app.get("/coupons", async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Error fetching coupons", error: err });
  }
});

// Redeem a coupon
app.post("/redeem-coupon", async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found or expired" });
    }
    coupon.isActive = false;
    await coupon.save();
    res.status(200).json({ message: "Coupon redeemed successfully", discount: coupon.discount });
  } catch (err) {
    res.status(500).json({ message: "Error redeeming coupon", error: err });
  }
});

// Delete a coupon
app.delete("/delete-coupon", async (req, res) => {
  try {
    const { code } = req.body;
    const deletedCoupon = await Coupon.findOneAndDelete({ code });
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting coupon", error: err });
  }
});

// Start the server
app.listen(3000, () => console.log("Server started on port 3000"));
