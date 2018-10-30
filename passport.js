const passport = require('passport')
const passportJWT = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const {User} = require('./sequelize')
const ExtractJWT = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
function(email, password, cb){
    //load user first
    return User.find({
        where: {email: email}
    })
    .then((user) => {
        console.log(`KUNLE IS CONFIRMING: ${user.email}. PLS WORK`)
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return cb(null, false, {message: 'Incorrect email and password credentials'})
        }
        return cb(null, user, {message: 'Logged In'})
    })
    .catch((err) => {
        return cb(err)
    })
}))

passport.use(new JWTStrategy({
        jwtFromRequest:ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'b@byf2cezzz'
    },
    function(jwtPayload, cb){
        User.find({
            where:{id: jwtPayload.id}
        })
        .then ((user) => {
            return cb(null, user)
        })
        .catch((err) => {
            return cb(err)
        })
        
    }
))