const express = require("express");
const router = express.Router();
const questionData = require("../data/questions");
const usersData = require("../data/user");
const commentData = require("../data/comments");
const multer  = require("multer");
const upload = multer({dest:"./public/img/upload"});
const middleware = require('./middleware');
const helper = require('./helper');
const xss = require("xss");

const checkType = (type) =>{
  if(type == "Help") return "Help";
  else if(type == "help") return "Help";
  else if(type == "Question") return "Question";
  else if(type == "question") return "Question";
  else return "Other";
}

router.get('/', async (req, res) => {
    try{
      var array = {}
      if(req.url != "/") {
        let search = req.url;
        let p = search.split("?")[1];
        let a = p.split("&");
        for(let i in a){
            let s = a[i].split("=");
            if(s[1] != "" && s[1] != "none" && s[0] != "page") {
              if (s[0] == "owner") {
                  let ownerId = await usersData.getUserByUsernameToId(s[1])
                  array["owner"] = ownerId;
              } else if(s[0] == "title") {
                let str = xss(s[1])
                let Uf = str.charAt(0).toUpperCase()
                let f = str.charAt(0)
                let l = str.slice(1);

                let re = new RegExp(`.*[${Uf}${f}]${l}.*`);
                array[s[0]] = re;
              } else {
                array[s[0]] = xss(s[1]);
              }
            }
        }
      }
      
      let questions = await questionData.getAllQuestions(array);

      let pageData = helper.pagination(questions, req.query.page, 12);
      
      data = {
        title: "All Questions",
        questions: pageData.data,
        totalPage: pageData.totalPage,
        currentPage: pageData.currentPage,
        username: req.session.username,
        petType: middleware.petType,
      };
      res.render('questions/questions', data);
    } catch (e) {
      res.status(500);
      res.render('error', {title: "Server Internal Error", errorCode: 500, username: req.session.username});
    }
});

router.post('/', middleware.loginRequiredJson, async (req, res) => {
    try{
      let title = xss(req.body.title);
      let description = xss(req.body.description);
      let pet = req.body.pet;
      let type = checkType(req.body.type);
      let owner = req.session.userid;
      let zip = req.session.zip;

      let question = await questionData.addQuestion(title, pet, type, description, owner, zip);
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
      
      if(question.type == "Help") {
        question.h = true;
      } else if (question.type == "Question") {
        question.q = true;
      } else {
        question.o = true;
      }
      question.petType = middleware.petType;
      
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
      let questionId = req.params.id;
      let question = req.body.question;
      question.title = xss(question.title);
      question.description = xss(question.description);
      question.pet = question.pet;
      question.type = checkType(question.type);

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
