//========================================
// Requires
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const users = mongoCollections.users;
const dogs = mongoCollections.dogs;
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

async function validateDog(dog){
  if (!dog) throw "dog is undefinded";
  if (!ObjectId.isValid(dog)) throw "dog is invalid";

  let parsedId = ObjectId.createFromHexString(dog);
  const dogsCollection = await dogs();
  const dogInfo = await dogsCollection.findOne({_id: parsedId});
  if (!dogInfo) throw "dog is not exist";
}

//========================================
// Body functions here

async function addComment(content, user, dog) {
  validateContent(content);
  await validateUser(user);
  await validateDog(dog);

  let comment = {
    content: content,
    user: user,
    dog: dog,
    date: new Date()
  }
  
  const commentsCollection = await comments();
  const insertInfo = await commentsCollection.insertOne(comment);
  if (insertInfo.insertedCount === 0) throw "could not add comments";

  return await getCommentsByDog(dog);
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

async function deleteCommentsByDog(dog){
  await validateDog(dog);

  const commentsCollection = await comments();
  const commentsInfo = await commentsCollection.find({dog: dog}).toArray();
  // if (!commentsInfo) throw "could not find comment successfully";

  await commentsCollection.deleteMany({dog: dog});
  // if (deletionInfo.deletedCount === 0) throw "could not delete comment with the dog";

  return commentsInfo;
}

async function getCommentsByUser(user){
  await validateUser(user);

  const commentsCollection = await comments();
  const comment = await commentsCollection.find({user: user}).sort({date: -1}).toArray();

  return comment
}

async function getCommentsByDog(dog){
  await validateDog(dog);

  const commentsCollection = await comments();
  const commentInfo = await commentsCollection.find({dog: dog}).sort({date: -1}).toArray();

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
  getCommentsByDog,
  deleteComment,
  deleteCommentsByDog,
}