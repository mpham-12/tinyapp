//App config
const express = require('express');
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
// Functions
const { generateRandomString, checkEmail } = require('./helperFunctions');

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/urls', (req, res) => {
  const userId = req.session['user_id'];
  console.log(userId);
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.session.user_id;
  const templateVars = { user: users[userId] };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL]
  const userId = req.session.user_id;
  const templateVars = { shortURL: shortURL, longURL: longURL, user: users[userId] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  urlDatabase[shortString] = req.body.longURL;
  res.redirect(`/urls/${shortString}`);
});

app.get("/register", (req, res) => {
  const userId = req.session.user_id;
  res.render('registration', { user: users[userId] });
  console.log(userId);
})

app.get("/login", (req, res) => {
  const userId = req.session.user_id;
  res.render('login', { user: users[userId] })

})

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

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  if (!password || !email) {
    res.status(403).send('Enter a valid email or password');
    return;
  }
  if (checkEmail(email, users)) {
    res.status(403).send('Sorry, the email has already been taken.');
    return;
  } 
  users[id] = {
    id,
    email,
    password
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
    if (user.email === email && user.password === password) {
      req.session.user_id = user.id;
      res.redirect('/urls');
      return
    }
    res.status(403).send('Inccorect email/password. Please try again.')
  }
})

app.post("/logout", (req, res) => {
  req.session.user_id = null;
  res.redirect('/urls');
})

//temp:
app.get('/users.json', (req, res) => {
  res.json(users);
})





// Allows server to retrieve or "listen" to requests.
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`)
});