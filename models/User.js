const {DataTypes} = require("sequelize");
const bcrypt = require('bcrypt');

module.exports = sequelize => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'name is required'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'email field must be correct email'
        },
        notNull: {
          msg: 'email is required'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'password is required'
        }
      }
    }
  }, {
    timestamps: false,
    hooks: {
      beforeCreate(user, options) {
        const hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
      }
    }
  });

  User.prototype.validatePassword = (password, hash) => bcrypt.compareSync(password, hash);

  return User;
};
