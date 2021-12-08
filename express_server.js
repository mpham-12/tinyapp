const express = require('express');
const app = express();
const PORT = 8080;

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// tells Express app to use EJS as template engine
app.set('view engine', 'ejs');

//Middleware
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// random string generator (6 characters)
const generateRandomString = function() {
  let random = Math.random().toString(36).slice(2, 8);
  return random;
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
  const shortURL = req.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: urlDatabase[shortURL] };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  urlDatabase[shortString] = req.body.longURL;
  res.redirect(`/urls/${shortString}`);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
}
);



app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect('/urls');
})

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longUrl;
  res.redirect('/urls');
})

app.post("/login", (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
})

// Allows server to retrieve or "listen" to requests.
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`)
});