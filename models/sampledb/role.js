module.exports = (db, Sequelize) => {
    const Role = db.define("role",
        {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: Sequelize.ENUM('user', 'admin', 'superAdmin'),
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING(50),
                allowNull: false,
            }
        }
    )
    return Role
}

