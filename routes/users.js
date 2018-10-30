const express = require('express')
const router = express.Router()
const {User} = require('../sequelize')
const ac = require('../accesscontrol')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const middlewares = require('../middlewares')

//test url
/*
router.get('/test-user', function(req, res){
    res.json('we are on user test routes page')
})
*/

//set the block here
router.all('*', middlewares.verifyJWTToken)

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