const express=require("express");
const router=express.Router();
router.route("/").get( (req, res) => {
    res.render("../views/textChat");
  });

module.exports=router;


