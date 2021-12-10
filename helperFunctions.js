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
  const urlsByUser = {};
  for (shortURL in database) {
    if (database[shortURL]['userID'] === id) {
      urlsByUser[shortURL] = {
        longURL: database[shortURL]['longURL'],
        userID: database[shortURL]['userID'],
      }
    }
  }
  return urlsByUser;
};






module.exports = { generateRandomString, checkEmail, userUrls };