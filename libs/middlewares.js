const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const {initialize} = require('./auth');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const compression = require('compression');

module.exports = app => {
  app.set('json spaces', 2);

  app.use(cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

  app.use(helmet());

  app.use(bodyParser.json());

  app.use(bodyParser.urlencoded({extended: true}));

  app.use(initialize());

  app.use(compression());

  app.use(morgan('dev'));

  app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  }));

  app.use((req, res, next) => {
    delete req.body.id;
    next();
  });
};
