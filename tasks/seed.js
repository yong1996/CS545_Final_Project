const dbConnection = require('../config/mongoConnection');
const questionData = require('../data/questions');
const userData = require('../data/user');
const commentsData = require('../data/comments');
const fs = require("fs");


const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    // =================================
    // Create a user 

    let originPassword1 = "a";

    let user1 = {
        username: 'a',
        password:originPassword1,
        avatarId: null
    }

    const userOne = await userData.addUser(user1.username, user1.password);
    console.log("user1 created");
    // await uploadUserAvatar(userId1, 'public/img/avatar/demo/user1.jpg');
    // await db.serverConfig.close();

    // question1 = await questionData.addQuestion(
    //     "11",
    //     "22",
    //     userId1
    // );
    // user1question1 = question1._id.toString();
    // await uploadQuestionAvatar(user1question1, 'public/img/question/demo/user1/question1.jpg');
    
    // console.log("a's question1 created");
    await db.serverConfig.close();
}

main().catch(console.log);
