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

    socket.on("disconnect", async () => {
      logger.printLabel("Socket is disconnected: ");

      const userID = socket.user._id.toString();
      const onlineUsers = io.sockets.adapter.rooms.get(userID) || new Set();

      if (onlineUsers.size == 0) {
        await userMethods.toggleOnline({ isOnline: false }, socket.user);

        // Notify offline event only if team exist
        if (socket.user.team) {
          const responses = await Promise.all([
            User.find({ team: socket.user.team }).lean(),
            teamMethods.getOnlineUsers({
              team: socket.user.team,
            }),
          ]);

          const allUsers = await responses[0];
          const onlineUsers = await responses[1];

          allUsers.forEach((item) => {
            socket.to(item._id.toString()).emit("offline-user", {
              onlineUsers,
              user: socket.user,
            });
          });
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

    // Notify online event only if team exist
    if (socket.user.team) {
      const responses = await Promise.all([
        teamMethods.getOnlineUsers({
          team: socket.user.team,
        }),
        User.find({ team: socket.user.team }).lean(),
      ]);

      const onlineUsers = responses[0];
      const allUsers = responses[1];

      allUsers.forEach((item) => {
        socket.to(item._id.toString()).emit("online-user", {
          onlineUsers,
          user: socket.user,
        });
      });
    }
  });
};

//
