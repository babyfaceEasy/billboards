const config = require('./config.js')
const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const Op = Sequelize.Op
const sequelize = new Sequelize(
    config.db.database, 
    config.db.user, 
    config.db.password, {
    host: 'localhost',
    dialect: 'mysql',
    freezeTableName: true,
    operatorAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

//this is to test
sequelize
.authenticate()
.then( () => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database: ', err);
})

const Type = sequelize.define('types', {
    name: {
        type: Sequelize.STRING
    }
})

sequelize.sync({force: true})