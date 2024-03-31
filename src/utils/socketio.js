const { Server } = require("socket.io");
const { isTokenValid } = require("../middlewares/isUser");
const logger = require("./logger");
const socketMethods = require("./socketMethods");
const userMethods = require("../models/User/methods");
const teamMethods = require("../models/Team/methods");
const User = require("../models/User");

module.exports = (httpServer, app) => {
  const io = new Server(httpServer, {});
  app.set("socketIO", io);

  // Authorization Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.headers.authorization;

      const authUser = await isTokenValid(token);
      socket.user = authUser.user;

      next();
    } catch (e) {
      next(e);
    }
  });

  io.on("connection", async (socket) => {
    logger.printLabel("A new socket connected: ");

    socket.join(socket.user._id.toString());

    // Function to handle broadcasting offline status to a team
    async function broadcastOfflineStatus(io, teamId, disconnectedUser) {
      const allTeamUsers = await User.find({
        $or: [{ defaultTeam: teamId }, { team: teamId }],
        _id: { $ne: disconnectedUser._id } // Exclude the disconnected user
      }).lean();

      // Emit the offline event to all users in the team except the disconnected one
      allTeamUsers.forEach((item) => {
        io.to(item._id.toString()).emit("offline-user", {
          user: disconnectedUser,
        });
      });
    }


    socket.on("disconnect", async () => {
      logger.printLabel("Socket is disconnected: ");

      // Mark the user as offline in the database
      await userMethods.toggleOnline({ isOnline: false }, socket.user);

      // Broadcast to default team
      if (socket.user.defaultTeam) {
        await broadcastOfflineStatus(io, socket.user.defaultTeam, socket.user);
      }

      // Broadcast to other teams
      if (socket.user.team && socket.user.team.length) {
        for (const teamId of socket.user.team) {
          await broadcastOfflineStatus(io, teamId, socket.user);
        }
      }
    });


    socket.on("call", (payload, callback) => {
      socketMethods.callUser(payload, callback, socket);
    });

    socket.on("call-status-change", (payload, callback) => {
      socketMethods.callStatusChange(payload, callback, socket);
    });

    await userMethods.toggleOnline({ isOnline: true }, socket.user);

    // Function to handle broadcasting to a team
    async function broadcastOnlineStatus(io, teamId, onlineUserCount) {
      const allUsers = await User.find({
        $or: [{ defaultTeam: teamId }, { team: teamId }],
        isOnline: true,
      }).lean();



      allUsers.forEach((item) => {
        io.to(item._id.toString()).emit("online-user", {
          onlineUserCount,
          user: socket.user,
        });
      });
    }



    // Check if the user has a default team and broadcast to it
    if (socket.user.defaultTeam) {
      const onlineUsersDefaultTeam = await teamMethods.getOnlineUsers({ team: socket.user.defaultTeam, type: "team" }, socket.user);

      await broadcastOnlineStatus(io, socket.user.defaultTeam, onlineUsersDefaultTeam);
    }

    // Broadcast to other teams
    if (socket.user.team && socket.user.team.length) {
      for (const teamId of socket.user.team) {
        if (String(teamId) !== String(socket.user.defaultTeam)) { // Prevent double broadcasting
          const onlineUsersOtherTeams = await teamMethods.getOnlineUsers({ team: teamId, type: "other" }, socket.user);
          await broadcastOnlineStatus(io, teamId, onlineUsersOtherTeams);
        }
      }
    }

  });
};


