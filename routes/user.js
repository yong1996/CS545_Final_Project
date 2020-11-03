const express = require("express");
const router = express.Router();
const breedData = require("../data/breed");
const usersData = require("../data/user");
const multer  = require("multer");
const upload = multer({dest:"./public/img/upload"});
const middleware = require('./middleware');

router.get('/', middleware.loginRequired, async (req, res) => {
  try {
    let user = await usersData.getUser(req.session.userid);
    let types = breedData.getBreeds();
    data = {
      title: "Profile",
      username : req.session.username,
      user : user,
      types : types
    }
    res.render('user/single_user_owner', data);
  } catch (e) {
    res.status(500);
    res.render('error', {title: "Server Internal Error", errorCode: 500, username: req.session.username});
  }
});

router.get('/:username', async (req, res) => {
  try {
    let username = req.params.username;

    let user = await usersData.getUserByUsername(username);
    data = {
      title: user.username,
      username : req.session.username,
      user : user
    }
    res.render('user/single_user_public', data);
  } catch (e) {
    res.status(404);
    res.render('error', {title: "Not Found", errorCode: 404, username: req.session.username});
  }
});

router.post('/password', middleware.loginRequiredJson, async (req, res) => {
  try {
    await usersData.comparePassword(req.session.username, req.body.oldpassword);
  } catch (e) {
    res.json({status: "error", errorMessage: "invalid old password"});
    return;
  }
  try {
    await usersData.changePassword(req.session.userid, req.body.newpassword);
    res.json({status: "success"});
  } catch (e) {
    res.status(500);
    res.json({status: "error", errorMessage: e});
  }
});

router.post('/avatar', middleware.loginRequiredJson, upload.single('avatar'), async (req, res) => {
  try {
    let user = await usersData.updateAvatar(req.session.userid, req.file);
    res.json({status: "success", avatar: user.avatar});
  } catch (e) {
    res.status(500);
    res.json({status: "error", errorMessage: e});
  }
});

module.exports = router;
