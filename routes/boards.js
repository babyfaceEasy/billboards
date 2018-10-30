//routes file

const express = require('express')
const router = express.Router()
const paginate = require('express-paginate')
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const ac = require('../accesscontrol')
const middlewares = require('../middlewares')
const msg = require('../messages')
const errMsg = msg.error
//https://github.com/googlemaps/google-maps-services-js
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyD6rg2lXehSl9JLmqiwXNeTSxW1IpQaJUU'
})
//multer setup
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function(req, file, callback){
        crypto.pseudoRandomBytes(16, function(err, raw){
            if (err) return callback(err)

            callback(null, raw.toString('hex') + path.extname(file.originalname))
        })
    }
})
//const upload = multer({dest: 'uploads/'})
const upload = multer({storage: storage})
//end of multer setup
const {Board, Type} = require('../sequelize')


//this is to get the current user
router.all('*', middlewares.verifyJWTToken)


router.post('/test-image', upload.single('image'), (req, res, next) => {
    if (!req.file) {
        console.log("No file received!")
        return res.send({success: false})
    }else{
        //console.log('file received')
        console.log(req.file)
        return res.send({success:true})
    }
})

/**
 * Returns a list of all boards.
 */
router.get('/', async function(req, res){
    //check for permission
    const permission = ac.can(req.user.role).readAny('board')
    const ownPermission = ac.can(req.user.role).readOwn('board')
    if (!permission.granted && !ownPermission.granted) {
        return res.status(403).json({'message': errMsg.ACTION_NOT_ALLOWED})
    }

    Board.findAndCountAll({limit: req.query.limit, offset: req.skip})
    .then((results) => {
        const itemCount = results.count
        const pageCount = Math.ceil(results.count / req.query.limit)
        retObj = {
            data: results.rows,
            meta: {
                pageCount, itemCount, pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
            }
        }
        return res.json(retObj)
    })
    .catch((err) => {
        return res.status(400).json({err: `Error occured while reading all boards due to ${err}`})
    })
})

router.post('/', upload.single('img_url'), function(req, res, next){
    //use this to detect file types and den use it to save data
    //only img types in the db https://github.com/sindresorhus/file-type

    //this is to check if they can create a board
    const permission = ac.can(req.user.role).createOwn('board')
    if (!permission.granted){
        return res.status(403).json({'message': errMsg.ACTION_NOT_ALLOWED})
    }

    //this is to effect the geo-coding activities to save lat, lng
    googleMapsClient.geocode({
        'address': board.location
    }, function(err, response){
        if (!err) {
            //nb: results returns an array so u need to pick the first one to work well
            let board = {
                name: req.body.name,
                typeId: req.body.typeId,
                location: req.body.location,
                img_url: req.file.path,
                rate: req.body.rate,
                reach: req.body.reach
            }

            //check to see if status is = 'OK'
            if (response.json.status == 'OK') {
                let result = response.json.results[0]
                board.longitude = result.geometry.location.lng
                board.latitude = result.geometry.location.lat
                board.geocode_json = JSON.stringify(response.json)
            }

            Board.create(board)
            .then((board) => {
                return res.json(board)
            })
            .catch(err => {
                return res.status(400).json({err: `Error in creating new board bcos: ${err}`})
            })
            //console.log(response.json.status)
            //console.log(`Latitude: ${results[0].geometry.location.lat}`)
            //this doesn't get set bcos of call back variable scope probs
            //read this link to solve the probs
            //https://www.pluralsight.com/guides/javascript-callbacks-variable-scope-problem
            //console.log(response.json.results)
        }else{
            console.log(`Error using the gecode to get data: ${err}`)
        }
    })
})

router.get('/:boardId', function(req, res){

    const permission = ac.can(req.user.role).readAny('board')
    const ownPermission = ac.can(req.user.role).readOwn('board')

    if (!permission.granted && !ownPermission.granted) {
        return res.status(403).json({'message': errMsg.ACTION_NOT_ALLOWED})
    }
    Board.findOne({
        include: [{model: Type }],
        where: {id: req.params.boardId},
        attributes: {exclude: ["typeId"]}
    })
    .then((board) => {
        if (board) {
            return res.json({data: board})
        }
        return res.json({data: `Board with the given id: ${req.params.boardId}`})
        
    })
    .catch(err => {
        return res.json({err : `Error in returning board with id: ${req.params.boardId} bcos ${err}`})
    })
})

/**
 * This is to update a board value
 */
router.put('/:boardId', function(req, res){

    const permission = ac.can(req.user.role).updateAny('board')
    const ownPermission = ac.can(req.user.role).updateOwn('board')

    if (!permission.granted && !ownPermission.granted) {
        return res.status(403).json({'message': errMsg.ACTION_NOT_ALLOWED})
    }

    //to save processing time, make sure u check to see if theres a change in the locatioin value
    //before calling google geocode code

    googleMapsClient.geocode({
        'address': board.location
    }, function(err, response){
        if (!err) {
            //nb: results returns an array so u need to pick the first one to work well
            let board = {
                name: req.body.name,
                typeId: req.body.typeId,
                location: req.body.location,
                img_url: req.file.path,
                rate: req.body.rate,
                reach: req.body.reach
            }

            //check to see if status is = 'OK'
            if (response.json.status == 'OK') {
                let result = response.json.results[0]
                board.longitude = result.geometry.location.lng
                board.latitude = result.geometry.location.lat
                board.geocode_json = JSON.stringify(response.json)
            }

            Board.findById(req.params.boardId)
            .then((boardRet) => {
                return boardRet.update(board)
            })
            .then((resp) => {
                return res.json(resp)
            })
            .catch(err => {
                return res.status(400).json({err : `Error occured while updating this board, because ${err}`})
            })
        }else{
            console.log(`Error using the gecode to get data: ${err}`)
        }
    })
})

router.delete('/:boardId', function(req, res){

    const permission = ac.can(req.user.role).deleteAny('board')
    const ownPermission = ac.can(req.user.role).deleteOwn('board')

    if (!permission.granted && !ownPermission.granted) {
        return res.status(403).json({'message': errMsg.ACTION_NOT_ALLOWED})
    }

    //delete a board 
    Board.findById(req.params.boardId)
    .then((board) => {
        return board.destroy()
    })
    .then( delResp => {
        return res.json(delResp)
    })
    .catch(err => {
        return res.json({err: `An error occurred while trying to delete board with id:  ${req.params.boardId} because ${err}`})
    })
})

module.exports = router