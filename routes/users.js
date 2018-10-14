const express = require('express')
const router = express.Router()
const {User} = require('../sequelize')
const bcrypt = require('bcrypt')
const saltRounds = 10

//test url
router.get('/test-user', function(req, res){
    res.json('we are on user test routes page')
})

//create a new user(register)
router.post('/', function(req, res){
    //create user object from body
    let user = {
        email: req.body.email,
        password: req.body.password,
        first_name : req.body.firstName,
        last_name: req.body.lastName,
        gender: req.body.gender,
        phone_num: req.body.phone_num
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

//gets user profile details
router.get('/:userId', function(req, res){
    
    User.findOne({
        where: {id: req.params.userId },
        attributes: ['first_name', 'last_name', 'phone_num', 'gender', 'email']
    })
    .then( user => {
        res.json(user)
    })
    .catch(err => {
        //log error
        res.status(404).json({err: `User with id: ${req.params.userId} not found.`})
    })
})

//update user details
router.put('/:userId', function(req, res){
    //get the object
    let user = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        phone_num: req.body.phone_num,
        gender: req.body.gender
    }
    User.update(
        user,
        {where: { id: req.params.userId }}
    ).then( rowsAffected => {
        return res.json(rowsAffected)
    })
    .catch( err => {
        //log err
        res.status(404).json({err: `Error in updating User with id: ${req.params.userId} details.`})
    })
})

//delete user details
router.delete('/:userId', function (req, res){
    User.destroy({
        where: {id: req.params.userId }
    })
    .then( result => {
        //returns 0 always
        res.json(result)
    })
    .catch( err => {
        //log the error
        res.status(400).json({err: `Error in deleteing user with id: ${req.params.userId}`})
    })
})

module.exports = router