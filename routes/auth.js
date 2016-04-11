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
        "../controllers/loginApp",
        "../config/appConfig",
        "../config/const",
        "../config/theme",
        "../controllers/loginController",
        "../services/analitics/analitics",
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

router.get("/twitter/callback", function (req, res, next){

    passport.authenticate("twitter", { failureRedirect: "auth/login" })(req, res, function(err){

        if(err){

            req.logout();
            req.session.destroy();
            res.redirect("/auth/login");

        } else {

            res.redirect("/");
        }

    });

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
