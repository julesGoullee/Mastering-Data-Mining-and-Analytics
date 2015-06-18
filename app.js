"use strict";

var config = require("./config/config");

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
//var logger = require("morgan");
//app.use(logger("dev"));

var routes = require("./routes/index");
var sessionMiddleware = {};


if( config.api.active ) {
    var jf = require('jsonfile');
    var accounts = jf.readFileSync( __dirname + "/config/account.json");

    var session = require("express-session");
    var TwitterStrategy = require("passport-twitter").Strategy;
    var methodOverride = require("method-override");
    var passport = require("passport");
    var mongoConnector = require("./modules/mongo/mongoConnector.js");
    var MongoStore = require("connect-mongo")(session);
    var auth = require("./routes/auth");

    passport.serializeUser(function( user, done ){
        done(null, user);
    });

    passport.deserializeUser(function( obj, done ){
        done(null, obj);
    });

    passport.use(new TwitterStrategy({
            consumerKey: accounts.TWITTER_CONSUMER_KEY,
            consumerSecret: accounts.TWITTER_CONSUMER_SECRET,
            callbackURL: "http://" + config.webServer.apiAddress + ":" + config.webServer.apiPort + "/auth/twitter/callback"
        },
        function( token, tokenSecret, profile, done ){

            process.nextTick(function(){
                var profileSave = {
                    id: profile.id,
                    username: profile.username,
                    token: token,
                    tokenSecret: tokenSecret,
                    photoUrl: profile.photos[0].value
                };
                return done(null, profileSave);
            });
        }
    ));
    sessionMiddleware = session({
        secret: "keyboard cat",
        name: "token",
        proxy: true,
        resave: true,
        store: new MongoStore({
            mongooseConnection: mongoConnector.getConnection(),
            stringify: false
        }),
        saveUninitialized: false,
        cookie: {secure: false}
    });
}

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(favicon(__dirname + "/public/images/favicon.ico"));

if( config.api.active ){
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use(sessionMiddleware);

    app.use(passport.initialize());
    app.use(passport.session());
    app.use("/auth", auth.router);
}
//routes

if( config.webServer.active ){
    app.use("/", routes);

    app.use(express.static(path.join(__dirname, "public")));
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    console.log(req.originalUrl);
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// development error handler
if( app.get("env") === "development" ){
    app.use(function( err, req, res ){
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

// production error handler
app.use(function( err, req, res ){

    res.status( err.status || 500 );
    res.render("error", {
        message: err.message,
        error: {}
    });
});

module.exports = {
    app: app,
    sessionMiddleware : sessionMiddleware
};
