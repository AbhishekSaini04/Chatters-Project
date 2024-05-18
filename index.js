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

//======== middlewares==========
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(express.static("public"));


// Declareration
let textChatUsersArray=[""];
let noneUser=textChatUsersArray.indexOf("");
// console.log(noneUser);
if(noneUser==0){ 
  textChatUsersArray.splice(noneUser)
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
  // console.log(socket.conn);

  console.log( timestamp(),"Connected:", socket.id);
 
  textChatUsersArray.push(socket.id);
  console.log(`Total users=${textChatUsersArray.length}`);
  io.emit("ttl", textChatUsersArray.length);

  socket.on("user-message", (message) => {
    
if(socket.id===textChatUsersArray[0]){
  
    console.log("User Message:", message);
    // sends data to clients
   
    socket.to(textChatUsersArray[1]).emit("message", message);
  }
  
if(socket.id===textChatUsersArray[1]){
  
    console.log("User Message:", message);
    // sends data to clients
   
    socket.to(textChatUsersArray[0]).emit("message", message);
  }
if(socket.id===textChatUsersArray[2]){
  
    console.log("User Message:", message);
    // sends data to clients
   
    socket.to(textChatUsersArray[3]).emit("message", message);
  }
  
if(socket.id===textChatUsersArray[3]){
  
    console.log("User Message:", message);
    // sends data to clients
   
    socket.to(textChatUsersArray[2]).emit("message", message);
  }
if(socket.id===textChatUsersArray[4]){
  
    console.log("User Message:", message);
    // sends data to clients
   
    socket.to(textChatUsersArray[5]).emit("message", message);
  }
  
if(socket.id===textChatUsersArray[5]){
  
    console.log("User Message:", message);
    // sends data to clients
   
    socket.to(textChatUsersArray[4]).emit("message", message);
  }
  });
  //Message emit


// socket  on disconnect 
socket.on("disconnecting", (reason) => {

  if(socket.id===textChatUsersArray[0]){
  
    // sends data to clients
   console.log("Disconnected");
    socket.to(textChatUsersArray[1]).emit("disconnectedUser", true);
  }
  if(socket.id===textChatUsersArray[1]){
  
    // sends data to clients
   console.log("Disconnected");
    socket.to(textChatUsersArray[0]).emit("disconnectedUser", true);
  }
  if(socket.id===textChatUsersArray[2]){
  
    // sends data to clients
   console.log("Disconnected");
    socket.to(textChatUsersArray[3]).emit("disconnectedUser", true);
  }
  if(socket.id===textChatUsersArray[3]){
  
    // sends data to clients
   console.log("Disconnected");
    socket.to(textChatUsersArray[2]).emit("disconnectedUser", true);
  }
  if(socket.id===textChatUsersArray[4]){
  
    // sends data to clients
   console.log("Disconnected");
    socket.to(textChatUsersArray[5]).emit("disconnectedUser", true);
  }
  if(socket.id===textChatUsersArray[5]){
  
    // sends data to clients
   console.log("Disconnected");
    socket.to(textChatUsersArray[4]).emit("disconnectedUser", true);
  }


  console.log(textChatUsersArray);
  // console.log(reason);
  console.log( timestamp(),"Disconnected:",socket.id);
  textChatUsersArray=textChatUsersArray.filter((item)=>{
    return item!==socket.id;
  });
 
  console.log(textChatUsersArray);

  console.log(`Total users=${textChatUsersArray.length}`);
  io.emit("ttl",textChatUsersArray.length);
    
    
    
  });
  
  
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
app.use("/signup", require("./routes/signupRoute/signupGET"));
app.use("/signup", require("./routes/signupRoute/signupPOST"));

// login route
app.use("/login", require("./routes/loginRoute/loginGET"));
app.use("/login", require("./routes/loginRoute/loginPOST"));

// this is for for all unsolved Routes
app.use("*", require("./routes/routeNotFound/routeNotFoundGET"));

// listening to port
server.listen(PORT, () => {
  console.log(`The Server is running on Port: ${PORT} `);
});
