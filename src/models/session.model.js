import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
      index: true,
    },

    userAgent: {
      type: String,
      default: null,
      trim: true,
      maxlength: 1000,
    },

    ipAddress: {
      type: String,
      default: null,
      trim: true,
      maxlength: 45,
    },

    device: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    browser: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    operatingSystem: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    country: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    city: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    timezone: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastUsedAt: {
      type: Date,
      default: null,
      index: true,
    },

    revokedAt: {
      type: Date,
      default: null,
      index: true,
    },

    revokeReason: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },

    loginAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    lastIpAddress: {
      type: String,
      default: null,
      trim: true,
      maxlength: 45,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

sessionSchema.index({
  userId: 1,
  isActive: 1,
});


sessionSchema.index({
  userId: 1,
  deviceId: 1,
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;