const express = require('express'); 
const app = express();
const PORT = 8080;

// tells Express app to use EJS as template engine
app.set('view engine', 'ejs'); 

const urlDatabase ={
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

// express.get takes in 2 parameters (request, response). 
// When client is connected, they recieve "hello" on their end.
app.get('/', (req, res)=> {
  res.send('hello!');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Incorporates JS and HTML. Responds with bolded text. 
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Allows server to retrieve or "listen" to requests.
app.listen(PORT, ()=> {
  console.log(`Example app listening on ${PORT}!`)
});