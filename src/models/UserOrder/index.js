const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "team",
    },
    order: [
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

// Set the default value for the 'order' array
schema.path('order').default([]);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const UserOrder = mongoose.model("userOrder", schema);

module.exports = UserOrder;
