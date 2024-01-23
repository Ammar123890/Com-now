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
      team: { $in: [teamId] },
      userType: "team-member",
    });

    if (existingUsers >= maxAllowedUser) {
      throw new Error(errorStrings.CANNOT_ADD_MORE_MEMBERS[lang]);
    }

    const user = await teamMemberMethods.addMember(req.body, req.user, type, group);

    // Update the UserOrder for the team
    let userOrder = await UserOrder.findOne({ team: teamId });

    if (!userOrder) {
      // Create a new UserOrder if it doesn't exist
      userOrder = new UserOrder({ team: teamId, order: [] });
    }

    const maxRank = userOrder.order.length > 0 ? userOrder.order[userOrder.order.length - 1].rank : 0;

    userOrder.order.push({
      user: user._id,
      rank: maxRank + 1,
    });

    await userOrder.save();

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

controller.reAddMemberNew = async function (req, res, next) {
  try {

    const user = await teamMemberMethods.reAddMemberNew(req.body);

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

controller.logoutMember = async function (req, res, next) {
  try {
     await teamMemberMethods.logoutMember(req);

    res.json({
      success: true,
      message: "Successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
}

module.exports = controller;
