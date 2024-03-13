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

    // get the users total number of teams
    const userTeams = await Team.countDocuments({ user: user._id });

    // Create a new team
    const team = new Team({ user: user._id, name: teamName, rank: userTeams-1});
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
  const type = body.type || "asc"; // Default to "asc" if type is not provided

  try {
    let sortCriteria = {};
    if (type === "asc") {
      sortCriteria = { createdAt: 1 }; // Sort by creation time in ascending order
    } else if (type === "des") {
      sortCriteria = { createdAt: -1 }; // Sort by creation time in descending order
    } else if (type === "custom") {
      sortCriteria = { rank: 1 }; // Sort by rank in ascending order
    }

    const teams = await Team.aggregate([
      {
        $match: {
          user: user._id,
          name: { $ne: "allTeamMember" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "team",
          as: "users",
        },
      },
      {
        $project: {
          name: 1,
          rank: 1,
          createdAt: 1, // Include the createdAt field
          users: {
            $subtract: [{ $size: "$users" }, 1]
          },
        },
      },
      { $sort: sortCriteria }, // Add the sorting stage
    ]);

    if (!teams || teams.length === 0) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }

    return teams;
  } catch (e) {
    throw e;
  }
};

methods.getTeamById = async (body, user) => {
  const lang = body.lang || "en";
  try {
    const team = await Team.findById(body.id).lean();
    console.log(team);
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

methods.deleteById = async (teamId, user) => {
  try {
    // Delete the team
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Delete the team from the user's team array
    await User.findByIdAndUpdate(
      user._id,
      { $pull: { team: team._id } }
    );

    // Remove the team from other team members
    await User.updateMany(
      { team: { $in: [team._id] }, userType: "team-member" },
      { $pull: { team: team._id } }
    );

    return team._id;
  } catch (e) {
    throw e;
  }
};

methods.reorderTeam = async (body, user) => {
  // it takes an array of team ids and the ranks of the teams from 0 onwards

  try {
    const lang = body.lang || "en";
    const teams = body.teams;

    // Check if the user has all the teams apart from the default team which name is 'allTeamMember'
    const userTeams = await Team.find({ user: user._id, name: { $ne: "allTeamMember" } }).lean();


  //  const userTeams = await Team.find({ user: user._id }).lean();

    const userTeamIds = userTeams.map(team => team._id.toString());
    const teamIds = teams.map(userTeams => userTeams.id);
    if (teamIds.length !== userTeamIds.length || !teamIds.every(id => userTeamIds.includes(id))) {
      throw new Error(errorStrings.TEAM_NOT_EXIST[lang]);
    }

    // Update the ranks of the teams
    for (let i = 0; i < teams.length; i++) {
      const team = teams[i];
      await Team.findByIdAndUpdate(team.id, { rank: team.rank });
    }
    return true;
  } catch (e) {
    throw e;
  }
}


module.exports = methods;
