const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')

/* POST login */

router.post('/login', function(req, res, next){
    //validate here 
    if (!req.body.email || !req.body.password) {
        res.status(401).json({"message": "Please the email and passowrd fields are required"})
    }
    passport.authenticate('local', {session: false}, (err, user, info) => {
        //console.log({name: 'kunle', user_val: user.gender, err: err})
        
        if (err || !user){
            console.error(err)
            return res.status(400).json({
                message: 'something is not right',
                user: user
            });
        }
        req.login(user, {session:false}, (err) => {
            if(err){
                res.send(err);
            }

            //generate a signed web token
            const token = jwt.sign({email: user.email, id: user.id, role: user.role}, 'b@byf2cezzz', { expiresIn: '1h'})
            return res.json({user, token})
        })
    })(req, res)
})
module.exports = router