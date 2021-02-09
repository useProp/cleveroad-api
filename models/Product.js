const {DataTypes} = require("sequelize");

module.exports = sequelize => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'title is required'
        },
        customValidator: (value) => {
          if (typeof value !== 'string') {
            throw Error('title must be string');
          }

          if (value.length < 3) {
            throw Error('title must be greater then 3 characters');
          }
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'price is required'
        },
        customValidator: (value) => {
          if (typeof value !== 'number') {
            throw Error('price must be number');
          }
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER
    }
  });

  return Product;
};
