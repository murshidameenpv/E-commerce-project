
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');// to avoid session id conflict
const crypto = require('crypto');



// Generate a random session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');
// Use the session secret in your application




const sessionMiddleware = session({
  genid: () => uuidv4(),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
});


module.exports = sessionMiddleware;
