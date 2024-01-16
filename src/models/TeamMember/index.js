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

const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    LastName: {
      type: String,
    },
    initals: {
      type: String,
      uppercase: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
      default: null,
    },
    defaultTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
      default: null,
    },
    color:{
      type: String,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    enrollmentCode: {
      code: {
        type: String,
        unique: [true, "Enrollment code should be unique"],
      },
      expiry: {
        type: Date,
      },
    },
    lastCall: {
      type: lastCall,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const TeamMember = mongoose.model("teamMember", schema);

module.exports = TeamMember;
