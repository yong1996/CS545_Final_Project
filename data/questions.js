const mongoCollections = require("../config/mongoCollections");
const questions = mongoCollections.questions;
const users = mongoCollections.users;
// const comments = mongoCollections.comments;
const imgData = require("./img");
const commentData = require("./comments");
const breedData = require("./breed");
const ObjectId = require('mongodb').ObjectID;

// ======================================================
// Helper functions
function firstLetterUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertDateToString(date) {
  return date.getFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();
}

function ComparableDate(hw1,hw2){
  if (isNaN(Date.parse(hw1.date))) throw "date1 is invalid";
  date1 = Date.parse(hw1.date);
  date1 = new Date(date1);

  if (isNaN(Date.parse(hw2.date))) throw "date2 is invalid";
  date2 = Date.parse(hw2.date);
  date2 = new Date(date2);

  return date1 - date2
}

// ======================================================
// Validate functions
function validateId(id){
  if (!id) throw "id is undefinded";
  if (id.constructor !== String) throw "id is not a string";
  if (!ObjectId.isValid(id)) throw "id is invalid";
}

function validateTitle(title){
  if (!title) throw "title is undefinded";
  if (title.constructor !== String) throw "title is not a string";
  if (title.length > 30) throw "length title is greater than 30";
}

async function validateOwner(owner){
  if (!owner) throw "owner is undefinded";
  if (owner.constructor !== String) throw "owner is not a string";

  const usersCollection = await users();
  parsedOwner = ObjectId.createFromHexString(owner);
  const user = await usersCollection.find({_id:parsedOwner});
  if (user == null) thorw `owner with the id ${parsedOwner} is not exist`;
}

// ======================================================
// Body functions
async function addQuestion(title, description, owner){
  validateTitle(title);
  await validateOwner(owner);

  let question = {
    title: title,
    description: description,
    avatar: null,
    owner: owner,
    photos: []}

  const questionsCollection = await questions();
  const insertedInfo = await questionsCollection.insertOne(question);
  if (insertedInfo.insertedCount === 0) throw "could not create the question";
  const questionId = insertedInfo.insertedId;

  const usersCollection = await users();
  const updateInfo = await usersCollection.updateOne({ _id: ObjectId.createFromHexString(owner) },
                                        {$push: {questions: { $each: [ ObjectId(questionId).toString() ], $position: 0}}});
  if (updateInfo.modifiedCount === 0) throw "could not add the question to the user";

  return await getQuestion(questionId.toString());
}

async function updateQuestion(id, question){
  validateId(id);
  validateTitle(question.title);
  validateDiscussion(question.description);

  let updateQuestion = {
    title: question.title,
    description: description,
  }

  const questionsCollection = await questions();
  const parsedId = ObjectId.createFromHexString(id);
  const updateInfo = await questionsCollection.updateOne({_id: parsedId}, {$set: updateQuestion});
  if (updateInfo.modifiedCount === 0) throw "nothing changed";

  return await this.getQuestion(id);
}

async function checkOwner(ownerId, questionId){
  validateId(ownerId);
  validateId(questionId);

  const questionsCollection = await questions();
  const parsedId = ObjectId.createFromHexString(questionId);
  const question = await questionsCollection.findOne({_id:parsedId});
  if (!question) throw "could not find question successfully";

  if (question.owner != ownerId) throw "invalid permission, owner doesn't match";
}

async function removeQuestion(id){
  validateId(id);

  const questionsCollection = await questions();
  const parsedId = ObjectId.createFromHexString(id);
  const removedData = await questionsCollection.findOne({_id:parsedId});
  if (!removedData) throw "could not find question successfully";

  // delete comment
  await commentData.deleteCommentsByQuestion(id);
  // delete from user
  const usersCollection = await users();
  const parsedOwnerId = ObjectId.createFromHexString(removedData.owner);
  const updateInfo = await usersCollection.updateOne( { _id: parsedOwnerId }, {$pull: {questions: id}});
  if (updateInfo.modifiedCount === 0) throw "could not delete the question in the user";
  // delete photos
  for (let photoId of removedData.photos) {
    imgData.deletePhoto(photoId);
  }
  // delete avatar
  if (removedData.avatar) imgData.deletePhoto(removedData.avatar);
  // delete question
  const deletionInfo = await questionsCollection.removeOne({ _id: parsedId });
  if (deletionInfo.deletedCount === 0) throw `could not delete question with id of ${id}`;

  return removedData;
}

