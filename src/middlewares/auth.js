const { AccessToken, User, Admin } = require('../models/');

module.exports = (req, res, next) => {
  let token;
  if (req.get('X-Access-Token')) {
    token = req.get('X-Access-Token');
  }
  if (token) {
    req.token = token;
    AccessToken.findOne({ token })
      .then((accessToken) => {
        if (accessToken) {
          return User.findOne({ _id: accessToken.userId }).select('-password')
            .then(user => (req.user = user));
        }
        return null;
      })
      .then(() => next());
  } else {
    next();
  }
};
