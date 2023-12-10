const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");

const keys = require("../../config/keys")

const schema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    type: {
      type: String,
      enums: ["message", "notification"],
    },
    message: {
      text: String,
      type: {
        type: String,
        enums: ["text", "audio"],
        required: [true, "Type is required"],
      },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

schema.set('toJSON', { virtuals: true })
schema.plugin(uniqueValidator, { message: "{PATH} already exist." });
schema.plugin(mongooseLeanVirtuals);
schema.virtual("message.audioUrl").get(function () {
  if (this.message.type === "audio") {
    return keys.BASE_URL.replace("api", "") + this.message.text;
  }
})

const Notification = mongoose.model("notification", schema);

module.exports = Notification;
