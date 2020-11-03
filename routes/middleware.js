const settings = require("../config/settings");
const mongoConfig = settings.mongoConfig;
const RateLimit = require('express-rate-limit');
const MongoStore = require('rate-limit-mongo');
const dbUri = mongoConfig.serverUrl + mongoConfig.database;

let loginLimiter = new RateLimit({
  store: new MongoStore({uri: dbUri, collectionName: "loginLimiter"}),
  max: settings.limiterConfig.loginLimiter.max,
  windowMs: settings.limiterConfig.loginLimiter.windowMs,
  message: "too many requests in a short period, please try again after 1 minute",
  handler: function (req, res) {
    res.status(this.statusCode);
    res.render('account/login', {title: "Login", error: this.message, hideFooter: true});
  }
});
 
var signupLimiter = new RateLimit({
  store: new MongoStore({uri: dbUri, collectionName: "signupLimiter"}),
  max: settings.limiterConfig.signupLimiter.max,
  windowMs: settings.limiterConfig.signupLimiter.windowMs,
  message: "tried to create too many accounts in a short period, please try again after an hour",
  handler: function (req, res) {
    res.status(this.statusCode);
    res.render('account/signup', {title: "Signup", error: this.message, hideFooter: true});
  }
});

var commentLimiter = new RateLimit({
  store: new MongoStore({uri: dbUri, collectionName: "commentLimiter"}),
  max: settings.limiterConfig.commentLimiter.max,
  windowMs: settings.limiterConfig.commentLimiter.max,
  message: "tried to post too many comments in a short period, please try again after 20 minutes",
  handler: function (req, res) {
    res.status(this.statusCode);
    res.json({status: "error", errorMessage: this.message});
  }
});

let sessionConfig = {
  name: 'AuthCookie',
  secret: 'cs548dogdog',
  resave: false,
  saveUninitialized: true
}

const loginRequired = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect('/login');
    return;
  }
  next();
}

const loginRequiredJson = (req, res, next) => {
  if (!req.session.userid) {
    res.json({redirect: '/login'});
    return;
  }
  next();
}

const notLoginRequired = (req, res, next) => {
  if (req.session.userid) {
    res.redirect('/user');
    return;
  }
  next();
}

module.exports = {
  loginLimiter,
  signupLimiter,
  commentLimiter,
  sessionConfig,
  loginRequired,
  loginRequiredJson,
  notLoginRequired,
}