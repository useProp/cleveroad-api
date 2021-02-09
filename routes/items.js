const router = require('express').Router();
const {authenticate} = require('../libs/auth');
const sequelize = require('../libs/db');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const Product = sequelize.models.Product;
const User = sequelize.models.User;

const findProductByPK = async (key, extra = []) => {
  const result = await Product.findByPk(key, {
    attributes: ['id', 'title', 'price', 'created_at', 'user_id'].concat(extra),
    include: {
      model: User,
      attributes: ['id', 'phone', 'email'],
    }
  })

  return result;
}

const checkParamType = (req, res, next) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || typeof id !== 'number') {
    return res.sendStatus(403);
  }
  next();
}

const handleErrorMessage = (e) => {
  if (e?.errors?.length > 0) {
    return e.errors[0].message;
  }

  if (e?.message) {
    return e.message;
  }

  return e;
};

router.use(authenticate());

router.post('/', async (req, res) => {
  try {
    const {title, price} = req.body;
    const user_id = req.user.id;
    const product = await Product.create({title, price, user_id});
    const response = await findProductByPK(product.id);
    res.json(response);
  } catch (e) {
    res.status(422).json({error: handleErrorMessage(e)});
  }
});

router.delete('/:id', checkParamType, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.sendStatus(404);
    }
    await product.destroy();
    res.end();
  } catch (e) {
    res.status(403).json({error: handleErrorMessage(e)});
  }
});

router.put('/:id', checkParamType, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.sendStatus(404);
    }
    const {title = product.title, price = product.price} = req.body;
    await product.update({title, price});
    const response = await findProductByPK(product.id);
    res.json(response);
  } catch (e) {
    res.status(422).json({error: handleErrorMessage(e)});
  }
});

router.get('/:id', checkParamType, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.sendStatus(404);
    }
    const response = await findProductByPK(product.id);
    res.json(response);
  } catch (e) {
    res.status(422).json({error: handleErrorMessage(e)});
  }
});

router.get('/', async (req, res) => {
  try {
    const response = await Product.findAll({
      attributes: ['id', 'title', 'price', 'created_at', 'user_id'],
      include: {
        model: User,
        attributes: ['id', 'phone', 'email'],
      }
    })
    res.json(response);
  } catch (e) {
    res.status(422).json({error: handleErrorMessage(e)});
  }
});

router.post('/:id/images', checkParamType, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.sendStatus(404);
    }

    if (!req.headers['content-type'].includes('multipart/form-data')) {
      return res.sendStatus(403);
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(422).json({error: 'No files to upload'});
    }

    const file = req.files.file;
    const savePath = path.join('public', 'images', `${uuidv4()}-${file.name}`);
    file.mv(savePath, async (err) => {
      if (err) {
       return res.sendStatus(500);
      }
      product.image = path.join('http://localhost:3000/', savePath);
      await product.save();
      const response = await findProductByPK(product.id, ['image']);
      res.json(response);
    });

  } catch (e) {
    res.status(422).json({error: handleErrorMessage(e)});
  }
});

module.exports = router;
