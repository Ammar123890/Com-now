const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    team:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

schema.plugin(uniqueValidator, { message: "{PATH} already exist." });

const Team = mongoose.model("team", schema);

module.exports = Team;
