const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { createServer } = require("http");

const app = express();

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
if (fs.existsSync("./uploads") && !fs.existsSync("./uploads/audio")) {
  fs.mkdirSync("./uploads/audio");
}

// Load environmental variables
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Load database
require("./src/config/db");

// Load keys
const keys = require("./src/config/keys");

// Socket config
const httpServer = createServer(app);
require("./src/utils/socketio")(httpServer, app);

const globalHelpers = require("./src/utils/globalHelpers");

// Middlewares
app.use(express.json());
app.use(express.static("doc"));
app.use(cors());

require("./src/routes")(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const ensureUploadDirExist = () => {
//   const uploadDirPath = path.resolve(path.join(__dirname, "uploads"));
//   const uploadDirExist = fs.existsSync(uploadDirPath);

//   if (!uploadDirExist) {
//     fs.mkdirSync(uploadDirPath);
//   }
// };

// const ensureAudioDirExist = () => {
//   const audioDirPath = path.resolve(path.join(__dirname, "uploads", "audio"));
//   const audioDirExist = fs.existsSync(audioDirPath);

//   if (!audioDirExist) {
//     fs.mkdirSync(audioDirPath);
//   }
// };

// ensureUploadDirExist();
// ensureAudioDirExist();

// Global error handler

app.use((err, _, res, _a) => {
  const error = globalHelpers.handleMongooseError(err.message);

  if (
    process.env.NODE_ENV === "production" &&
    typeof error.message === "string" &&
    error.message.startsWith("request to http")
  ) {
    return res
      .status(500)
      .json({ message: "Internal server error", success: false });
  }

  console.error("error=>", { ...error });

  res.status(err.status || 400).json({ ...error, success: false });
});

// require("./src/utils/dataGenerator").addSubscription();

httpServer.listen(keys.PORT, () => {
  console.log("Server running on PORT: ", keys.PORT);
});
