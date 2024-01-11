const moment = require("moment");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const firebaseAdmin = require("../../utils/firebaseAdmin");
const AuthorizationToken = require("../AuthorizationToken");
const User = require("./index");
const errorStrings = require("../../config/errorStrings");
const { loadTemplateAndSend } = require("../../utils/templateEmailer");
const globalHelpers = require("../../utils/globalHelpers");
const sendGrid = require("../../utils/sendGrid");
const keys = require("../../config/keys");
const constants = require("../../config/constants");
const teamMethods = require("../Team/methods");
const predefinedMessagesMethods = require("../PredefinedMessages/methods");
const logger = require("../../utils/logger");

const methods = {};

methods.sendVerificationEmail = async function (body) {
  try {
    const lang = body.lang || "en";
    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw new Error(errorStrings.USER_NOT_FOUND[lang]);
    }

    const code = globalHelpers.generateRandomString(6, "numeric");

    const template = await loadTemplateAndSend("VerifyEmail", {
      fullName: user.fullName,
      link: `${keys.BASE_URL}/user/verify-email?id=${user._id}&code=${code}`,
    });

    const mailPayload = {
      to: user.email,
      html: template.htmlContent,
      text: template.txtContent,
      subject: template.subject,
      from: keys.ADMIN_EMAIL,
    };

    await sendGrid.sendMail(mailPayload);

    user.otp = {
      code: code,
      expiresAt: moment().add(constants.CODE_EXPIRES_IN, "minutes"),
      validated: false,
    };

    await user.save();

    return user;
  } catch (e) {
    throw e;
  }
};

methods.verifyOTP = async function (body) {
  try {
    const findQuery = {
      _id: body.user,
    };

    if (!body.user) {
      findQuery.email = body.email;
      delete findQuery._id;
    }

    const user = await User.findOne(findQuery).select("+otp").lean();

    if (!user || !user.otp) {
      return false;
    }

    const expiryMoment = moment(user.otp.expiresAt);
    const isExpired = moment().isAfter(expiryMoment);

    if (isExpired) {
      return false;
    }

    const isValid = user.otp.code === body.otp;

    if (!isValid) {
      return false;
    }

    return true;
  } catch (e) {
    throw e;
  }
};

methods.sendPasswordRecoveryEmail = async function (body) {
  try {
    const lang = body.lang || "en";
    const user = await User.findOne({ email: body.email });

    if (!user) {
      throw new Error(errorStrings.USER_NOT_FOUND[lang]);
    }

    const code = globalHelpers.generateRandomString(6, "numeric");

    const template = await loadTemplateAndSend("PasswordRecovery", {
      fullName: user.fullName,
      code,
    });

    const mailPayload = {
      to: user.email,
      html: template.htmlContent,
      text: template.txtContent,
      subject: template.subject,
      from: keys.ADMIN_EMAIL,
    };

    await sendGrid.sendMail(mailPayload);

    user.otp = {
      code: code,
      expiresAt: moment().add(constants.CODE_EXPIRES_IN, "minutes"),
      validated: false,
    };

    await user.save();

    return user;
  } catch (e) {
    throw e;
  }
};

methods.resetPassword = async function (body) {
  try {
    const lang = body.lang || "en";
    const user = await User.findOne({ email: body.email }).select("+otp");

    if (!user) {
      throw new Error(errorStrings.USER_NOT_FOUND[lang]);
    }

    if (!user.otp || !user.otp.validated) {
      throw new Error(errorStrings.OTP_VERIFICATION_REQUIRED[lang]);
    }

    const generatedSalt = await bcrypt.genSalt(keys.SALT);
    user.password = await bcrypt.hash(body.newPassword, generatedSalt);
    user.otp = null;

    await user.save();

    return user;
  } catch (e) {
    throw e;
  }
};

methods.getUserPublicProfile = function (user) {
  if (user.toJSON) {
    user = user.toJSON();
  }

  if (user.userType === "team-member") {
    delete user.subscription;
  }

  if (user?.subscription?.subscription?.perks) {
    user.subscription.subscription.perks =
      user.subscription.subscription.perks["en"];
  }

  delete user.password;
  delete user.lastCall;

  return user;
};

