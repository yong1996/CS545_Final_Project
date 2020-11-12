//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const questions = mongoCollections.questions;
const imgData = require("./img");
const ObjectId = require('mongodb').ObjectID;

//========================================
// Helper functions
function convertDateToString(date) {
  return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
}


//========================================
// Validate functions
function validateId(id){
  if (!id) throw "id is undefinded";
  if (id.constructor !== String) throw "id is not a string";
  if (!ObjectId.isValid(id)) throw "id is invalid";
}

async function validateUser(user){
  if (!user) throw "user is undefinded";
  if (!ObjectId.isValid(user)) throw "user is invalid";

  let parsedId = ObjectId.createFromHexString(user);
  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({_id: parsedId});
  if (!userInfo) throw "user is not exist";
}

function validateContent(content){
  if (!content) throw "content is undefinded";
  if (content.constructor !== String) throw "content is not a string";
  if (content.length > 160) throw `length of you comment is greater than 160`;
}

async function validateQuestion(question){
  if (!question) throw "question is undefinded";
  if (!ObjectId.isValid(question)) throw "question is invalid";

  let parsedId = ObjectId.createFromHexString(question);
  const questionsCollection = await questions();
  const questionInfo = await questionsCollection.findOne({_id: parsedId});
  if (!questionInfo) throw "question is not exist";
}

//========================================
// Body functions here

async function addComment(content, user, question) {
  validateContent(content);
  await validateUser(user);
  await validateQuestion(question);

  let comment = {
    content: content,
    user: user,
    question: question,
    date: new Date()
  }
  
  const commentsCollection = await comments();
  const insertInfo = await commentsCollection.insertOne(comment);
  if (insertInfo.insertedCount === 0) throw "could not add comments";

  return await getCommentsByQuestion(question);
}

async function getComment(id){
  validateId(id);

  const commentsCollection = await comments();
  let parsedId = ObjectId.createFromHexString(id);
  const comment = await commentsCollection.findOne({_id:parsedId});
  if (!comment) throw `could not find the comment with id of ${parsedId}`;

  let parsedUserId = ObjectId.createFromHexString(comment.user);
  const usersCollection = await users();
  const userInfo = await usersCollection.findOne({_id: parsedUserId });
  if (!userInfo) throw "could not find user successfully";
  
  comment.user = {};
  comment.user.username = userInfo.username;
  comment.date = convertDateToString(comment.date);
  if (comment.user.avatar) {
    comment.user.avatar = await imgData.getPhotoDataId(comment.user.avatar);
  }

  return comment;
}

async function deleteComment(id){
  validateId(id);

  const commentsCollection = await comments();
  let parsedId = ObjectId.createFromHexString(id);
  const comment = await commentsCollection.findOne({_id:parsedId});
  if (!comment) throw "could not find comment successfully";

  const deletionInfo = await commentsCollection.deleteOne({_id:parsedId});
  if (deletionInfo.deletedCount === 0) throw `could not delete comment with id of ${id}`;

  return comment;
}

async function deleteCommentsByQuestion(question){
  await validateQuestion(question);

  const commentsCollection = await comments();
  const commentsInfo = await commentsCollection.find({question: question}).toArray();
  // if (!commentsInfo) throw "could not find comment successfully";

  await commentsCollection.deleteMany({question: question});
  // if (deletionInfo.deletedCount === 0) throw "could not delete comment with the question";

  return commentsInfo;
}

async function getCommentsByUser(user){
  await validateUser(user);

  const commentsCollection = await comments();
  const comment = await commentsCollection.find({user: user}).sort({date: -1}).toArray();

  return comment
}

async function getCommentsByQuestion(question){
  await validateQuestion(question);

  const commentsCollection = await comments();
  const commentInfo = await commentsCollection.find({question: question}).sort({date: -1}).toArray();

  for (let comment of commentInfo) {
    const usersCollection = await users();
    let parsedUserId = ObjectId.createFromHexString(comment.user);
    const userInfo = await usersCollection.findOne({_id: parsedUserId });
    if (!userInfo) throw "could not find user successfully";
    comment.user = {};
    comment.user.username = userInfo.username;
    comment.date = convertDateToString(comment.date);
    if (userInfo.avatar) {
      comment.user.avatar = await imgData.getPhotoDataId(userInfo.avatar);
    }
  }

  return commentInfo;
}

module.exports = {
  addComment,
  getComment,
  getCommentsByUser,
  getCommentsByQuestion,
  deleteComment,
  deleteCommentsByQuestion,
}