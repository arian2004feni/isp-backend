const mongoose = require("mongoose");

/*
  {
    "ispId": "65f123abc...",
    "username": "user001",
    "packageId": "65f456def...",
    "profileName": "20Mbps",
    "status": "active",
    "billingStatus": "paid",
    "isOnline": true
  }
*/

const userSchema = new mongoose.Schema(
  {
    // ─────────────────────────────
    // Ownership
    // ─────────────────────────────
    ispId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ISP",
      required: [true, "ISP reference is required"],
      index: true,
    },

    // ─────────────────────────────
    // PPPoE Credentials (MikroTik)
    // ─────────────────────────────
    username: {
      type: String,
      required: [true, "PPPoE username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [32, "Username cannot exceed 32 characters"],
      match: [/^[a-zA-Z0-9_.-]+$/, "Invalid PPPoE username format"],
      index: true,
    },

    password: {
      type: String,
      required: [true, "PPPoE password is required"],
      minlength: [4, "Password must be at least 4 characters"],
      maxlength: [64, "Password too long"],
      select: false, // NEVER expose
    },

    // MikroTik internal ID (assigned by RouterOS)
    mikrotikId: {
      type: String,
      trim: true,
    },

    // ─────────────────────────────
    // Package & Speed
    // ─────────────────────────────
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: [true, "Package is required"],
    },

    profileName: {
      type: String,
      required: [true, "MikroTik profile name is required"],
      trim: true,
    },

    // ─────────────────────────────
    // Status Control (CRITICAL)
    // ─────────────────────────────
    status: {
      type: String,
      enum: {
        values: ["active", "blocked"],
        message: "Status must be active or blocked",
      },
      default: "active",
      index: true,
    },

    billingStatus: {
      type: String,
      enum: {
        values: ["paid", "due"],
        message: "Billing status must be paid or due",
      },
      default: "paid",
      index: true,
    },

    // ─────────────────────────────
    // Session & Sync Info
    // ─────────────────────────────
    isOnline: {
      type: Boolean,
      default: false,
    },

    lastSeenAt: {
      type: Date,
    },

    lastSyncedAt: {
      type: Date,
    },

    // ─────────────────────────────
    // Metadata (Optional but Pro)
    // ─────────────────────────────
    ipAddress: {
      type: String,
      match: [
        /^(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}$/,
        "Invalid IP address",
      ],
    },

    macAddress: {
      type: String,
      uppercase: true,
      match: [/^([0-9A-F]{2}:){5}[0-9A-F]{2}$/, "Invalid MAC address"],
    },

    notes: {
      type: String,
      maxlength: 300,
    },

    // ─────────────────────────────
    // Soft Delete (Real ISP Practice)
    // ─────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ─────────────────────────────
// Compound Index (CRITICAL)
// ─────────────────────────────
userSchema.index({ ispId: 1, username: 1 }, { unique: true });

module.exports = mongoose.model("User", userSchema);
