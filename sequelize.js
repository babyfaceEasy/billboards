const Sequelize = require('sequelize')
const TypeModel = require('./models/type')
const UserModel = require('./models/user')
const BoardModel = require('./models/boards')

const sequelize = new Sequelize('billboard_db', 'root', 'root', {
    host: '127.0.0.1',
    dialect: 'mysql',
    pool:{
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

const Type = TypeModel(sequelize, Sequelize)
const User = UserModel(sequelize, Sequelize)
const Board = BoardModel(sequelize, Sequelize)

//relationships
Board.belongsTo(Type)

sequelize.sync()
    .then(() => {
        console.log(`Database & tables ccreated!`)
    })

module.exports = {
    Type,
    User,
    Board
}