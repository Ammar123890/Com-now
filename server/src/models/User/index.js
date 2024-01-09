const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const lastCall = new mongoose.Schema({
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  time: {
    type: Date,
  },
  status: {
    type: String,
  },
});

const otpSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    validated: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const schema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },
    userName: {
      type: String
    },
    email: {
      type: String,
      lowercase: true,
    },
    initials: {
      type: String,
      uppercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    leavedTeam: {
      type: Boolean,
      default: false,
    },
    leavedGroup: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: Array,
    },
    enrollmentCode: {
      code: {
        type: String,
      },
      expiry: {
        type: Date,
      },
    },
    defaultTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
      default: null,
    },
    team: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
      default: null,
    }],
    otp: {
      type: otpSchema,
      select: false,
      default: null,
    },
    lastCall: {
      type: lastCall,
      select: false,
    },
    userType: {
      type: String,
      required: [true, "User type is required"],
      enums: ["doctor", "team-member"],
    },
    fcmToken: {
      type: String,
    },
    subscription: {
      subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscription",
      },
      subscriptionTime: {
        type: Date,
      },
      isSubscribed: {
        type: Boolean,
        default: false,
      },
      expiry: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const User = mongoose.model("user", schema);

module.exports = User;
