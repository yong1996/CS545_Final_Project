const session = require("express-session")
const middleware = require("./middleware");
const questionRoutes = require("./question");
const questionData = require("../data/questions");
const userRoutes = require("./user");
const accountRoutes = require("./account");

const constructorMethod = (app) => {
  
  app.use(session(middleware.sessionConfig));
  
  app.use("/question", questionRoutes);
  app.use("/user", userRoutes);
  app.use(accountRoutes);

  app.get('/', async (req, res) => {
    try {
        let popularQuestions = await questionData.getPopularQuestions();
      data = {
        title: "Home",
        username : req.session.username,
        popularQuestions: popularQuestions
      };
      res.render('home', data);
    } catch (e) {
      res.status(500);
      res.render('error', {title: 500, errorCode: 500, username: req.session.username});
    }
  });
  
  app.use('*', function(req, res) {
    res.status(404);
    res.render('error', {title: "Not Found", errorCode: 404, username: req.session.username});
  });
};

module.exports = constructorMethod;
