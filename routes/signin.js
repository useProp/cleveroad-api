const router = require('express').Router();
const sequelize = require('../libs/db');
const jwt = require('jwt-simple');

router.post('/', async (req, res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(422).json({
        error: 'Email and password is required'
      })
    }

    const User = sequelize.models.User;

    const user = await User.findOne({where: {email}});

    if (!user) {
      return res.status(422).json({
        field: 'email',
        error: 'Wrong email or password'
      })
    }

    if (!user.validatePassword(password, user.password)) {
      return res.status(422).json({
        field: 'password',
        error: 'Wrong email or password'
      })
    }

    const token = jwt.encode({id: user.id}, process.env.JWT_SECRET);

    res.json({token});
  } catch (e) {
    console.log(e)
    res.status(500).json({error: 'Server error'})
  }
})

module.exports = router;
