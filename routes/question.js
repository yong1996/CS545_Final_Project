const express = require("express");
const router = express.Router();
const questionData = require("../data/questions");
const commentData = require("../data/comments");
const multer  = require("multer");
const upload = multer({dest:"./public/img/upload"});
const middleware = require('./middleware');
const helper = require('./helper');
const xss = require("xss");

router.get('/', async (req, res) => {
    try{
      let questions = await questionData.getAllQuestions();

      let pageData = helper.pagination(questions, req.query.page, 12);
      data = {
        title: "All Questions",
        questions : questions,
        totalPage: pageData.totalPage,
        currentPage: pageData.currentPage,
        username : req.session.username
      };
      res.render('questions/questions', data);
    } catch (e) {
      res.status(500);
      res.render('error', {title: "Server Internal Error", errorCode: 500, username: req.session.username});
    }
});

router.post('/', middleware.loginRequiredJson, async (req, res) => {
    try{
      console.log("add question:");
      
      console.log(req.body);
      
      let title = xss(req.body.title);
      let description = xss(req.body.description);
      let pet = req.body.pet;
      let type = req.body.type;
      let owner = req.session.userid;

      let question = await questionData.addQuestion(title, pet, type, description, owner);
      res.json({ status: "success", question: question });
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.get('/:id', async (req, res) => {
    try{
      let questionId = req.params.id;

      let question = await questionData.getQuestion(questionId);
      let photoPagedData = await helper.getFirstPageOfPhotos(question.photos);

      let comments = await commentData.getCommentsByQuestion(questionId);
      let commentPagedData = helper.pagination(comments, 1, 3);

      data = {
        title: question.title, 
        question: question, 
        photos: photoPagedData.photos,
        isPhotoLastPage: photoPagedData.isLastPage,
        comments : commentPagedData.data,
        isCommentLastPage: commentPagedData.isLastPage,
        username : req.session.username,
      }

      if (question.owner === req.session.username)
        res.render('questions/single_question_owner', data);
      else
        res.render('questions/single_question_public', data);
    } catch (e) {
      res.status(404);
      res.render('error', {title: "Not Found", errorCode: 404, username: req.session.username});
    }
});

router.delete('/:id', middleware.loginRequiredJson, async (req, res) => {
    try{
      let questionId = req.params.id;
      await questionData.checkOwner(req.session.userid, questionId);
      await questionData.removeQuestion(questionId);
      res.json({status: "success"});
    } catch (e) {
      res.status(500);
      res.json({status: "error", errorMessage: e});
    }
});

router.put('/:id', middleware.loginRequiredJson, async (req, res) => {
    try{
      console.log("update question:");
      console.log(req.body.question);

      let questionId = req.params.id;
      let question = req.body.question;
      question.title = xss(question.title);
      question.description = xss(question.description);
      question.pet = question.pet;
      question.type = question.type;

      await questionData.checkOwner(req.session.userid, questionId);
      question = await questionData.updateQuestion(questionId, question);
      res.json({status: "success", question: question});
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.post('/:id/avatar', middleware.loginRequiredJson, upload.single('avatar'), async (req, res) => {
    try {
      let questionId = req.params.id;
      await questionData.checkOwner(req.session.userid, questionId);
      let question = await questionData.updateAvatar(questionId, req.file);
      res.json({status: "success", avatar: question.avatar});
    } catch (e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.get('/:id/photos', async (req, res) => {
    try{
        let questionId = req.params.id;
        let question = await questionData.getQuestion(questionId);
        let pagedData = await helper.getCertainPageOfPhotos(question.photos, req.query.page, 4);
        res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.status(500);
        res.json({status: "error", errorMessage: e});
    }
});

router.post("/:id/photos", middleware.loginRequiredJson, upload.single('photo'), async (req, res) => {
    try{
      let questionId = req.params.id;

      await questionData.checkOwner(req.session.userid, questionId);
      let question = await questionData.addPhotos(questionId, req.file);
      let pagedData = await helper.getFirstPageOfPhotos(question.photos);

      res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch(e) {
      res.status(400);
      res.json({status: "error", errorMessage: e});
    }
});

router.get('/:id/comments', async (req, res) => {
    try{
        let questionId = req.params.id;
        let page = req.query.page;
        let comments = await commentData.getCommentsByQuestion(questionId);
        let pagedData = helper.pagination(comments, page, 3);

        res.json({status: "success", comments: pagedData.data, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.status(500);
        res.json({status: "error", errorMessage: e});
    }
});

router.post('/:id/comments', middleware.loginRequiredJson, async (req, res) => {
    try{
        let questionId = req.params.id;
        let content = xss(req.body.content);

        let comments = await commentData.addComment(content, req.session.userid, questionId);
        let pagedData = helper.pagination(comments, 1, 3);

        res.json({status: "success", comments: pagedData.data, isLastPage: pagedData.isLastPage});
    } catch (e) {
        res.status(400);
        res.json({status: "error", errorMessage: e});
    }
});

router.delete('/:questionid/photo/:photoid', middleware.loginRequiredJson, async (req, res) => {
    try{
      let questionId = req.params.questionid;
      let photoId = req.params.photoid;

      await questionData.checkOwner(req.session.userid, questionId);
      let question = await questionData.removePhoto(questionId, photoId);
      let pagedData = await helper.getFirstPageOfPhotos(question.photos);

      res.json({status: "success", photos: pagedData.photos, isLastPage: pagedData.isLastPage});
    } catch (e) {
      res.status(500);
      res.json({status: "error", errorMessage: e});
    }
});

module.exports = router;
