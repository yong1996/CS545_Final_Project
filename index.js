const express = require('express');
const exphbs = require('express-handlebars');
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');
const app = express();

app.set('views', __dirname + '/views')
app.use(express.json());
app.use('/public', static);
app.use(express.urlencoded({extended: true}));

configRoutes(app);
app.engine('handlebars', exphbs({defaultLayout: 'main', helpers: require('./config/handlebars-helpers')}));
app.set('view engine', 'handlebars');

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});