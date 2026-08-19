import mongoose from "mongoose";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
      select: false,
    },

    purpose: {
      type: String,
      required: true,
      enum: Object.values(AUTH_CONSTANTS.OTP_PURPOSE),
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
      expires: 0,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    consumedAt: {
      type: Date,
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;