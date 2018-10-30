//BASE SETUP
//==================================================
var express = require('express')
var app = express()
var port = process.env.PORT || 8080


//LOGGING
//=================================================
const morgan = require('morgan')
app.use(morgan('dev'))

//MODELS
//==================================================
var db = require('./models')

//AUTHENTICATION
//==================================================
const passport = require('passport');
require('./passport')

//ACCESSCONTROL SETUP
//==================================================
const accesscontrol = require('./accesscontrol')

//MIDDLEWARES
//=================================================
//this is for parsing documents and files
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
const paginate = require('express-paginate')
app.use(paginate.middleware(10, 50));

//this is for the paginate function
app.all(function(req, res, next){
    //set the default ot the minimum is 10
    if (req.query.limit <= 10) req.query.limit = 10
})

//ROUTES 
//========================================
const boardTypesRoutes = require('./routes/board_types')
const userRoutes = require('./routes/users')
const boardRoutes = require('./routes/boards')
const authRoutes = require('./routes/auth')
const registerRoutes = require('./routes/register')
app.use('/types', passport.authenticate('jwt', {session: false}),  boardTypesRoutes)
app.use('/user', passport.authenticate('jwt', {session:false}),  userRoutes )
app.use('/board', boardRoutes)
app.use('/auth', authRoutes)
app.use('/register', registerRoutes)


//START SERVER
//================================
app.listen(port)
console.log("App running on port ", port)

//run sync, checks to seee if we need to create the db and den connect the server
/*
db.sequelize.sync({force: true}).then(function(){
    app.listen(port, function(){
        console.log("App running on port ", port)
    })
})
*/

