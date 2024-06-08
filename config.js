const mongoose = require("mongoose");
require("dotenv").config();
  const  mongoURL=process.env.mongoDBOnline;
//const mongoURL = process.env.mongoDBOffline;
const connect = mongoose.connect(mongoURL);

const db = mongoose.connection;

db.on("connected", () => {
  console.log("DB Connected");
});

db.on("error", (e) => {
  console.log(`Error ${e} ocured!`);
});
db.on("disconnected", () => {
  console.log("BD Disconnected");
});

// created schema
const loginSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// model created
const collection = new mongoose.model("users", loginSchema);

// module export
module.exports = collection;
