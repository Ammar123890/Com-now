const teamMethods = require("../../../models/Team/methods");
const helpers = require("./helpers");

const controller = {};

controller.createNewTeam = async function (req, res, next) {
  try {
    const error = helpers.createNewTeamValidation(req.body);
    if (error) throw new Error(error);

    const team = await teamMethods.createTeam(
      { name: req.body.name, lang: req.body.lang },
      req.user,
    );

    res.json({
      data: { team },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.getOnlineUsers = async function (req, res, next) {
  try {
    const onlineUsers = await teamMethods.getOnlineUsers(
      { team: req.user.team, lang: req.body.lang },
      req.user
    );

    res.json({
      data: { onlineUsers },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.editTeam = async function (req, res, next) {
  try {
    const team = await teamMethods.editTeam({ name: req.body.name, lang: req.body.lang }, req.user);

    res.json({
      data: { team },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

module.exports = controller;
