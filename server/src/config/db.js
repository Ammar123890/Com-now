const mongoose = require("mongoose");

const keys = require("../config/keys");

mongoose
  .connect(keys.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Error connecting database =>", err));

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
