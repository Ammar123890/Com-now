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
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const UserOrder = mongoose.model("userOrder", schema);

module.exports = UserOrder;
