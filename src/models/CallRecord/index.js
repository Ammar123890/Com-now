const mongoose = require("mongoose");

const callRecordSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "team"
  },
  callId: {
    type: mongoose.Schema.Types.ObjectId,
    default: mongoose.Types.ObjectId
  },
  time: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'pending'
  },
  responses: [{
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    status: {
      type: String,
      default: 'pending'
    },
    respondedAt: Date
  }]
});

const CallRecord = mongoose.model("callRecord", callRecordSchema);
module.exports = CallRecord;
