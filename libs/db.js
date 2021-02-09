const { Sequelize } = require('sequelize');
const {setRelations} = require('./dbExtraSetup');

const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    logQueryParameters: process.env.DB_LOGS,
    benchmark: process.env.DB_LOGS,
    define: {
      underscored: true,
    }
  }
);

const modelDefiners = [
  require('../models/User'),
  require('../models/Product'),
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

const dbInit = async () => {
  setRelations(sequelize);
  await sequelize.sync();
}

dbInit();

module.exports = sequelize;
