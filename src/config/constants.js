const constants = {
  LIMIT: 10,
  CODE_EXPIRES_IN: 30,
  WEEKS_MAP: {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
    7: "Sunday",
  },
  SIX_HOURS_IN_MILLISECONDS: 2.16e7,
  ALLOWED_ROUTE_WITHOUT_SUBSCRIPTION: [
    {
      url: "/api/user/subscription",
      method: "POST",
    },
    {
      url: "/api/user/subscription",
      method: "GET",
    },
    {
      url: "/api/user/team",
      method: "POST",
    },
  ],
};

module.exports = constants;
