// REQUIRING || IMPORTING SECTION
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
require("dotenv").config();

// express APP
const app = express();

// Chatters Port
const PORT = process.env.PORT || 5001;

// created HTTP sever
const server = http.createServer(app);

//======== middlewares==========
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// Declareration
let textChatUsersArray = [""];
let noneUser = textChatUsersArray.indexOf("");
// console.log(noneUser);
if (noneUser == 0) {
  textChatUsersArray.splice(noneUser);
}
let videoChatUsersArray;

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
// Creating  socket io sever
const io = new Server(server);

// socket io on connection
io.on("connection", (socket) => {
  //state of app
  console.log(timestamp(), "Connected:", socket.id);

  textChatUsersArray.push(socket.id);
  console.log(`Total users=${textChatUsersArray.length}`);
  io.emit("ttl", textChatUsersArray.length);

  //========checking if any strangers are availbale or not===========
  const user = textChatUsersArray.indexOf(socket.id);

  if (user % 2 !== 0 && textChatUsersArray[user - 1]) {
    socket.to(textChatUsersArray[user - 1]).emit("strangerConnection", true);
    socket.to(textChatUsersArray[user]).emit("strangerConnection", true);
  }

  socket.on("connectionReq", (condition) => {
    if (condition) {
      const user = textChatUsersArray.indexOf(socket.id);
      socket.to(textChatUsersArray[user + 1]).emit("strangerConnection", true);
    }
  });

  socket.on("user-message", (message) => {
    //================new logic================
    const user = textChatUsersArray.indexOf(socket.id);
    console.log("Message by ", user, ":", message);
    if (user % 2 === 0) {
      socket.to(textChatUsersArray[user + 1]).emit("message", message);
    } else {
      socket.to(textChatUsersArray[user - 1]).emit("message", message);
    }
    //================old logic================
    // if(socket.id===textChatUsersArray[0]){

    //     console.log("User Message:", message);
    //     // sends data to clients

    //     socket.to(textChatUsersArray[1]).emit("message", message);
    //   }
  });
  //Message emit

  // socket  on disconnect
  socket.on("disconnecting", (reason) => {
    //===========new logic===========
    const user = textChatUsersArray.indexOf(socket.id);
    console.log(user, " Disconnected");
    if (user % 2 === 0) {
      socket.to(textChatUsersArray[user + 1]).emit("disconnectedUser", true);
    } else {
      socket.to(textChatUsersArray[user - 1]).emit("disconnectedUser", true);
    }
    //============old logic==========
    // if(socket.id===textChatUsersArray[0]){

    //   // sends data to clients
    //  console.log("Disconnected");
    //   socket.to(textChatUsersArray[1]).emit("disconnectedUser", true);
    // }

    console.log(textChatUsersArray);
    // console.log(reason);
    console.log(timestamp(), "Disconnected:", socket.id);
    textChatUsersArray = textChatUsersArray.filter((item) => {
      return item !== socket.id;
    });

    console.log(textChatUsersArray);

    console.log(`Total users=${textChatUsersArray.length}`);
    io.emit("ttl", textChatUsersArray.length);
  });


  // for video-chat
  socket.on("stream",(stream)=>{
     console.log("video data:",stream);
    socket.broadcast.emit("strangerStream",stream);

  })
});

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
// app.use("/signup", require("./routes/signupRoute/signupGET"));
// app.use("/signup", require("./routes/signupRoute/signupPOST"));

// // login route
// app.use("/login", require("./routes/loginRoute/loginGET"));
// app.use("/login", require("./routes/loginRoute/loginPOST"));

// this is for for all unsolved Routes
app.use("*", require("./routes/routeNotFound/routeNotFoundGET"));

// listening to port
server.listen(PORT, () => {
  console.log(`The Server is running on Port: ${PORT} `);
});
