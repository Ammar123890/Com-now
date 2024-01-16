const Subscription = require("../models/Subscription");
const subscriptionData = require("../config/subscription");
const generator = {};

generator.addSubscription = async () => {
  try {
    await Promise.all(
      subscriptionData.map((item) => {
        return Subscription.updateOne(
          {
            code: item.code,
          },
          {
            $set: item,
          },
          {
            upsert: true,
          }
        );
      })
    );

    console.log("Subscription added");
  } catch (e) {
    console.log("e =>", e);
  }
};

module.exports = generator;
