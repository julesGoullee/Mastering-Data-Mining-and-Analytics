"use strict";

var config = require("./config/config");

var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");


if( !config.onlyClient ) {
    var session = require("express-session");
    var TwitterStrategy = require("passport-twitter").Strategy;
    var methodOverride = require("method-override");
    var passport = require("passport");
    var mongoConnector = require("./modules/mongo/mongoConnector.js");
    var MongoStore = require("connect-mongo")(session);
}

var routes = require("./routes/index");
var auth = require("./routes/auth");
//app.use(logger("dev"));
var jf = require('jsonfile');
var accounts = jf.readFileSync( __dirname + "/config/account.json");
if( !config.onlyClient ) {
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (obj, done) {
        done(null, obj);
    });

    passport.use(new TwitterStrategy({
            consumerKey: accounts.TWITTER_CONSUMER_KEY,
            consumerSecret: accounts.TWITTER_CONSUMER_SECRET,
            callbackURL: "http://" + config.domain + ":3000/auth/twitter/callback"
        },
        function (token, tokenSecret, profile, done) {

            process.nextTick(function () {
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
    var sessionMiddleware = session({
        secret: "keyboard cat",
        name: "token",
        proxy: true,
        resave: true,
        store: new MongoStore({
            mongooseConnection: mongoConnector.getConnection(),
            stringify: false
        }),
        saveUninitialized: true,
        cookie: {secure: false}
    });
}
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(favicon(__dirname + "/public/images/favicon.ico"));

if( !config.onlyClient ) {
    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    app.use(sessionMiddleware);

    app.use(passport.initialize());
    app.use(passport.session());
}
//routes
app.use("/", routes);

if( !config.onlyClient ){
    app.use("/auth", auth.router);
}

app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
