const signup = require('./signup');
const signin = require('./signin');
const items = require('./items');
const user = require('./user');

module.exports = app => {
  app.use('/api/register', signup);
  app.use('/api/login', signin);
  app.use('/api/items', items);
  app.use('/api/me', user)
};

