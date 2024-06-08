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

let textChatConn = [];

let videoChatUsersArray = [""];
let videoNoneUser = videoChatUsersArray.indexOf("");

if (noneUser == 0) {
  videoChatUsersArray.splice(videoNoneUser);
}

let videoChatConn = [];

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
  socket.on("videoChat", (condition) => {
    console.log(timestamp(), "Video Connected:", socket.id);

    videoChatUsersArray.push(socket.id);
    console.log(
      `Total users=${videoChatUsersArray.length + textChatUsersArray.length}`
    );
    io.emit("ttl", videoChatUsersArray.length + videoChatUsersArray.length);

    //========checking if any strangers for video are availbale or not===========
    const user = videoChatUsersArray.indexOf(socket.id);

    if (user % 2 !== 0 && videoChatUsersArray[user - 1]) {
      socket.to(videoChatUsersArray[user - 1]).emit("strangerConnection", true);
      socket.to(videoChatUsersArray[user]).emit("strangerConnection", true);
      videoChatConn.push({
        first: videoChatUsersArray[user],
        second: videoChatUsersArray[user - 1],
      });
    }

    socket.on("connectionReq", (condition) => {
      if (condition) {
        const user = videoChatUsersArray.indexOf(socket.id);
        socket
          .to(videoChatUsersArray[user + 1])
          .emit("strangerConnection", true);
      }
    });
    console.log("VIdeo Chat Connections", videoChatConn);
    console.log("VIdeo ", videoChatUsersArray);
    console.log(
      "Text Chat Users",
      textChatUsersArray.length,
      "  Video Chat Users",
      videoChatUsersArray.length
    );
  });

  socket.on("textChat", (condition) => {
    console.log(timestamp(), "Text Connected:", socket.id);
    textChatUsersArray.push(socket.id);
    console.log(
      `Total users=${textChatUsersArray.length + videoChatUsersArray.length}`
    );
    io.emit("ttl", textChatUsersArray.length + videoChatUsersArray.length);

    //========checking if any strangers are availbale or not===========
    const user = textChatUsersArray.indexOf(socket.id);

    if (user % 2 !== 0 && textChatUsersArray[user - 1]) {
      socket.to(textChatUsersArray[user - 1]).emit("strangerConnection", true);
      socket.to(textChatUsersArray[user]).emit("strangerConnection", true);
      textChatConn.push({
        first: textChatUsersArray[user],
        second: textChatUsersArray[user - 1],
      });
    }

    socket.on("connectionReq", (condition) => {
      if (condition) {
        const user = textChatUsersArray.indexOf(socket.id);
        socket
          .to(textChatUsersArray[user + 1])
          .emit("strangerConnection", true);
      }
    });
    console.log("Text Chat Connections", textChatConn);
    console.log("Text  ", textChatUsersArray);
    console.log(
      "Text Chat Users",
      textChatUsersArray.length,
      "  Video Chat Users",
      videoChatUsersArray.length
    );
  });

  // sending text
  socket.on("user-message", (message) => {
    //================new logic================
    const user = textChatUsersArray.indexOf(socket.id);
    console.log("Message by ", user, ":", message);
    if (user % 2 === 0) {
      socket.to(textChatUsersArray[user + 1]).emit("message", message);
    } else {
      socket.to(textChatUsersArray[user - 1]).emit("message", message);
    }
   
  });

  //================ new for video /// sending video========
  socket.on("stream", (stream) => {
    //================new logic================
    const user = videoChatUsersArray.indexOf(socket.id);
    // console.log(typeof stream);

    if (user % 2 === 0) {
      socket.to(videoChatUsersArray[user + 1]).emit("strangerStream", stream);
    } else {
      socket.to(videoChatUsersArray[user - 1]).emit("strangerStream", stream);
    }
  });
  socket.on("disconnecting", (condition) => {
    console.log("I am The Condition=========", condition);
  });

  // socket  on disconnect
  socket.on("disconnecting", (reason) => {
    //===========new logic===========
    console.log(
      "++++++++++++ ON Disconnect TEXT",
      textChatUsersArray.indexOf(socket.id)
    );
    console.log(
      "++++++++++++ ON Disconnect VIDEO",
      videoChatUsersArray.indexOf(socket.id)
    );
    // TEXT CHAT DISCONNECTION
    if (textChatUsersArray.indexOf(socket.id) !== -1) {
      
      console.log("TEXT Connections:", textChatConn);

      textChatConn.forEach((element) => {
        console.log("Im in foreach before disconnected");
        if (element.first === socket.id) {
          socket.to(element.second).emit("disconnectedUser", true);

          // removing item from Array
          console.log(timestamp(), "Disconnected:", socket.id);
          //removing connection
          textChatConn = textChatConn.filter((item) => {
            return item !== element;
          });
          textChatUsersArray = textChatUsersArray.filter((item) => {
            return item !== element.second;
          });
          textChatUsersArray = textChatUsersArray.filter((item) => {
            return item !== element.first;
          });
        }
        if (element.second === socket.id) {
          socket.to(element.first).emit("disconnectedUser", true);
          // removing item from Array
          console.log(timestamp(), "Disconnected:", socket.id);

          //removing connection
          textChatConn = textChatConn.filter((item) => {
            return item !== element;
          });

          textChatUsersArray = textChatUsersArray.filter((item) => {
            return item !== element.second;
          });
          textChatUsersArray = textChatUsersArray.filter((item) => {
            return item !== element.first;
          });
        }
      });

      if (textChatUsersArray.indexOf(socket.id) !== -1) {
        console.log(timestamp(), "Finally Disconnected:", socket.id);
        textChatUsersArray = textChatUsersArray.filter((item) => {
          return item !== socket.id;
        });
      }

      console.log("Text Client Available:", textChatUsersArray);
    }
     else {
            console.log("VIDEO Connections:", videoChatConn);

      videoChatConn.forEach((element) => {
        console.log("Im in foreach before disconnected");
        if (element.first === socket.id) {
          socket.to(element.second).emit("disconnectedUser", true);

          // removing item from Array
          console.log(timestamp(), "Disconnected:", socket.id);
          //removing connection
          videoChatConn = videoChatConn.filter((item) => {
            return item !== element;
          });
          videoChatUsersArray = videoChatUsersArray.filter((item) => {
            return item !== element.second;
          });
          videoChatUsersArray = videoChatUsersArray.filter((item) => {
            return item !== element.first;
          });
        }
        if (element.second === socket.id) {
          socket.to(element.first).emit("disconnectedUser", true);
          // removing item from Array
          console.log(timestamp(), "Disconnected:", socket.id);

          //removing connection
          videoChatConn = videoChatConn.filter((item) => {
            return item !== element;
          });

          videoChatUsersArray = videoChatUsersArray.filter((item) => {
            return item !== element.second;
          });
          videoChatUsersArray = videoChatUsersArray.filter((item) => {
            return item !== element.first;
          });
        }
      });

      if (videoChatUsersArray.indexOf(socket.id) !== -1) {
        console.log(timestamp(), "Finally Disconnected:", socket.id);
        videoChatUsersArray = videoChatUsersArray.filter((item) => {
          return item !== socket.id;
        });
      }

      console.log("Video Client Available:", videoChatUsersArray);
    }


    console.log(
      "Text Chat Users",
      textChatUsersArray.length,
      "  Video Chat Users",
      videoChatUsersArray.length
    );
    console.log(
      `Total users=${textChatUsersArray.length + videoChatUsersArray.length}`
    );
    io.emit("ttl", textChatUsersArray.length + videoChatUsersArray.length);
  });

  // for video-chat
  socket.on("stream",(stream)=>{
    // console.log("video data:",stream);
    socket.broadcast.emit("strangerStream",stream);

  // })
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
