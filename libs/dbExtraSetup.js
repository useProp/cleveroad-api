const setRelations = sequelize => {
  const {User, Product} = sequelize.models;

  User.hasMany(Product);
  Product.belongsTo(User);
}

module.exports = {setRelations};
