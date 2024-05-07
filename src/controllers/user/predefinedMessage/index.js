const predefinedMessageMethods = require("../../../models/PredefinedMessages/methods");
const helpers = require("./helpers");
const PredefinedMessage = require("../../../models/PredefinedMessages");
const errorStrings = require("../../../config/errorStrings");
const PredefinedMessageOrder = require("../../../models/PredefinedMessageOrder");

const controller = {};

controller.createMessage = async function (req, res, next) {
  try {
    const { lang = "de" } = req.body;
    const error = helpers.createMessageValidation(req.body);
    if (error) throw new Error(error);

    const allowedMessage =
      req.user.subscription?.subscription?.maxTextTemplates || 0;

    const existingMessages = await PredefinedMessage.count({
      team: req.user.defaultTeam,
      isDeleted: false,
    });

    if (existingMessages >= allowedMessage) {
      throw new Error(errorStrings.CANNOT_ADD_MORE_TEMPLATES[lang]);
    }

    const predefinedMessage = await predefinedMessageMethods.createMessage(
      req.body,
      req.user
    );

    res.json({
      data: { predefinedMessage },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.deleteMessage = async function (req, res, next) {
  try {
    const error = helpers.deleteMessageValidation(req.body);
    if (error) throw new Error(error);

    await predefinedMessageMethods.deleteMessage(req.body, req.user);

    res.json({
      data: {},
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.editMessage = async function (req, res, next) {
  try {
    const error = helpers.editMessageValidation(req.body);
    if (error) throw new Error(error);

    const predefinedMessage = await predefinedMessageMethods.editMessage(
      req.body,
      req.user
    );

    res.json({
      data: { predefinedMessage },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.getMessage = async function (req, res, next) {
  const sort = req.query.sort || 'custom'; 
  try {
    const predefinedMessages = await predefinedMessageMethods.getAllMessages(
      req.user, sort
    );

    res.json({
      data: { predefinedMessages },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};


controller.setMessagesOrder = async function (req, res, next) {
  try {
    const error = helpers.setMessageOrderValidation(req.body);
    if (error) throw new Error(error);

    await PredefinedMessageOrder.updateOne(
      { user: req.user._id },
      {
        user: req.user._id,
        orders: req.body.orders,
      },
      { upsert: true }
    );

    res.json({
      data: {},
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

module.exports = controller;
