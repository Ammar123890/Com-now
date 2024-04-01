const socketMethods = {};
const User = require("../models/User");

const userMethods = require("../models/User/methods");
const firebaseAdmin = require("./firebaseAdmin");

socketMethods.callUser = async (payload, callback = () => {}, socket) => {
  try {
    await userMethods.callUser(payload, socket.user);

    socket.to(payload.user).emit("call", { user: socket.user });

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

socketMethods.callStatusChange = async (
  payload,
  callback = () => {},
  socket
) => {
  try {
    await userMethods.callStatusChange(payload, socket.user);
    socket.to(payload.user).emit("call-status-change", {
      user: socket.user,
      status: payload.status,
    });

    callback({
      success: true,
      message: "Successful",
      data: {},
    });
  } catch (e) {
    console.log("E =>", e);
    callback({
      success: false,
      message: e.message,
    });
  }
};

socketMethods.callTeam = async (data, socket, io) => {
  try {
    const teamId = data.teamId; // Assuming this comes from the client request
    const teamUsers = await User.find({
      $or: [{ defaultTeam: teamId }, { team: teamId }],
      _id: { $ne: socket.user._id } // Exclude the caller to prevent self-calling
    });

    // No longer filtering by `isOnline`. Prepare notifications for all team members with a FCM token.
    const tokens = teamUsers.filter(user => user.fcmToken).map(user => user.fcmToken);

    if (tokens.length > 0) {
      const multicastPayload = {
        tokens: tokens,
        title: `${socket.user.fullName} is calling the team.`,
        data: { 
          callType: 'teamCall',
          teamId: teamId,
          fromUser: JSON.stringify({
            fullName: socket.user.fullName,
            _id: socket.user._id.toString(),
            userType: socket.user.userType,
          }),
        }
      };

      // Send a multicast notification to all team members
      await firebaseAdmin.sendMulticastNotification(multicastPayload);
    }

    // Emit a real-time call event to each online team member's socket
    teamUsers.forEach(teamUser => {
      if (teamUser.isOnline) {
        io.to(teamUser._id.toString()).emit("team-call", {
          fromUser: socket.user,
          teamId: teamId,
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
