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
    // Create a user 

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
    // await db.serverConfig.close();

    question1 = await questionData.addQuestion(
        "11",
        "22",
        userId1
    );
    user1question1 = question1._id.toString();
    await uploadQuestionAvatar(user1question1, 'public/img/question/dog.jpg');
    
    console.log("a's question1 created");
    await db.serverConfig.close();
}

main().catch(console.log);
