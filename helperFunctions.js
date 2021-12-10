const generateRandomString = () => {
  let random = Math.random().toString(36).slice(2, 8);
  return random;
};

const checkEmail = (email, database) => {
  for (let userId in database) {
    if (email === database[userId].email) {
      return database[userId];
    }
  }
  return false;
};

const userUrls = (id, database) => {
  console.log(id);
  const urlsByUser = {};
  console.log('userUrl');
  for (shortURL in database) {
    console.log('shortURL', shortURL);
    if (database[shortURL]['userID'] === id) {
      console.log('left side', database, shortURL, userID);
      urlsByUser[shortURL] = {
        longURL: database[shortURL]['longURL'],
        userID: database[shortURL]['userID'],
      }
    }
  }
  console.log(urlsByUser);
  return urlsByUser;
};




module.exports = { generateRandomString, checkEmail, userUrls };