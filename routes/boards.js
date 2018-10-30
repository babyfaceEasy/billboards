//routes file

const express = require('express')
const router = express.Router()
const paginate = require('express-paginate')
const path = require('path')
const multer = require('multer')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const ac = require('../accesscontrol')
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

router.get('/test', function(req, res){
    res.send('testing board routes')
})

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

router.get('/', async function(req, res){
    //list of all boards
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
    const token = (req.headers['authorization']).split(' ')[1]
    console.log(token)
    if (!token) {
        return res.status(401).json({auth: false, message: 'No token provided!'})
    }
    //verify the token
    let  decodedToken = null
    try{
        decodedToken = jwt.verify(token, 'b@byf2cezzz');
        //console.log(`Role:  ${decodedToken.role}`)
    }catch(err){
        //invalid log
        return res.status(401).json({auth: false, message: 'Invalid Token'})
    }

    //this is to check if they can create a board
    const permission = ac.can(decodedToken.role).createOwn('board')
    //console.log(permission.granted)
    //console.log(permission.attributes)

    //create a new board
    let board = {
        name: req.body.name,
        typeId: req.body.typeId,
        location: req.body.location,
        img_url: req.file.path
    }

    //this is to effect the geo-coding activities to save lat, lng
    googleMapsClient.geocode({
        'address': board.location
    }, function(err, response){
        if (!err) {
            //nb: results returns an array so u need to pick the first one to work well
            //check to see if status is = 'OK'
            let results = response.json.results
            //console.log(response.json.status)
            //console.log(`Latitude: ${results[0].geometry.location.lat}`)

            //this doesn't get set bcos of call back variable scope probs
            //read this link to solve the probs
            //https://www.pluralsight.com/guides/javascript-callbacks-variable-scope-problem
            board.longitude = results[0].geometry.location.lng
            board.latitude = results[0].geometry.location.lat
            //console.log(response.json.results)
        }else{
            console.log(`Error using the gecode to get data: ${err}`)
        }
    })

    //process.exit(0)

    console.log(`Board value now is ${board.longitude}`)

    Board.create(board)
    .then((board) => {
        return res.json(board)
    })
    .catch(err => {
        return res.status(400).json({err: `Error in creating new board bcos: ${err}`})
    })
})

router.get('/:boardId', function(req, res){
    
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

router.put('/:boardId', function(req, res){
    //update parameters
    let board = {
        name: req.body.name,
        typeId: req.body.typeId,
        location: req.body.location
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
})

router.delete('/:boardId', function(req, res){
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