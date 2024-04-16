const User = require("../../../models/User");
const helpers = require("./helpers");
const errorStrings = require("../../../config/errorStrings");
const socketMethods = require("../../../utils/socketMethods");

const controller = {};

controller.callAUser = async function (req, res, next) {
  try {
    const error = helpers.callAUserValidation(req.body);

    if (error) {
      throw new Error(error);
    }

    const lang = req.body.lang || "en";

    if (req.user._id.toString() === req.body.user) {
      throw new Error(errorStrings.CANNOT_SELF_CALL[lang]);
    }

    const socket = req.app.get("socketIO");
    socket.user = req.user;

    const dataToReturn = await new Promise((resolve, reject) => {
      socketMethods.callUser(
        req.body,
        (data) => {
          if (!data.success) {
            reject(data.message);
          }

          resolve(data);
        },
        socket
      );
    });

    res.json({ ...dataToReturn });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.callStatusChange = async function (req, res, next) {
  try {
    const error = helpers.callStatusChangeValidation(req.body);

    if (error) {
      throw new Error(error);
    }

    const lang = req.body.lang || "en";

    if (req.user._id.toString() === req.body.user) {
      throw new Error(errorStrings.CANNOT_SELF_CALL[lang]);
    }

    const socket = req.app.get("socketIO");
    socket.user = req.user;

    const dataToReturn = await new Promise((resolve, reject) => {
      socketMethods.callStatusChange(
        req.body,
        req.user,
        (data) => {
          if (!data.success) {
            reject(data.message);
          }

          resolve(data);
        },
        socket
      );
    });

    res.json({ ...dataToReturn });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.callTeam = async function (req, res, next) {
  try {
    const teamId = req.body.teamId; // Extract the teamId from the request body
    const socket = req.app.get("socketIO"); // Get the socket.io instance

    // Mimic the socket object structure expected by callTeam
    const fakeSocket = { user: req.user };
    await socketMethods.callTeam({ teamId: teamId }, fakeSocket, socket);

    res.json({
      success: true,
      message: "Team call initiated successfully."
    });
  } catch (e) {
    next({ message: e.message, status: 400 });
  }
};


module.exports = controller;
