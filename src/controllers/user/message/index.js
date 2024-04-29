const User = require("../../../models/User");
const helpers = require("./helpers");
const Notification = require("../../../models/Notification");
const firebaseAdmin = require("../../../utils/firebaseAdmin");
const errorStrings = require("../../../config/errorStrings");
const Team = require("../../../models/Team");

const controller = {};

controller.sendMessage = async function (req, res, next) {
  try {
    const error = helpers.sendMessageValidation(req.body);
    if (error) {
      throw new Error(error);
    }

    const lang = req.body.lang || "en";
    const user = await User.findOne({ _id: req.body.user });

    if (!user) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }

    const payload = {
      user: req.body.user,
      type: "message",
      message: {
        text: req.body.text,
        sender: req.user._id,
        reciever: req.body.user,
        type: req.body.type,
      },
    };

    const notification = new Notification(payload);
    await notification.save();
    if (user.fcmToken) {
      const fromUser = {
        fullName: req.user.fullName,
        _id: req.user._id,
        userType: req.user.userType,
      };
      // const NEW_MESSAGE_EN = "New message from";
      const NEW_MESSAGE_DE = "Neue Nachricht von";
      // const title = req.body.lang === "en" ? NEW_MESSAGE_EN : NEW_MESSAGE_DE;
      const title = NEW_MESSAGE_DE;

 
      const notificationPayload = {
        title: `${title} ${req.user.fullName}`,
        body: req.body.type === "audio" ? "Audio message" : req.body.text,
        data: {
          fromUser: JSON.stringify(fromUser),
        },
        token: user.fcmToken,
        removeCallCategory: true,
      };
 

      await firebaseAdmin.sendNotification(notificationPayload);
    }

    res.json({
      data: {},
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.getMessages = async function (req, res, next) {
  try {
    const messages = await Notification.find({
      user: req.user._id,
      isDeleted: false,
      isActive: true,
      type: "message",
    })
      .populate({
        path: "message.sender",
        select: ["fullName", "email"],
      })
      .sort({ createdAt: -1 });

    res.json({
      data: { messages: messages },
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.sendMessageToGroup = async function (req, res, next) {
  try {
    const { teamId, text, type } = req.body;
    const lang = req.body.lang || "en";

    // Validate input
    const error = helpers.sendMessageValidation(req.body);
    if (error) {
      throw new Error(error);
    }

    // Fetch team members
    const team = await Team.findById(teamId).populate('user');
    if (!team) {
      throw new Error('Team not found');
    }

    const users = await User.find({ team: teamId, blocked: false });
    const tokens = users.map(user => user.fcmToken).filter(token => token != null);

    const fromUser = {
      fullName: req.user.fullName,
      _id: req.user._id,
      userType: req.user.userType,
    };

    const title = `Neue Nachricht von ${req.user.fullName}`;
    const body = type === "audio" ? "Audio message" : text;

    const notificationPayload = {
      title,
      body,
      data: { fromUser: JSON.stringify(fromUser) },
      tokens,
    };

    // Send notifications
    const notificationResult = await firebaseAdmin.sendMulticastNotification(notificationPayload);
    if (!notificationResult.success) {
      throw new Error('Failed to send notifications');
    }

    res.json({
      success: true,
      message: "Messages sent successfully",
    });
  } catch (e) {
    next({ message: e.message || 'Failed to send messages', status: 400 });
  }
};


module.exports = controller;
