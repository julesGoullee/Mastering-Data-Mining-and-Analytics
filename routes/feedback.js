"use strict";

var express = require("express");
var router = express.Router();

router.get("/feedback", function (req, res, next) {
    res.render("feedback", { title: "feedback Bomberman"});
});

module.exports = router;
