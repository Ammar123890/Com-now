const admin = require("firebase-admin");

const serviceAccount = require("../../firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseAdmin = {};

firebaseAdmin.sendNotification = async function (payload) {
  try {
    const message = {
      android: {
        notification: {
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            category: "call",
          },
        },
      },
      notification: {
        title: payload.title,
        body: payload.body,
      },
      token: payload.token,
      data: payload.data || {},
    };

    if (payload.removeCallCategory) {
      delete message.apns.payload.aps.category;
    }
    
    const response = await admin.messaging().send(message);
    console.log("Notification success ==>", response);
    return { success: true, response };
  } catch (e) {
    console.log("Notification error ==>", e);
    return { success: false, error: e };
  }
};

firebaseAdmin.sendMulticastNotification = async function (payload) {
  try {

    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
      tokens: payload.tokens, // Array of FCM tokens
    };


    // Send a message to the devices corresponding to the provided tokens
    const response = await admin.messaging().sendMulticast(message);
    console.log("Successfully sent multicast message:", response);
    return { success: true, response };
  } catch (e) {
    console.error("Failed to send multicast message:", e);
    return { success: false, error: e.message };
  }
};


module.exports = firebaseAdmin;
