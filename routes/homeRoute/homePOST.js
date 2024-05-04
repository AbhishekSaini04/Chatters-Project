const express = require("express");
const Swal = require('sweetalert2')
const router = express.Router();
// const collection = require("../../config");
router.route("/").post( async (req, res) => {
  res.statusCode(200);
  console.log("home post");

});

module.exports = router;
