const errorStrings = require("../../../config/errorStrings");
const teamMemberMethods = require("../../../models/TeamMember/methods");
const User = require("../../../models/User");
const UserOrder = require("../../../models/UserOrder");

const controller = {};


controller.addMember = async function (req, res, next) {
  try {
    const { lang = "en", type, group } = req.body;
    const maxAllowedUser = req.user.subscription?.subscription?.maxUsers || 0;
    const teamId = type === 'group' ? group : req.user.defaultTeam;
    const existingUsers = await User.count({
      team: { $in: [req.user.defaultTeam] },
      userType: "team-member",
    });

    if (existingUsers >= maxAllowedUser) {
      throw new Error(errorStrings.CANNOT_ADD_MORE_MEMBERS[lang]);
    }

    const user = await teamMemberMethods.addMember(req.body, req.user, type, group);

    res.json({
      data: { user },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.reAddMember = async function (req, res, next) {
  try {

    const user = await teamMemberMethods.reAddMember(req.body, req.user);

    res.json({
      data: { user },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
}

controller.getMembers = async function (req, res, next) {
  try {
    const teamMembers = await teamMemberMethods.getMembers(req);

    res.json({
      data: { teamMembers },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.getAllMembers = async function (req, res, next) {
}

controller.leaveTeam = async function (req, res, next) {
  try {
    await teamMemberMethods.leaveTeam(req.body, req.user);

    res.json({
      data: {},
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.changeMemberStatus = async function (req, res, next) {
  try {
    const teamMember = await teamMemberMethods.changeStatus(req.body, req.user  );

    if (req.body.status === "unblocked") {
      await teamMemberMethods.reshuffleOrdersAfterUnblock(req.body);
    }

    res.json({
      data: { teamMember },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.editMember = async function (req, res, next) {
  try {
    const teamMember = await teamMemberMethods.editMember(req.body, req.user);
    res.json({
      data: { teamMember },
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.deleteMember = async function (req, res, next) {
  try {
    // Pass only the teamMember ID and group ID (if provided)
    await teamMemberMethods.delete(req.body, req.user);

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
