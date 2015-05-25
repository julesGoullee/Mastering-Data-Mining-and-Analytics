"use strict";

var express = require("express");
var router = express.Router();
var passport = require("passport");

var dependances = {

    scripts:[
        "../external/jquery",
        "../external/angular",
        "../external/angular-aria",
        "../external/angular-animate",
        "../external/angular-material",
        "../external/angular-material-icons.min",
        //modules
        "../controllers/loginController",
        "../directives/login/login"
    ],
    css:[
        "../external/angular-material",
        "../css/style"
    ]
};

router.get("/login", ensureUnauthenticated, function( req, res ){
    res.render("login", {
        dependances: dependances,
        title: "Login"
    });
});

router.get("/twitter",
    ensureUnauthenticated,
    passport.authenticate("twitter")
);

router.get("/twitter/callback",
    passport.authenticate("twitter", { failureRedirect: "auth/login" }),
    function( req, res ){
        res.redirect("/");
    });

router.get("/logout", function( req, res ){
    req.logout();
    res.redirect("/");
});

function ensureAuthenticated( req, res, next ){
    if( req.isAuthenticated() ){
        return next();
    }
    res.redirect("auth/login");
}

function ensureUnauthenticated( req, res, next ){
    if( req.isAuthenticated() ){
        res.redirect("/");
    }
    else{
        return next();
    }

}

module.exports = {
    router: router,
    ensureAuthenticated: ensureAuthenticated,
    ensureUnauthenticated : ensureUnauthenticated
};
