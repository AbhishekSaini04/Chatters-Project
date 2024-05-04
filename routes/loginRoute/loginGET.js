const express=require("express");
const router=express.Router();
router.route("/").get( (req, res) => {
    res.render("../views/login");
    res.status(200);
  });


module.exports=router;
