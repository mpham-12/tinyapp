const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

// tells Express app to use EJS as template engine
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// express.get takes in 2 parameters (request, response). 
// When client is connected to /, they recieve "hello" on their end.
app.get('/', (req, res) => {
  res.send('hello!');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Incorporates JS and HTML. Responds with bolded text when client requests /hello. 
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// When client requests for /urls, server responds with templateVars.
// .render takes 2 params (file/path, variable).
// urls_index.ejs is a template file.
app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Request for '/urls/:shortURL'=> :shortURL can be replaced with any link since its a parameter. 
app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

function generateRandomString() {

}


// Allows server to retrieve or "listen" to requests.
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`)
});