methods.callUser = async (body, user) => {
  try {
    const lang = body.lang || "en";
    if (!body.user) {
      throw new Error(errorStrings.USER_ID_REQUIRED[lang]);
    }

    if (body.user.toString() === user._id.toString()) {
      throw new Error(errorStrings.CANNOT_SELF_CALL[lang]);
    }

    const foundUser = await User.findOne({ _id: body.user, team: user.team });

    if (!foundUser) {
      throw new Error(errorStrings.TEAM_MEMBER_NOT_EXIST[lang]);
    }

    if (foundUser.fcmToken) {
      const fromUser = {
        fullName: user.fullName,
        _id: user._id,
        userType: user.userType,
      };

      const notificationPayload = {
        title: `${user.fullName} is calling you`,
        body: ` `,
        data: {
          fromUser: JSON.stringify(fromUser),
          status: "pending",
          time: Date.now().toString(),
        },
        token: foundUser.fcmToken,
      };

      // if (body.lang !== "en") {
      notificationPayload.title = `Ping von ${user.fullName}`;
      notificationPayload.body = ` `;
      // }

      firebaseAdmin.sendNotification(notificationPayload);
    }

    await User.findByIdAndUpdate(
      { _id: user._id },
      {
        lastCall: {
          to: foundUser._id,
          status: "pending",
          time: Date.now(),
        },
      }
    );

    return null;
  } catch (e) {
    throw e;
  }
};

methods.callStatusChange = async (body, user) => {
  try {
    const lang = body.lang || "en";
    const ALLOWED_STATUS = ["accepted", "rejected"];
    if (!body.user) {
      throw new Error(errorStrings.USER_ID_REQUIRED[lang]);
    }
    if (!body.status) {
      throw new Error(errorStrings.STATUS_REQUIRED[lang]);
    }

    if (!ALLOWED_STATUS.includes(body.status)) {
      throw new Error(errorStrings.UNSUPPORTED_STATUS[lang]);
    }

    const latestUser = await User.findOne({ _id: body.user }).select(
      "+lastCall"
    );

    if (
      !latestUser.lastCall ||
      latestUser.lastCall.to.toString() !== user._id.toString()
    ) {
      throw new Error(errorStrings.DID_NOT_CALLED_BY_USER[lang]);
    }

    if (latestUser.lastCall.status !== "pending") {
      throw new Error(errorStrings.CALL_ALREADY_ANSWERED[lang]);
    }

    latestUser.lastCall.status = body.status;
    await latestUser.save();

    if (latestUser.fcmToken) {
      logger.printLabel("Sending push notification");
      const fromUser = {
        fullName: user.fullName,
        _id: user._id,
        userType: user.userType,
      };

      const notificationPayload = {
        title: `${user.fullName} is calling you`,
        body: ` `,
        data: {
          fromUser: JSON.stringify(fromUser),
          status: body.status,
          time: Date.now().toString(),
        },
        token: latestUser.fcmToken,
        removeCallCategory: true,
      };

      if (body.status === "accepted") {
        // if (lang === "en") {
        //   notificationPayload.title = `${user.fullName} accepted your call`;
        //   notificationPayload.body = `${user.fullName} accepted your call`;
        // } else {
        // }
        notificationPayload.title = `${user.fullName} nahm Ihren Anruf an`;
        notificationPayload.body = ` `;
      }

      if (body.status === "rejected") {
        // if (lang === "en") {
        //   notificationPayload.title = `${user.fullName} rejected your call`;
        //   notificationPayload.body = `${user.fullName} rejected your call`;
        // } else {
        // }
        notificationPayload.title = `${user.fullName} hat Ihren Anruf abgelehnt`;
        notificationPayload.body = ` `;
      }
      logger.print(notificationPayload);

      await firebaseAdmin.sendNotification(notificationPayload);
    }

    return latestUser;
  } catch (e) {
    throw e;
  }
};

methods.toggleOnline = async (body, user) => {
  try {
    const query = {
      _id: user._id,
    };
    const payload = {
      isOnline: body.isOnline,
    };

    const userData = await User.findOneAndUpdate(query, payload);

    return userData;
  } catch (e) {
    throw e;
  }
};

