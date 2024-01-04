const bcrypt = require("bcryptjs");
const path = require("path");

const globalHelpers = require("../../../utils/globalHelpers");
const User = require("../../../models/User");
const Subscription = require("../../../models/Subscription");
const userMethods = require("../../../models/User/methods");
const AuthorizationToken = require("../../../models/AuthorizationToken");
const helpers = require("./helpers");
const keys = require("../../../config/keys");
const errorStrings = require("../../../config/errorStrings");
const Notification = require("../../../models/Notification");
const UserOrder = require("../../../models/UserOrder");
const createDefaultTeam = require("../../../controllers/user/team");

const controller = {};

controller.register = async function (req, res, next) {
  try {
    const registerResponse = await userMethods.register(req.body);
    //create a team of the user
    const team = await createDefaultTeam.createDefaultTeam(registerResponse.user);

    res.json({
      data: {
        user: userMethods.getUserPublicProfile(registerResponse.user),
        token: registerResponse.token,
      },
      success: true,
      message: "Registeration is successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.login = async function (req, res, next) {
  try {
    const error = helpers.loginValidation(req.body);

    if (error) {
      throw new Error(error);
    }

    let loginResponse;

    if (req.body.userType === "doctor") {
      loginResponse = await userMethods.login(req.body);
    }
    if (req.body.userType === "team-member") {
      loginResponse = await userMethods.loginTeamMember(req.body);
    }

    res.json({
      data: {
        user: userMethods.getUserPublicProfile(loginResponse.user),
        token: loginResponse.token,
      },
      success: true,
      message: "User login Success",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.verifyEmail = async function (req, res, next) {
  try {
    const { code, id } = req.query;
    console.log(code, id)

    const isValid = await userMethods.verifyOTP({ user: id, otp: code });

    if (!isValid) {
      const url = path.resolve(
        path.join(
          __dirname,
          "../",
          "../",
          "../",
          "htmlTemplates",
          "VerificationError",
          "index.html"
        )
      );

      res.status(400).sendFile(url);
      return;
    }

    await User.findOneAndUpdate(
      { _id: id },
      { otp: null, emailVerified: true }
    ).lean();

    const url = path.resolve(
      path.join(
        __dirname,
        "../",
        "../",
        "../",
        "htmlTemplates",
        "VerificationSuccess",
        "index.html"
      )
    );

    res.status(400).sendFile(url);
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.changePassword = async function (req, res, next) {
  try {
    const lang = req.body.lang || "en";
    const error = helpers.changePasswordValidation(req.body);

    if (error) {
      throw new Error(error);
    }

    const user = await User.findOne({ _id: req.user._id }).select("+password");

    const isCompare = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (!isCompare) {
      throw new Error(errorStrings.CURRENT_PASSWORD_NOT_CORRECT[lang]);
    }

    const generatedSalt = await bcrypt.genSalt(keys.SALT);
    user.password = await bcrypt.hash(req.body.newPassword, generatedSalt);

    await user.save();

    res.json({
      data: {},
      success: true,
      message: "User successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.editProfile = async function (req, res, next) {
  try {
    const payload = globalHelpers.removedUndefinedValues({
      fullName: req.body.fullName,
    });

    const user = await User.findOneAndUpdate({ _id: req.user._id }, payload, {
      new: true,
    });

    res.json({
      data: { user },
      success: true,
      message: "User successful",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.passwordRecoveryEmail = async function (req, res, next) {
  try {
    const { email, lang = "en" } = req.body;

    if (!email) {
      throw new Error(errorStrings.EMAIL_REQUIRED[lang]);
    }

    await userMethods.sendPasswordRecoveryEmail({ email, lang });

    res.json({
      data: {},
      success: true,
      message: "Check your email for password recovery code",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.verifyPasswordRecoveryCode = async function (req, res, next) {
  try {
    const { code, email, lang = "en" } = req.body;

    if (!code) {
      throw new Error(errorStrings.CODE_REQUIRED[lang]);
    }

    if (!email) {
      throw new Error(errorStrings.EMAIL_REQUIRED[lang]);
    }

    const isValid = await userMethods.verifyOTP({ email: email, otp: code });

    if (!isValid) {
      throw new Error(errorStrings.CODE_NOT_CORRECT_OR_EXPIRED[lang]);
    }

    await User.findOneAndUpdate(
      { email: email },
      { "otp.validated": true }
    ).lean();

    res.json({
      data: {},
      success: true,
      message: "success",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.resetPassword = async function (req, res, next) {
  try {
    const { newPassword, email, lang = "en" } = req.body;

    if (!email) {
      throw new Error(errorStrings.EMAIL_REQUIRED[lang]);
    }

    if (!newPassword) {
      throw new Error(errorStrings.NEW_PASSWORD_REQUIRED[lang]);
    }

    await userMethods.resetPassword({ email: email, newPassword, lang });

    res.json({
      data: {},
      success: true,
      message: "success",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.logout = async function (req, res, next) {
  try {
    const lang = req.body.lang || "en";
    const token = req.headers.authorization.split(" ")[1];
    const tokenDoc = await AuthorizationToken.findOne({ token })
      .lean()
      .select("_id");

    if (!tokenDoc) {
      throw new Error(errorStrings.AUTHORIZATION_DENIED[lang]);
    }

    await AuthorizationToken.findByIdAndRemove(tokenDoc._id)
      .lean()
      .select("_id");

    await User.findByIdAndUpdate(req.user._id, { fcmToken: null });
    res.json({
      data: {},
      success: true,
      message: "Logout Successfully",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.changeSubscription = async function (req, res, next) {
  try {
    const { lang = "en" } = req.query;

    if (req.body.isSubscribed && !req.body.code) {
      throw new Error(errorStrings.SUBSCRIPTION_CODE_REQUIRED[lang]);
    }

    const subscription = await Subscription.findOne({
      code: req.body.code,
    });

    if (!subscription) {
      throw new Error(errorStrings.SUBSCRIPTION_NOT_FOUND[lang]);
    }

    const query = {
      _id: req.user._id,
    };
    const body = {
      subscription: {
        subscription: subscription._id,
        isSubscribed: req.body.isSubscribed,
        expiry: req.body.expiry,
      },
    };

    if (req.body.isSubscribed) {
      body.subscription.subscriptionTime = new Date();
    }

    if (!req.body.isSubscribed) {
      body.subscription.subscription = null;
      body.subscription.subscriptionTime = null;
    }

    await User.findOneAndUpdate(query, body);

    res.json({
      data: {},
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.getAllSubscription = async function (req, res, next) {
  try {
    const { lang = "en" } = req.query;
    let subscriptions = await Subscription.find({});

    subscriptions = subscriptions.map((item) => {
      item.perks = item.perks[lang];
      return item;
    });

    res.json({
      data: { subscriptions },
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.saveFCMToken = async function (req, res, next) {
  try {
    const lang = req.body.lang || "en";
    if (!req.body.fcmToken) {
      throw new Error(errorStrings.FCM_TOKEN_REQUIRED[lang]);
    }

    const query = {
      _id: req.user._id,
    };
    const body = {
      fcmToken: req.body.fcmToken,
    };
    await User.findOneAndUpdate(query, body);

    res.json({
      data: {},
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.setUserOrder = async function (req, res, next) {
  try {
    const { lang = "en" } = req.body;
    const error = helpers.setUserOrderValidation(req.body);

    if (error) {
      throw new Error(error);
    }

    await Promise.all(
      req.body.orders.map(async (item) => {
        const user = await User.findOne({
          _id: item.user,
          team: req.user.team,
        });

        if (!user) {
          throw new Error(errorStrings.ONE_MORE_USER_NOT_EXIST[lang]);
        }

        return user;
      })
    );

    await UserOrder.updateOne(
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
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

controller.deleteUser = async function (req, res, next) {
  try {
    const { lang = "en" } = req.query;

    if (req.user.userType !== "doctor") {
      throw new Error(errorStrings.ONLY_TEAM_MEMBER_CAN_ACCESS[lang]);
    }

    await userMethods.deleteUser({ user: req.user._id });

    res.json({
      data: {},
      success: true,
      message: "Successfull",
    });
  } catch (e) {
    next({ message: e, status: 400 });
  }
};

module.exports = controller;
