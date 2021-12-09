const generateRandomString = function() {
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




module.exports = { generateRandomString, checkEmail }