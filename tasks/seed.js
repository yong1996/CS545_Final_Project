const dbConnection = require('../config/mongoConnection');
const dogData = require('../data/dogs');
const userData = require('../data/user');
const commentsData = require('../data/comments');
const breedData = require("../data/breed");
const fs = require("fs");

// =================================
// helper functions
function getFile(path){
    let imgInfo = { mimetype: 'image/jpeg',
                    filename: 'dog image',
                    fieldname: 'avatar',
                    path : path,
                 }
    return imgInfo;
}

function getFilePhoto(path){
    let imgInfo = { mimetype: 'image/jpeg',
                    filename: 'dog image',
                    fieldname: 'photo',
                    path : path,
                 }
    return imgInfo;
}

async function uploadDogAvatar(id, filepath){
    let imgPath = filepath.split('.')[0]
    let file = getFile(filepath)
    fs.writeFileSync(imgPath, fs.readFileSync(filepath));
    let photo = await dogData.updateAvatar(id, file)
    fs.rename(imgPath, filepath, function(err) {
        if (err) console.log(err);
        console.log('successfully set dog avatar');
    });
}

async function uploadDogPhoto(id, filepath){
    let imgPath = filepath.split('.')[0]
    let file = getFilePhoto(filepath)
    fs.writeFileSync(imgPath, fs.readFileSync(filepath));
    let photo = await dogData.addPhotos(id, file)
    fs.rename(imgPath, filepath, function(err) {
        if (err) console.log(err);
        console.log('successfully set dog photo');
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


    // user1
    let originPassword1 = "testtest";

    let user1 = {
        username: 'IamHugh',
        password:originPassword1,
        avatarId: null
    }

    const userOne = await userData.addUser(user1.username, user1.password);

    let userId1 = userOne._id.toString();
    await uploadUserAvatar(userId1, 'public/img/avatar/demo/user1.jpg');
    console.log("user1 created");


    // user 2

    let originPassword2 = "myPassword";

    let user2 = {
        username: 'LucyLoveDog',
        password:originPassword2,
        avatarId: null
    }

    const userTwo = await userData.addUser(user2.username, user2.password);
    let userId2 = userTwo._id.toString();
    await uploadUserAvatar(userId2, 'public/img/avatar/demo/user2.jpg');
    console.log("user2 created");

    // user 3

    let originPassword3 = "passpass1";

    let user3 = {
        username: 'MyNameMike',
        password:originPassword3,
        avatarId: null
    }

    const userThree = await userData.addUser(user3.username, user3.password);
    let userId3 = userThree._id.toString();
    await uploadUserAvatar(userId3, 'public/img/avatar/demo/user3.jpg');
    console.log("user3 created");


    // user 4

    let originPassword4 = "mysuperpassword";

    let user4 = {
        username: 'Greeneee',
        password:originPassword4,
        avatarId: null
    }

    const userFour = await userData.addUser(user4.username, user4.password);
    let userId4 = userFour._id.toString();
    await uploadUserAvatar(userId4, 'public/img/avatar/demo/user4.jpg');
    console.log("user4 created");

       // user 5

       let originPassword5 = "CS546isGood";

       let user5 = {
           username: 'PatrickHill',
           password:originPassword5,
           avatarId: null
       }
   
       const userFive = await userData.addUser(user5.username, user5.password);
       let userId5 = userFive._id.toString();
       await uploadUserAvatar(userId5, 'public/img/avatar/demo/user5.jpg');
       console.log("user4 created");
    
    // =================================
    // update seed img


    // =================================
    //  Create a dog
    // console.log(userOne);
    
    // hugh's dog
    

    dog1 = await dogData.addDog(
        "Painting",
        "Male",
        "2017-04-19",
        "Samoyed",
        userId1
    );
    user1dog1 = dog1._id.toString();
    await uploadDogAvatar(user1dog1, 'public/img/dog/demo/user1/dog1.jpg');
    
    console.log("hugh's dog1 created");

    dog2 = await dogData.addDog(
        "Snow",
        "Female",
        "2018-03-13",
        "Samoyed",
        userId1
    );
    user1dog2 = dog2._id.toString();
    await uploadDogAvatar(user1dog2, 'public/img/dog/demo/user1/dog2.jpg');
    console.log("hugh's dog2 created");

    // Lucy's dog
    

    
    userId2dog1 = await dogData.addDog(
        "P",
        "Male",
        "2018-10-19",
        "Husky",
        userId2
    );
    user2dog1 = userId2dog1._id.toString();
    await uploadDogAvatar(user2dog1, 'public/img/dog/demo/user2/dog1.jpg');
    console.log("Lucy's dog1 created");

    userId2dog2 = await dogData.addDog(
        "Rose",
        "Female",
        "2015-06-22",
        "Golden retriever",
        userId2
    );
    user2dog2 = userId2dog2._id.toString();
    await uploadDogAvatar(user2dog2, 'public/img/dog/demo/user2/dog2.jpg');
    console.log("Lucy's dog2 created");

    await uploadDogPhoto(user2dog2, 'public/img/dog/demo/dog5/dogPhoto1.jpg');
    await uploadDogPhoto(user2dog2, 'public/img/dog/demo/dog5/dogPhoto2.jpg');
    console.log("Lucy's dog2 photos added");

    userId2dog3 = await dogData.addDog(
        "Sky",
        "Female",
        "2016-08-01",
        "Golden retriever",
        userId2
    );
    user2dog3 = userId2dog3._id.toString();
    await uploadDogAvatar(user2dog3, 'public/img/dog/demo/user2/dog3.jpg');
    console.log("Lucy's dog3 created");

    await uploadDogPhoto(user2dog3, 'public/img/dog/demo/dog4/dogPhoto1.jpg');
    await uploadDogPhoto(user2dog3, 'public/img/dog/demo/dog4/dogPhoto2.jpg');
    console.log("Lucy's dog3 photos added");


    // Mike's dog
    
    
    userId3dog1 = await dogData.addDog(
        "Ricky",
        "Male",
        "2017-09-19",
        "Afghan hound",
        userId3
    );
    user3dog1 = userId3dog1._id.toString();
    await uploadDogAvatar(user3dog1, 'public/img/dog/demo/user3/dog1.jpg');
    console.log("Mike's dog1 created");
    
    // Green's dog
    
    userId4dog1 = await dogData.addDog(
        "Fierce",
        "Male",
        "2013-09-19",
        "Alaskan malamute",
        userId4
    );
    user4dog1 = userId4dog1._id.toString();
    await uploadDogAvatar(user4dog1, 'public/img/dog/demo/user4/dog1.jpg');
    console.log("Green's dog1 created");

    userId4dog2 = await dogData.addDog(
        "H",
        "Female",
        "2014-10-19",
        "Alaskan malamute",
        userId4
    );
    user4dog2 = userId4dog2._id.toString();
    await uploadDogAvatar(user4dog2, 'public/img/dog/demo/user4/dog2.jpg');
    console.log("Green's dog2 created");

    userId4dog3 = await dogData.addDog(
        "L",
        "Female",
        "2015-10-19",
        "Other",
        userId4
    );
    user4dog3 = userId4dog3._id.toString();
    await uploadDogAvatar(user4dog3, 'public/img/dog/demo/user4/dog3.jpg');
    console.log("Green's dog3 created");

    await uploadDogPhoto(user4dog3, 'public/img/dog/demo/dog1/dogPhoto1.jpg');
    await uploadDogPhoto(user4dog3, 'public/img/dog/demo/dog1/dogPhoto2.jpg');
    await uploadDogPhoto(user4dog3, 'public/img/dog/demo/dog1/dogPhoto3.jpg');
    console.log("Green's dog3 photo added");

    userId4dog4 = await dogData.addDog(
        "L",
        "Female",
        "2015-10-19",
        "Other",
        userId4
    );
    user4dog4 = userId4dog4._id.toString();
    await uploadDogAvatar(user4dog4, 'public/img/dog/demo/user4/dog4.jpg');
    console.log("Green's dog4 created");

    userId4dog5 = await dogData.addDog(
        "L",
        "Female",
        "2015-10-19",
        "Other",
        userId4
    );
    user4dog5 = userId4dog5._id.toString();
    await uploadDogAvatar(user4dog5, 'public/img/dog/demo/user4/dog5.jpg');
    console.log("Green's dog5 created");

    // Hill's dog
    
    userId5dog1 = await dogData.addDog(
        "R",
        "Male",
        "2018-03-19",
        "Husky",
        userId5
    );
    user5dog1 = userId5dog1._id.toString();
    await uploadDogAvatar(user5dog1, 'public/img/dog/demo/user5/dog1.jpg');
    //Photo by __ drz __ on Unsplash
    console.log("Hill's dog1 created");

    await uploadDogPhoto(user5dog1, 'public/img/dog/demo/dog3/dogPhoto1.jpg');
    await uploadDogPhoto(user5dog1, 'public/img/dog/demo/dog3/dogPhoto2.jpg');
    console.log("Hill's dog1 photos added");

    userId5dog2 = await dogData.addDog(
        "O",
        "Male",
        "2018-09-19",
        "Husky",
        userId5
    );
    user5dog2 = userId5dog2._id.toString();
    await uploadDogAvatar(user5dog2, 'public/img/dog/demo/user5/dog2.jpg');
    //Photo by Ilya Shishikhin on Unsplash
    console.log("Hill's dog2 created");

    await uploadDogPhoto(user5dog2, 'public/img/dog/demo/dog2/dogPhoto1.jpg');
    await uploadDogPhoto(user5dog2, 'public/img/dog/demo/dog2/dogPhoto2.jpg');
    console.log("Hill's dog2 photos added");

    userId5dog3 = await dogData.addDog(
        "X",
        "Female",
        "2018-07-19",
        "Husky",
        userId5
    );
    user5dog3 = userId5dog3._id.toString();
    await uploadDogAvatar(user5dog3, 'public/img/dog/demo/user5/dog3.jpg');
    //Photo by Julian Dutton on Unsplash
    console.log("Hill's dog3 created");

    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto1.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto2.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto3.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto4.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto5.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto6.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto7.jpg');
    await uploadDogPhoto(user5dog3, 'public/img/dog/demo/dog6/dogPhoto8.jpg');
    console.log("Hill's dog3 photos added");

    
    
    for (let i = 0; i < 3; i++) {
        let heightWeight = {height: i + 1, weight: i + 30, date: "2019-10-21"}
        dog = await dogData.addHeightWeight(user1dog1, heightWeight)};
    for (let i = 0; i < 3; i++) {
        let heightWeight = {height: i + 3, weight: i + 20, date: "2019-1-21"}
        dog = await dogData.addHeightWeight(user1dog1, heightWeight)};
    for (let i = 20; i < 3; i++) {
        let heightWeight = {height: i + 3, weight: i + 12, date: "2019-12-9"}
        dog = await dogData.addHeightWeight(user1dog1, heightWeight)};
    console.log("UserId1dog1 hw created")

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: (3 * i) + 20}
        dog = await dogData.addHeightWeight(user1dog2, heightWeight)};
    console.log("UserId1dog2 hw created")

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: i + 2}
        dog = await dogData.addHeightWeight(user2dog1, heightWeight)};
    console.log("UserId2dog1 hw created")

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: i + 40}
        dog = await dogData.addHeightWeight(user2dog2, heightWeight)};
    console.log("UserId2dog2 hw created")

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: (3 * i) + 20}
        dog = await dogData.addHeightWeight(user2dog3, heightWeight)};
    console.log("UserId2dog3 hw created")

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: (3 * i) + 20}
        dog = await dogData.addHeightWeight(user3dog1, heightWeight)};
    console.log("UserId3dog1 hw created")
    
    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: i + 2}
        dog = await dogData.addHeightWeight(user5dog1, heightWeight)};
    console.log("UserId5dog1 hw created")
    
    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: i + 40}
        dog = await dogData.addHeightWeight(user5dog2, heightWeight)};
    console.log("UserId5dog2 hw created")

    for (let i = 0; i < 20; i++) {
        let heightWeight = {height: i + 1, weight: (3 * i) + 20}
        dog = await dogData.addHeightWeight(user5dog3, heightWeight)};
    console.log("UserId5dog3 hw created")

    // =================================
    //  Create some height and weight

    // let dogId = dog._id.toString()

    // for (let i = 0; i < 20; i++) {
    //     let heightWeight = {height: i + 1, weight: i + 2}
    //     dog = await dogData.addHeightWeight(dogId, heightWeight);
    // }
    // console.log("heightWeight created");

   
     // =================================
    //  Create some comments

    // For user1's dog 2dogs
    for (let i = 0; i < 8; i++) {
        comment = await commentsData.addComment("You are so lovely", userId2, user1dog1);
        // console.log(newComment);
    }

    for (let i = 0; i < 20; i++) {
        comment = await commentsData.addComment("What a cute dog!", userId3, user1dog2);
        // console.log(newComment);
    }

    // For user2's dog 3dogs

    for (let i = 0; i < 20; i++) {
        comment = await commentsData.addComment("You are so lovely", userId1, user2dog1);
        // console.log(newComment);
    }

    for (let i = 0; i < 15; i++) {
        comment = await commentsData.addComment("You are so lovely", userId2, user2dog2);
        // console.log(newComment);
    }

    for (let i = 0; i < 10; i++) {
        comment = await commentsData.addComment("How cute!", userId5, user2dog3);
        // console.log(newComment);
    }

    for (let i = 0; i < 10; i++) {
        comment = await commentsData.addComment("You are so lovely", userId5, user2dog1);
        // console.log(newComment);
    }

    for (let i = 0; i < 10; i++) {
        comment = await commentsData.addComment("It’s adorable.", userId3, user5dog3);
        // console.log(newComment);
    }

    for (let i = 0; i < 12; i++) {
        comment = await commentsData.addComment("How cute! ", userId2, user5dog1);
        // console.log(newComment);
    }

    for (let i = 0; i < 12; i++) {
        comment = await commentsData.addComment("How cute! ", userId2, user3dog1);
        // console.log(newComment);
    }

    for (let i = 0; i < 12; i++) {
        comment = await commentsData.addComment("How cute! ", userId3, user4dog1);
        // console.log(newComment);
    }

    for (let i = 0; i < 5; i++) {
        comment = await commentsData.addComment("How cute! ", userId1, user4dog2);
        // console.log(newComment);
    }
    // console.log(await commentsData.getComment(comment._id.toString()));
    // console.log(await commentsData.deleteCommentsByDog(dogId));
    
    console.log("comment created");

    // let output = await commentsData.getComments(newComment._id.toString());
    // console.log(output);
    await db.serverConfig.close();
}

main().catch(console.log);
