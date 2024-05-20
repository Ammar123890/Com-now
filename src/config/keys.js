const keys = {
  PORT: process.env.PORT,
  SALT: Number(process.env.SALT),
  JWT_SECRET: process.env.JWT_SECRET,
 //MONGO_URI: "mongodb://localhost:27017/comnow2",
 MONGO_URI: "mongodb+srv://comnow:comnow@cluster0.phnqfxj.mongodb.net/",
 // MONGO_URI: "mongodb+srv://blockchain:blockchain@cluster0.fcgihto.mongodb.net/",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY_CREATEEX,    
  BASE_URL: "https://com-now-10196bc087d0.herokuapp.com",
  //BASE_URL: "http://localhost:5001",
};

if (process.env.NODE_ENV === "production") {
  keys.MONGO_URI = process.env.MONGO_URI;
  keys.BASE_URL = process.env.BASE_URL;
}

module.exports = keys;