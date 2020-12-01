let sessionConfig = {
  name: 'AuthCookie',
  secret: 'cs545HCI',
  resave: false,
  saveUninitialized: true
}

const petType = ["Cat", "Dog", "Bird", "Fish", "Plant", "Other"];

const loginRequired = (req, res, next) => {
  if (!req.session.userid) {
    res.redirect('/login');
    return;
  }
  next();
}

const loginRequiredJson = (req, res, next) => {
  if (!req.session.userid) {
    res.json({redirect: '/login'});
    return;
  }
  next();
}

const notLoginRequired = (req, res, next) => {
  if (req.session.userid) {
    res.redirect('/user');
    return;
  }
  next();
}

module.exports = {
  sessionConfig,
  petType,
  loginRequired,
  loginRequiredJson,
  notLoginRequired,
}