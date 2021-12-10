const { assert } = require('chai');

const { checkEmail, userUrls } = require('../helperFunctions.js');

// TEST FOR checkEmail()
const testUsers = {
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
};

describe('#checkEmail', () => {
  it('should return a user with valid email', () => {
    const user = checkEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    assert(user, expectedUserID);
  });
  it('should return undefined if a non-existent email is entered', () => {
    const user = checkEmail("user@example.com", testUsers);
    const expectedUserID = "nonexistent";
    assert(user, expectedUserID);
  });
});

// TEST FOR userUrls()
const testUrls = {
  'sdadd': {
    longURL: 'http://www.tsn.com',
    userID: 'fgfgf'
  },
  'sdaddq': {
    longURL: 'http://www.aircanada.com',
    userID: 'fgfgf'
  },
  'xsdsd': {
    longURL: 'http://www.nba.com',
    userID: 'ytyty'
  },
  'yutyu': {
    longURL: 'http://www.YERRRRRR.com',
    userID: 'cvcvc'
  }
};

describe('#userUrls', () => {
  it('should return a url specific to the user', () => {
    const userURLS = userUrls('fgfgf', testUrls);
    const expectedResult = {
      'sdadd': {
        longURL: 'http://www.tsn.com',
        userID: 'fgfgf'
      },
      'sdaddq': {
        longURL: 'http://www.aircanada.com',
        userID: 'fgfgf'
      }
    };

    assert.deepEqual(userURLS, expectedResult);
  });
  it('should return an empty object for a non-existent user', () => {
    const userURLS = userUrls('qwqwq', testUrls);
    assert.deepEqual(userURLS, {});
  });
});
