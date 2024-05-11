// REQUIRING || IMPORTING SECTION
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
require('dotenv').config()

// express APP
const app = express();

// Chatters Port
const PORT =process.env.PORT || 5001;

// created HTTP sever
const server = http.createServer(app);

//======== uses==========
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Creating  socket io sever
const io = new Server(server);
// socket io
io.on("connection", (socket) => {
  console.log("User connected with id:", socket.id);
  socket.on("user-message", (message) => {
    console.log("User Message:", message);
    // sends data to clients
    // io.emit("message", message);
    socket.broadcast.emit("message", message);
  });
});

// for state of app
var sockets = {};
var users = {};
var strangerQueue = false;
var peopleActive = 0;
var peopleTotal = 0;

// helper functions for logs
function fillZero(val) {
  if (val > 9) return "" + val;
  return "0" + val;
}
function timestamp() {
  var now = new Date();
  return (
    "[" +
    fillZero(now.getHours()) +
    ":" +
    fillZero(now.getMinutes()) +
    ":" +
    fillZero(now.getSeconds()) +
    "]"
  );
}
console.log("Current Time:", timestamp());

// ------------all routes-------------

// home route
app.use("/", require("./routes/homeRoute/homeGET"));
app.use("/", require("./routes/homeRoute/homePOST"));

// text-chat route
app.use("/text-chat", require("./routes/textChatRoute/textChatGET"));
app.use("/text-chat", require("./routes/textChatRoute/textChatPOST"));

// video-chat route
app.use("/video-chat", require("./routes/videoChatRoute/videoChatGET"));
app.use("/video-chat", require("./routes/videoChatRoute/videoChatPOST"));

// signup route
app.use("/signup", require("./routes/signupRoute/signupGET"));
app.use("/signup", require("./routes/signupRoute/signupPOST"));

// login route
app.use("/login", require("./routes/loginRoute/loginGET"));
app.use("/login", require("./routes/loginRoute/loginPOST"));

// this is for for all unsolved Routes
app.use("*", require("./routes/routeNotFound/routeNotFoundGET"));

// listening to port
server.listen(PORT, () => {
  console.log(`The Server is running on ${PORT} Port`);
});