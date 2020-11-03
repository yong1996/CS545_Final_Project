const express = require("express");
const router = express.Router();
const usersData = require("../data/user");
const middleware = require('./middleware');
const xss = require("xss");

router.get('/signup', middleware.notLoginRequired, async (req, res) => {
  res.render('account/signup', {title: "Signup", hideFooter: true});
});

router.post('/signup', middleware.notLoginRequired, middleware.signupLimiter, async (req, res) => {
  try {
    let username = xss(req.body.username);
    await usersData.addUser(username, req.body.password);
    res.redirect('/login');
  } catch (e) {
    res.status(401).render('account/signup', {title: "Signup", error: e, hideFooter: true});
  }
});

router.get('/logout', middleware.loginRequired, function(req, res) {
  req.session.destroy();
  return res.redirect('/');
});

router.get('/login', middleware.notLoginRequired, async (req, res) => {
  res.render('account/login', {title: "Login", hideFooter: true});
});

router.post('/login', middleware.notLoginRequired, middleware.loginLimiter, async (req, res) => {
  try {
    let username = xss(req.body.username);

    const compareResult = await usersData.comparePassword(username, req.body.password);
    req.session.userid = compareResult.userid;
    req.session.username = compareResult.username;

    return res.redirect('/user');  
  } catch (e) {
    res.status(401).render('account/login', {title: "Login", error: "Invalid username and/or password", hideFooter: true});
  }
});

module.exports = router;
