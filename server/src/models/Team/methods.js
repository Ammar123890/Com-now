const errorStrings = require("../../config/errorStrings");
const TeamMember = require("../TeamMember");
const Team = require("./index");
const User = require("../User");

const methods = {};

methods.createTeam = async (body, user) => {
  const lang = body.lang || "en";
  try {
    const teamName = body.name;

    // Check if a team with the same name already exists for this user
    const existingTeam = await Team.findOne({ user: user._id, name: teamName });
    if (existingTeam) {
      throw new Error(errorStrings.TEAM_SAME_NAME[lang]);
    }

    // Create a new team
    const team = new Team({ user: user._id, name: teamName });
    await team.save();

    // Update User: Set 'defaultTeam' if teamName is 'allTeamMember', else push to 'team' array
    if (teamName === "allTeamMember") {
      await User.findByIdAndUpdate(
        user._id,
        { defaultTeam: team._id },
        { new: true, safe: true, upsert: true }
      ).lean();
    } else {
      await User.findByIdAndUpdate(
        user._id,
        { $push: { team: team._id } },
        { new: true, safe: true, upsert: true }
      ).lean();
    }

    return team;
  } catch (e) {
    throw e;
  }
};

methods.getAllTeams = async (body, user) => {
  const lang = body.lang || "en";
  try {
    // Return teams where the name is not "allTeamMember"
    const teams = await Team.find({ 
      user: user._id, 
      name: { $ne: "allTeamMember" } // $ne stands for 'not equal'
    }).lean();

    if (!teams || teams.length === 0) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }

    return teams;
  } catch (e) {
    throw e;
  }
}


methods.getTeamById = async (body, user) => {
  const lang = body.lang || "en";
  try {
    const team = await Team.findById(body.id).lean();
    if (!team) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }

    return team;
  } catch (e) {
    throw e;
  }
}

methods.editTeam = async (body, user, groupId) => {
  try {
    const lang = body.lang || "en";
    const payload = {
      name: body.name,
    };

    //first check if the user has a team with the same name
    const existingTeam = await Team.findOne({
      user: user._id,
      name: payload.name,
    });

    if (existingTeam) {
      throw new Error(errorStrings.TEAM_SAME_NAME[lang]);
    }

    const team = await Team.findOneAndUpdate({ _id: groupId }, payload, {
      new: true,
    }).lean();

    if (!team) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }

    return team;
  } catch (e) {
    throw e;
  }
};

methods.getOnlineUsers = async (body) => {
  try {
    const lang = body.lang || "en";
    if (!body.team) {
      throw new Error(errorStrings.TEAM_ID_REQUIRED[lang]);
    }

    const query = {
      team: body.team,
      isOnline: true,
    };

    const onlineUsers = await User.countDocuments(query);

    return onlineUsers;
  } catch (e) {
    throw e;
  }
};

methods.getTeamDetails = async (body, user) => {
  try {
    const query = {
      user: user._id,
    };

    if (body && body.team) {
      query._id = body.team;
    }

    const team = await Team.findOne(query).lean();

    if (!team) {
      return null;
    }

    const onlineUsers = await User.countDocuments({
      team: team._id,
      isOnline: true,
    });

    return { ...team, onlineUsers };
  } catch (e) {
    throw e;
  }
};

methods.deleteById = async (body) => {
  try {
    const team = await Team.findOneAndDelete({
      _id: body.team,
    });

    return team;
  } catch (e) {
    throw e;
  }
};

module.exports = methods;
