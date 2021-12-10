//App config
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
// Functions
const { generateRandomString, checkEmail, userUrls } = require('./helperFunctions');

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(cookieSession({ name: 'session', keys: ['i-love-coding'] }));

//Objects:
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }

};


//Routes
app.get('/', (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.redirect('/login')
  }
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userId = req.session.user_id;
  const templateVars = { urls: urlDatabase, user: users[userId] };
  if (!userId) {
    return res.status(400).send('Please register/log in to use TinyApp.')
  }
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const templateVars = { user: users[userId] };
  if (!userId) {
    return res.redirect('/login');
  }
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  userID = req.session.user_id;
  console.log('this is the userID', userID);
  const userURLS = userUrls(userID, urlDatabase);
  const templateVars = { urlDatabase, userURLS, shortURL, longURL: urlDatabase[shortURL].longURL, user: users[userID] };
  if (!userID) {
    return res.status(400).send('Please register/log in to use TinyApp.');
  }
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  const userId = req.session.user_id;
  if (!urlDatabase[shortURL]) {
    return res.status(400).send('Link does not exist.');
  }
  return res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  const userId = req.session.user_id;
  console.log('urldatabase', urlDatabase);
  console.log('shortstring', shortString);
  urlDatabase[shortString] = {
    longURL: req.body.longURL,
    userID: userId
  }
  console.log('urldatabase UPDATED', urlDatabase);
  console.log('req.body', req.body);
  if (!userId) {
    return res.status(400).send('Please register/log in to use TinyApp.');
  }
  res.redirect(`/urls/${shortString}`);
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;

  urlDatabase[shortURL] = {
    longURL: req.body.longURL,
    userID: userId
  }

  if (userId && userId === urlDatabase[shortURL].userID) {
    urlDatabase[shortURL].longURL = req.body.longUrl;
    return res.redirect('/urls');
  }
  res.status(400).send('Please register/log in to use TinyApp.');
});



app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  const userId = req.session.user_id;
  if (userId) {
    delete urlDatabase[shortURL];
    res.redirect('/urls');
    return;
  }
  return res.status(400).send('Please register/log in to use TinyApp.');
})

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.render('registration', { user: users[userId] });
  }
  res.redirect('/urls');
})

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  if (!userId) {
    return res.render('login', { user: users[userId] });
  }
  res.redirect('/urls');
})

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!password || !email) {
    res.status(400).send('Enter a valid email or password');
    return;
  }
  if (checkEmail(email, users)) {
    res.status(400).send('Sorry, the email has already been taken.');
    return;
  }
  users[id] = {
    id,
    email,
    password: bcrypt.hashSync(password, 10)
  };
  req.session.user_id = id;
  console.log(req.session.user_id);
  res.redirect('/urls');
})


app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = checkEmail(email, users);

  if (user) {
    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user_id = user.id;
      res.redirect('/urls');
      return
    }
    res.status(400).send('Inccorect email/password. Please try again.')
  }
})

app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect('/login');
})

//temp:
app.get('/users.json', (req, res) => {
  res.json(users);
})
app.get('/urlDatabase.json', (req, res) => {
  res.json(urlDatabase);
})





// Allows server to retrieve or "listen" to requests.
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`)
});