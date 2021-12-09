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
  for (const shortURL in database) {
    if (database[shortURL].user_id === id) {
      userUrls[shortURL] = database[shortURL]
    }
  }
  return urlsByUser;
};



module.exports = { generateRandomString, checkEmail, userUrls };