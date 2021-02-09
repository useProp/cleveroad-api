const passport = require('passport');
const jwt = require('passport-jwt');
const sequelize = require('./db');

const User = sequelize.models.User;
const params = {
  secretOrKey: process.env.JWT_SECRET,
  jwtFromRequest: jwt.ExtractJwt.fromHeader('authorization')
};
const strategy = new jwt.Strategy(params, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.id, {attributes: ['id']});

    if (!user) {
      return done(null, false);
    }

    return done(null, {id: user.id});
  } catch (e) {
    done(e);
  }
});

passport.use(strategy);

module.exports = {
  initialize: () => passport.initialize(),
  authenticate: () => passport.authenticate("jwt", {session: false})
};