async function getAllQuestions(){
  const questionsCollection = await questions();
  const allQuestions = await questionsCollection.find().sort({ $natural: -1 }).toArray();
  if (!allQuestions) throw 'no question found';

  for(let question of allQuestions) {
    if (question.avatar) question.avatar = await imgData.getPhotoDataId(question.avatar);
    question.age = calculateAge(question.dob);
  }

  return allQuestions;
}

async function getQuestion(id){
  validateId(id);

  const questionsCollection = await questions();
  let parsedId = ObjectId.createFromHexString(id);
  const question = await questionsCollection.findOne({_id: parsedId});
  if (!question) throw "question not found";

  const usersCollection = await users();
  const owner = await usersCollection.findOne({_id: ObjectId.createFromHexString(question.owner)});
  if (!owner) throw "owner not found";

  question.owner = owner.username;
  // question.age = calculateAge(question.dob);
  // question.dob = convertDateToString(question.dob);

  if (question.avatar) question.avatar = await imgData.getPhotoDataId(question.avatar);

  // if(question.heightWeight && question.heightWeight.length) {
  //   question.weightList = [], question.bmiList = [], question.healthDateList = [];
  //   question.weight = question.heightWeight[question.heightWeight.length - 1].weight;
  //   question.height = question.heightWeight[question.heightWeight.length - 1].height;
  //   question.bmi = Math.round(question.weight / question.height * 100) / 100;
  //   question.lastHeightWeightUpdate = convertDateToString(question.heightWeight[0].date);
  //   for (let hw of question.heightWeight) {
  //     question.weightList.push(hw.weight);
  //     question.bmiList.push(Math.round(hw.weight / hw.height * 100) / 100);
  //     question.healthDateList.push(convertDateToString(hw.date));
  //   }
  // }
  // question.healthCondition = getQuestionHealthCondition(question.type, question.age, question.weight, question.gender)

  return question;
}

async function updateAvatar(id, file){
  validateId(id);

  const questionsCollection = await questions();
  let parsedId = ObjectId.createFromHexString(id);
  let oldQuestion = await questionsCollection.findOne({ _id: parsedId })
  let photoId = await imgData.createGridFS(file);
  const updateInfo = await questionsCollection.updateOne({ _id: parsedId }, { $set: {avatar: photoId.toString()}});
  if (updateInfo.modifiedCount === 0) throw "Could not update avatar successfully";
  
  if(oldQuestion.avatar !== null)
    await imgData.deletePhoto(oldQuestion.avatar)

  return await getQuestion(id);
}

async function addPhotos(id, file){
  validateId(id);

  const questionsCollection = await questions();
  let parsedId = ObjectId.createFromHexString(id);
  let photoId = await imgData.createGridFS(file);
  const updateInfo = await questionsCollection.updateOne({ _id: parsedId },
                          { $push: {photos: { $each: [ photoId.toString() ], $position: 0}}});
  if (updateInfo.modifiedCount === 0) throw "could not add a new photo successfully";

  return await getQuestion(id);
}

async function removePhoto(questionId, photoId){
  validateId(questionId);
  validateId(photoId);

  const questionsCollection = await questions();
  let parsedQuestionId = ObjectId.createFromHexString(questionId);
  const updateInfo = await questionsCollection.updateOne({ _id: parsedQuestionId } ,{$pull: {photos: photoId}});
  if (updateInfo.modifiedCount === 0) throw "could not remove the photo successfully";

  imgData.deletePhoto(photoId);

  return getQuestion(questionId);
}

async function getPopularQuestions() {
  const questionsCollection = await questions();
  const allQuestions = await questionsCollection.aggregate([
    {$match: {"avatar":{$ne:null}}},
    {$sample: {size: 4}}
  ]).toArray();
  if (!allQuestions) throw 'no question found';

  for(let question of allQuestions) {
    if (question.avatar) question.avatar = await imgData.getPhotoDataId(question.avatar);
    question.age = calculateAge(question.dob);
  }

  return allQuestions;
}

module.exports = {
  addQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
  updateAvatar,
  removeQuestion,
  addPhotos,
  removePhoto,
  checkOwner,
  getPopularQuestions
}
