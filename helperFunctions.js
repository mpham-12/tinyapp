const generateRandomString = function() {
  let random = Math.random().toString(36).slice(2, 8);
  return random;
};






module.exports = { generateRandomString, }