const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Text is required"]
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const PredefinedMessage = mongoose.model("predefinedMessage", schema);

module.exports = PredefinedMessage;
