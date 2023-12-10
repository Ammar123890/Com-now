const socketMethods = {};

const userMethods = require("../models/User/methods");

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

module.exports = socketMethods;
