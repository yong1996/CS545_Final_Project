const dbConnection = require('../config/mongoConnection');
const questionData = require('../data/questions');
const userData = require('../data/user');
const commentsData = require('../data/comments');
const fs = require("fs");

function getFile(path){
    let imgInfo = { mimetype: 'image/jpeg',
                    filename: 'dog image',
                    fieldname: 'avatar',
                    path : path,
                 }
    return imgInfo;
}

async function uploadQuestionAvatar(id, filepath){
    let imgPath = filepath.split('.')[0]
    let file = getFile(filepath)
    fs.writeFileSync(imgPath, fs.readFileSync(filepath));
    let photo = await questionData.updateAvatar(id, file)
    fs.rename(imgPath, filepath, function(err) {
        if (err) console.log(err);
        console.log('successfully set dog avatar');
    });
}

async function uploadUserAvatar(id, filepath){
    let imgPath = filepath.split('.')[0]
    let file = getFile(filepath)
    fs.writeFileSync(imgPath, fs.readFileSync(filepath));
    let photo = await userData.updateAvatar(id, file)
    fs.rename(imgPath, filepath, function(err) {
        if (err) console.log(err);
        console.log('successfully set user avatar');
    })
    
}

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();
    // =================================
    let originPassword1 = "a";
    let user1 = {
        username: 'a',
        password:originPassword1,
        avatarId: null
    }
    const userOne = await userData.addUser(user1.username, user1.password);
    console.log("user1 created");
    let userId1 = userOne._id.toString();
    await uploadUserAvatar(userId1, 'public/img/avatar/demo/user1.jpg');

    let originPassword2 = "b";
    let user2 = {
        username: 'b',
        password:originPassword2,
        avatarId: null
    }
    const userTwo = await userData.addUser(user2.username, user2.password);
    console.log("user2 created");
    let userId2 = userTwo._id.toString();
    await uploadUserAvatar(userId2, 'public/img/avatar/demo/user2.jpg');

    // =================================
    question1 = await questionData.addQuestion(
        "11",
        "22",
        userId1
    );
    user1question1 = question1._id.toString();
    await uploadQuestionAvatar(user1question1, 'public/img/question/dog.jpg');
    console.log("a's question1 created");

    // =================================
    for (let i = 0; i < 8; i++) {
        comment = await commentsData.addComment("You are so lovely", userId2, user1question1);
    }
    console.log("question1's comment created");


    // =================================
    await db.serverConfig.close();
}

main().catch(console.log);
