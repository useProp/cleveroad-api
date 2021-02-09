const router = require('express').Router();
const {authenticate} = require('../libs/auth');
const sequelize = require('../libs/db');

router.use(authenticate())

router.get('/', async (req, res) => {
  try {
    const User = sequelize.models.User;
    const user = await User.findOne({where: {id: req.user.id}, attributes: ['id', 'name', 'phone']});
    res.json(user);
  } catch (e) {
    res.sendStatus(401);
  }
});

module.exports = router;
