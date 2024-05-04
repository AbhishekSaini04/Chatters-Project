const express = require("express");
const router = express.Router();
const Swal = require('sweetalert2')
const collection = require("../../config");
router.route("/").post( async (req, res) => {
  // res.send("signup::Post")
  console.log("login post");

  const response = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(response);

  const userExsist = await collection.findOne({ email: response.email });
  if (userExsist) {
  
    console.log("user exists");

    res.status(200);
    if (userExsist.password === response.password) {
      console.log("logged in");
      res.redirect("/");
    } else {

      console.log("INVALID PASSWORD");
    }
  } else {
    console.log("You haven't signed up");
  }
});

module.exports = router;
