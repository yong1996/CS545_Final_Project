const express = require("express");
const router = express.Router();
const dogData = require("../data/dogs");
const commentData = require("../data/comments");
const breedData = require("../data/breed");
const multer  = require("multer");
const upload = multer({dest:"./public/img/upload"});
const middleware = require('./middleware');
const helper = require('./helper');
const xss = require("xss");

router.get('/', async (req, res) => {
    try{
      let dogs = await dogData.getAllDogs();

      let pageData = helper.pagination(dogs, req.query.page, 12);
      data = {
        title: "All Dogs",
        dogs : pageData.data,
        totalPage: pageData.totalPage,
        currentPage: pageData.currentPage,
        username : req.session.username
      };
      res.render('dogs/dogs', data);
    } catch (e) {
      res.status(500);
      res.render('error', {title: "Server Internal Error", errorCode: 500, username: req.session.username});
    }
});

router.post('/', middleware.loginRequiredJson, async (req, res) => {
    try{
      let gender = req.body.gender;
      let type = req.body.type;
      let dob = req.body.dob;
      let name = xss(req.body.name);
      let owner = req.session.userid;

      let dog = await dogData.addDog(name, gender, dob, type, owner);
      res.json({ status: "success", dog: dog });
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.get('/:id', async (req, res) => {
    try{
      let dogId = req.params.id;

      let dog = await dogData.getDog(dogId);
      let photoPagedData = await helper.getFirstPageOfPhotos(dog.photos);

      let comments = await commentData.getCommentsByDog(dogId);
      let commentPagedData = helper.pagination(comments, 1, 3);

      data = {
        title: dog.name, 
        dog: dog, 
        photos: photoPagedData.photos,
        isPhotoLastPage: photoPagedData.isLastPage,
        comments : commentPagedData.data,
        isCommentLastPage: commentPagedData.isLastPage,
        username : req.session.username,
        types: breedData.getBreeds()
      }

      if (dog.owner === req.session.username)
        res.render('dogs/single_dog_owner', data);
      else
        res.render('dogs/single_dog_public', data);
    } catch (e) {
      res.status(404);
      res.render('error', {title: "Not Found", errorCode: 404, username: req.session.username});
    }
});

router.delete('/:id', middleware.loginRequiredJson, async (req, res) => {
    try{
      let dogId = req.params.id;
      await dogData.checkOwner(req.session.userid, dogId);
      await dogData.removeDog(dogId);
      res.json({status: "success"});
    } catch (e) {
      res.status(500);
      res.json({status: "error", errorMessage: e});
    }
});

router.put('/:id', middleware.loginRequiredJson, async (req, res) => {
    try{
      let dogId = req.params.id;
      let dog = req.body.dog;
      dog.name = xss(dog.name);

      await dogData.checkOwner(req.session.userid, dogId);
      dog = await dogData.updateDog(dogId, dog);
      res.json({status: "success", dog: dog});
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.post('/:id/avatar', middleware.loginRequiredJson, upload.single('avatar'), async (req, res) => {
    try {
      let dogId = req.params.id;
      await dogData.checkOwner(req.session.userid, dogId);
      let dog = await dogData.updateAvatar(dogId, req.file);
      res.json({status: "success", avatar: dog.avatar});
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.post('/:id/heightWeight', middleware.loginRequiredJson, async (req, res) => {
    try {
      let dogId = req.params.id;
      let heightWeight = req.body.heightWeight;

      await dogData.checkOwner(req.session.userid, dogId);
      let dog = await dogData.addHeightWeight(dogId, heightWeight);
      res.json({status: "success", dog: dog});
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.get('/:id/photos', async (req, res) => {
    try{
        let dogId = req.params.id;
        let dog = await dogData.getDog(dogId);
        let pagedData = await helper.getCertainPageOfPhotos(dog.photos, req.query.page, 4);
        res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.status(500);
        res.json({status: "error", errorMessage: e});
    }
});

router.post("/:id/photos", middleware.loginRequiredJson, upload.single('photo'), async (req, res) => {
    try{
      let dogId = req.params.id;

      await dogData.checkOwner(req.session.userid, dogId);
      let dog = await dogData.addPhotos(dogId, req.file);
      let pagedData = await helper.getFirstPageOfPhotos(dog.photos);

      res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch(e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.get('/:id/comments', async (req, res) => {
    try{
        let dogId = req.params.id;
        let page = req.query.page;
        let comments = await commentData.getCommentsByDog(dogId);
        let pagedData = helper.pagination(comments, page, 3);

        res.json({status: "success", comments: pagedData.data, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.status(500);
        res.json({status: "error", errorMessage: e});
    }
});

router.post('/:id/comments', middleware.loginRequiredJson, middleware.commentLimiter, async (req, res) => {
    try{
        let dogId = req.params.id;
        let content = xss(req.body.content);

        let comments = await commentData.addComment(content, req.session.userid, dogId);
        let pagedData = helper.pagination(comments, 1, 3);

        res.json({status: "success", comments: pagedData.data, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.status(400);
        res.json({status: "error", errorMessage: e});
    }
});

router.delete('/:dogid/photo/:photoid', middleware.loginRequiredJson, async (req, res) => {
    try{
      let dogId = req.params.dogid;
      let photoId = req.params.photoid;

      await dogData.checkOwner(req.session.userid, dogId);
      let dog = await dogData.removePhoto(dogId, photoId);
      let pagedData = await helper.getFirstPageOfPhotos(dog.photos);

      res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch (e) {
      res.status(500);
      res.json({status: "error", errorMessage: e});
    }
});

module.exports = router;
