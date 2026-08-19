import mongoose from "mongoose";
import { AUTH_CONSTANTS } from "../constants/auth.constants.js";

const tokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    type: {
      type: String,
      required: true,
      enum: [
        AUTH_CONSTANTS.ACCESS_TOKEN_TYPE,
        AUTH_CONSTANTS.REFRESH_TOKEN_TYPE,
      ],
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },

    replacedByTokenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Token",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Token = mongoose.model("Token", tokenSchema);

export default Token;