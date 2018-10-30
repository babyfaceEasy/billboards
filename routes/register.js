const express = require('express')
const router = express.Router()
const {User} = require('../sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 10

/*
This registers a new user and the role are set based on the url
Registered User : http://localhost:8080/register/
Board Owner user : http://localhost:8080/register/board_owner
Super Admin User : http://localhost:8080/register/super_admin
*/
router.post('/:role?', function(req, res) {
    //create user object from body
    let role = null
    let user = {
        email: req.body.email,
        password: req.body.password,
        first_name : req.body.firstName,
        last_name: req.body.lastName,
        gender: req.body.gender,
        phone_num: req.body.phone_num
    }

    //if role is null then its a registered user
    role = req.params.role;

    if (role == null){
        user.role = 'registered_user'
    } else{
        user.role =  role
    }
    bcrypt.hash(user.password, saltRounds).then(function(hash) {
        //assign hash to user object
        user.password = hash
        //save into the db
        User.create(user)
        .then( (ret) => {
            //create returns the new user all details
            res.json(ret)
        })
        .catch ( (err) =>  {
            res.status(400).json({err: `An error occured while creating a new user cos ${err}`})
        })
    })
})

module.exports = router