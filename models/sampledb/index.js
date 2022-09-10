module.exports = (db, Sequelize) => {
    const User = require("./user")(db, Sequelize)
    const Role = require("./role")(db, Sequelize)

    //table relationships
    Role.hasMany(User)
    User.belongsTo(Role)

    return { User, Role }
}

