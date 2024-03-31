const teamMethods = require("../../../models/Team/methods");
const helpers = require("./helpers");
const userOrderModel = require("../../../models/UserOrder/index");

const controller = {};

controller.createNewTeam = async function (req, res, next) {
  try {
    const error = helpers.createNewTeamValidation(req.body);
    if (error) throw new Error(error);

    const team = await teamMethods.createTeam(
      { name: req.body.name, lang: req.body.lang },
      req.user,
    );

    // create the user order for the team
    const userOrder = await userOrderModel.create({
      team: team._id,
    });
    await 

    res.json({
      data: { team },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.createDefaultTeam = async function (user) {
  try {
    const team = await teamMethods.createTeam(
      { name: "allTeamMember" },
      user,
    );
    const userOrder = await userOrderModel.create({
      team: team._id,
    });

    return team;

  } catch (e) {
    throw e;
  }
}

controller.getAllTeams = async function (req, res, next) {

  try {
    const teams = await teamMethods.getAllTeams(
      { lang: req.params.lang, type: req.query.type },
      req.user
    );

    res.json({
      data: { teams },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }

}

controller.getTeamById = async function (req, res, next) {
  try {
    console.log("pppp"+req.query.id);
    const team = await teamMethods.getTeamById(
      { id: req.params.id, lang: req.params.lang },
      req.user
    );

    res.json({
      data: { team },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
}

controller.getOnlineUsers = async function (req, res, next) {


  try {
    const onlineUsers = await teamMethods.getOnlineUsers(
      { team: req.params.id, lang: req.params.lang, type: req.query.type},
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
    const team = await teamMethods.editTeam({ name: req.body.name, lang: req.body.lang }, req.user, req.body.id);

    res.json({
      data: { team },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.deleteTeam = async function (req, res, next) {
  try {
    await teamMethods.deleteById(req.params.id, req.user);
    res.json({
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.reorderTeam = async function (req, res, next) {
  try {
    await teamMethods.reorderTeam(req.body, req.user);
    res.json({
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

module.exports = controller;
