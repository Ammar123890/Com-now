const socketMethods = {};
const User = require("../models/User");

const userMethods = require("../models/User/methods");
const firebaseAdmin = require("./firebaseAdmin");
const CallRecord = require('./../models/CallRecord/index'); 
const mongoose = require('mongoose');

socketMethods.callUser = async (payload, callback = () => {}, socket) => {
  try {
    const callRecord = new CallRecord({
      caller: socket.user._id,
      team: null, // No team for individual calls
      callId: new mongoose.Types.ObjectId(), // Unique call identifier
      responses: [{
        member: payload.user, // The recipient of the call
        status: 'pending'
      }]
    });

    // Save the call record
    await callRecord.save();

    // Proceed with additional user-specific logic
    await userMethods.callUser(payload, socket.user, callRecord.callId);

    // Emitting the call event to the recipient with callId
    socket.to(payload.user).emit("call", {
      user: socket.user,
      callId: callRecord.callId, // Include callId in the event data
    });

    callback({
      success: true,
      message: "Successful",
      data: {},
    });
  } catch (e) {
    callback({
      success: false,
      message: e.message,
    });
  }
};

socketMethods.callStatusChange = async (payload, user, callback, socket) => {
  try {
    const callRecord = await CallRecord.findOne({
      callId: payload.callId,
      'responses.member': user._id
    });

    if (!callRecord) {
      throw new Error("Call record not found or user is not a valid member of this call.");
    }

    const response = callRecord.responses.find(r => r.member.toString() === user._id.toString());
    if (!response) {
      throw new Error("Response for the user not found in call record.");
    }

    if (response.status !== 'pending') {
      throw new Error("This call has already been answered.");
    }

    // Update the status in the call record
    response.status = payload.status;
    response.respondedAt = new Date();
    await callRecord.save();

    // Emitting the status change to the socket
    socket.to(callRecord.caller.toString()).emit("call-status-change", {
      user: user._id,
      status: payload.status,
      callId: payload.callId
    });

    // Call additional business logic and notification handling
    await userMethods.callStatusChange(payload, user);

    callback({
      success: true,
      message: "Call status updated successfully."
    });
  } catch (e) {
    console.error("Error in callStatusChange:", e);
    callback({
      success: false,
      message: e.message
    });
  }
};


socketMethods.callTeam = async (data, socket, io) => {

  try {
    const teamId = data.teamId;
    const newCallRecord = new CallRecord({
      caller: socket.user._id,
      team: teamId
    });

    const teamUsers = await User.find({
      $or: [{ defaultTeam: teamId }, { team: { $in: [teamId] } }],
      _id: { $ne: socket.user._id }
    });

    newCallRecord.responses = teamUsers.map(user => ({
      member: user._id
    }));

    await newCallRecord.save();

    // Notify all team members
    teamUsers.forEach(teamUser => {
      if (teamUser.fcmToken) {
        // Send push notification logic
      }
      if (teamUser.isOnline) {
        io.to(teamUser._id.toString()).emit("team-call", {
          fromUser: socket.user,
          teamId: teamId,
          callId: newCallRecord.callId,
          message: `${socket.user.fullName} is calling the team.`
        });
      }
    });
  } catch (e) {
    console.error("Error in callTeam method:", e);
    throw e;
  }
};




module.exports = socketMethods;
