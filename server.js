const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
/* beautify preserve:start */
var { Book } = require('./models/Book');
var { ObjectID } = require('mongodb');
//const { User } = require('./models/User');
/* beautify preserve:end */

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/BookList', {
	useNewUrlParser: true
});

const app = express();
const PORT = process.env.PORT || 3000;

const router = require('./controllers/api-routes');
const exphbs = require("express-handlebars");
app.set("view engine", "handlebars");
app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.text());
app.use("/", router);
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));

module.exports = {
	app
};