methods.login = async (body) => {
  const lang = body.lang || "en";
  try {
    if (!body.email) {
      throw new Error(errorStrings.EMAIL_REQUIRED[lang]);
    }

    if (!body.password) {
      throw new Error(errorStrings.PASSWORD_REQUIRED[lang]);
    }
    const userQuery = {
      email: body.email,
    };
    const user = await User.findOne(userQuery)
      .populate("team")
      .select("+password")
      .populate("subscription.subscription")
      .lean();

    if (!user) {
      throw new Error(errorStrings.USER_NOT_FOUND[lang]);
    }

    if (!user.provider.includes("password")) {
      throw new Error(errorStrings.EMAIL_PASSWORD_NOT_CORRECT[lang]);
    }

    const isCompare = await bcrypt.compare(body.password, user.password);

    if (!isCompare) {
      throw new Error(errorStrings.EMAIL_PASSWORD_NOT_CORRECT[lang]);
    }

    // if (!user.emailVerified) {
    //   await methods.sendVerificationEmail({ email: user.email, lang });
    //   throw new Error(errorStrings.EMAIL_NOT_VERIFIED[lang]);
    // }

    const token = jwt.sign({ _id: user._id, type: "user" }, keys.JWT_SECRET);
    const tokenPayload = {
      user: user._id,
      token,
      type: "user",
    };

    const saveToken = new AuthorizationToken(tokenPayload);

    await saveToken.save();

    if (user.team) {
      const onlineUsers = await teamMethods.getOnlineUsers({
        team: user.team,
        lang,
      });
      user.team.onlineUsers = onlineUsers;
    }

    return { user, token };
  } catch (e) {
    throw e;
  }
};

methods.register = async (body) => {
  try {
    const lang = body.lang || "en";
    if (!body.fullName) {
      return errorStrings.FULL_NAME_REQUIRED[lang];
    }

    if (!body.email) {
      return errorStrings.EMAIL_REQUIRED[lang];
    }

    if (!body.password) {
      return errorStrings.PASSWORD_REQUIRED[lang];
    }
    if (!body.initials) {
      return errorStrings.INITIALS_REQUIRED[lang];
    }

    if (!globalHelpers.validatePassword(body.password)) {
      return errorStrings.PASSWORD_SIX_DIGIT[lang];
    }

    const emailExist = await User.findOne({ email: body.email }).lean();
    if (emailExist) {
      throw new Error(errorStrings.EMAIL_EXIST[lang]);
    }
    const payload = {
      email: body.email,
      initials: body.initials,
      password: body.password,
      userType: "doctor",
      fullName: body.fullName,
      userName: body.userName,
      provider: ["password"],
    
    };

    const generatedSalt = await bcrypt.genSalt(keys.SALT);
    payload.password = await bcrypt.hash(payload.password, generatedSalt);

    const user = new User(payload);

    await user.save();
   // await methods.sendVerificationEmail({ email: user.email });
    const token = jwt.sign({ _id: user._id, type: "user" }, keys.JWT_SECRET, {
      expiresIn: "1h",
    });

    const tokenPayload = {
      user: user._id,
      token,
      type: "user",
    };

    const saveToken = new AuthorizationToken(tokenPayload);

    await saveToken.save();

    return { user, token };
  } catch (e) {
    throw e;
  }
};

methods.loginTeamMember = async (body) => {
  try {
    const lang = body.lang || "en";
    if (!body.enrollmentCode) {
      throw new Error(errorStrings.ENROLLMENT_CODE_REQUIRED[lang]);
    }

    const query = {
      "enrollmentCode.code": body.enrollmentCode,
      $or: [
        {
          "enrollmentCode.expiry": { $gte: new Date() },
        },
        {
          "enrollmentCode.expiry": null,
        },
      
      ],
        //check if the user is blocked or not
        "isBlocked": false,
    };

    const user = await User.findOne(query).populate("team").lean();

    if (!user) {
      throw new Error(errorStrings.USER_NOT_FOUND[lang]);
    }

    const token = jwt.sign(
      { _id: user._id, type: "team-member" },
      keys.JWT_SECRET
    );
    const tokenPayload = {
      user: user._id,
      token,
      type: "team-member",
    };

    const saveToken = new AuthorizationToken(tokenPayload);
    await saveToken.save();

    if (user.team) {
      const onlineUsers = await teamMethods.getOnlineUsers({
        team: user.team,
        lang,
      });
      user.team.onlineUsers = onlineUsers;
    }

    return { user, token };
  } catch (e) {
    throw e;
  }
};

methods.deleteUser = async (body) => {
  const user = await User.findOneAndDelete({
    _id: body.user,
  });

  await User.deleteMany({
    team: user.team,
  });

  await teamMethods.deleteById({ team: user.team });
  await predefinedMessagesMethods.deleteByTeamId({ team: user.team });

  return null;
};

module.exports = methods;
