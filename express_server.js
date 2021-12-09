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

// random string generator (6 characters)
const generateRandomString = function() {
  let random = Math.random().toString(36).slice(2, 8);
  return random;
};


// express.get takes in 2 parameters (request, response). 
// When client is connected to /, they recieve "hello" on their end.
app.get('/', (req, res) => {
  res.redirect('/urls');
});

// When client requests for /urls, server responds with templateVars.
// .render takes 2 params (file/path, variable).
// urls_index.ejs is a template file.
app.get('/urls', (req, res) => {
  const userId = req.cookies['user_id'];
  const templateVars = { urls: urlDatabase, user: users[userId] };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies['user_id'];
  const templateVars = { user: users[userId] };
  res.render("urls_new", templateVars);
});

app.get("/register", (req, res) => {
  const userId = req.cookies['user_id'];
  res.render('registration', { user: users[userId] });
})

//Request for '/urls/:shortURL'=> :shortURL can be replaced with any link since its a parameter. 
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  longURL = urlDatabase[shortURL]
  const userId = req.cookies['user_id'];
  const templateVars = { shortURL: shortURL, longURL: longURL, user: users[userId] };
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
});

app.get("/login", (req, res) => {
  const userId = req.cookies['user_id'];
  res.render('login', { user: users[userId] })
})

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  for (let userId in users) {
    const user = users[userId];

    if (user && user.password === password) {
      res.cookie('user_id', user.id);
      res.redirect('/urls');
      return
    }
  }
  res.status(400).send('Inccorect email/password. Please try again.')
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

app.post("/login", (req, res) => {
  res.redirect('/urls');
})

app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

app.post('/register', (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;

  for (let userId in users) {
    const user = users[userId];
    if (user.email === email) {
      res.status(400).send('Sorry, the email has already been taken.');
      return;
    } else if (!password || !email) {
      res.status(400).send('Enter a valid email or password')
    }
  }
  users[id] = {
    id,
    email,
    password
  };
  res.cookie('user_id', id);
  res.redirect('/urls');
})

//temp:
app.get('/users.json', (req, res) => {
  res.json(users);
})

app



// Allows server to retrieve or "listen" to requests.
app.listen(PORT, () => {
  console.log(`Example app listening on ${PORT}!`)
});