const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orders: [
      {
        rank: {
          type: Number,
        },
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "predefinedMessage",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const PredefinedMessageOrder = mongoose.model("predefinedMessageOrder", schema);

module.exports = PredefinedMessageOrder;
