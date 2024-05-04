const express = require("express");
const router = express.Router();
const collection = require("../../config");
router.route("/").post(async (req, res) => {
  // res.send("signup::Post")

  const response = {
    name: req.body.nameS,
    email: req.body.emailS,
    password: req.body.passwordS,
  };

  console.log("Signup");
  console.log(response);

  // const userExsist=collection.findOne({email:"astro"});
  const userExsist = await collection.findOne({ email: response.email });

  console.log("user found" + userExsist);
  res.status(200);
  if (userExsist) {
    console.log("user exsists");
    res.redirect("/login");
  } else {
    const userData = await collection.insertMany(response);
    console.log(userData);
    res.redirect("/login");
  }
});

module.exports = router;
