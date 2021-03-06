module.exports = function() {
  var passport = require('passport');
  var bcryptjs = require('bcryptjs');
  var passportLocal = require('passport-local');
  var userService = require('../services/user-service');
  
  passport.use(new passportLocal.Strategy({usernameField: 'email'}, function(email, password, next) {
    userService.findUser(email, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, null);
      }
      bcryptjs.compare(password, user.password, function (err, same) {
        if (err) {
          return next(err);
        }
        if (!same) {
          return next(null, null);
        }
        next(null, user);
      })
      
    });
  }));
  
  passport.serializeUser(function(user, next) {
    next(null, user.email);
  });
  
  passport.deserializeUser(function(email, next) {
    userService.findUser(email, function(err, user) {
      next(err, user);
    });
  });
};