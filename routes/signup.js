const router = require('express').Router();
const sequelize = require('../libs/db');
const jwt = require('jwt-simple');

router.post('/', async (req, res, next) => {
  try {
    const {name, email, phone, password} = req.body;

    const User = sequelize.models.User;

    const user = await User.create({name, email, phone, password}, {attributes: ['id']});

    const token = jwt.encode({id: user.id}, process.env.JWT_SECRET);

    res.json({token});
  } catch(e) {
    if (e.errors[0].validatorKey === 'not_unique') {
      return res.status(422).json({error: 'email already in use'});
    }
    res.status(422).json({error: e.errors[0].message});
  }

});

module.exports = router;

