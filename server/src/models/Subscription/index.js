const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Type is required"],
    },
    maxUsers: {
      type: Number,
    },
    maxTextTemplates: {
      type: Number,
    },
    maxVoiceMessage: {
      type: Number,
    },
    code: {
      type: String,
      required: [true, "Code is required"],
      unqiue: true,
    },
    pricePerYear: {
      type: String,
    },
    pricePerMonth: {
      type: String,
    },
    perks: {},
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const Subscription = mongoose.model("subscription", schema);

module.exports = Subscription;
