var express = require('express')
var router = express.Router()
const {Type} = require('../sequelize')
//test url

router.get('/test', function(req, res){
    res.send('This is to test that board_types file is live.')
})

router.post('/', function(req, res){
    var ret = {'name': req.body.name}

    //console.log(Type)

    Type.create({name: ret.name})
        .then(type => {
            //here the save was successfully and `type` is the new data
            res.json(type)
        })
        .catch(err => {
            console.log(`Error in creaing new board type due to ${err}`)
            res.status(400).json({err: `Error in creaing new board type due to ${err}`})

        })
    //save inside db
    //res.send('The board name is ' + ret.name)
})

router.get('/', function(req, res){
    Type.findAll().then(board_types => {
        res.json({data: board_types})
    })
})

router.get('/:typeId', function(req, res){
    //console.log(req.params.typeId)
    
    Type.findById(req.params.typeId)
        .then(board_type => res.json(board_type))
        .catch(err => res.status(400).json({err: `Error in viewing board type details with id: ${typeId}, bcus ${err}`}))
})

router.put('/:typeId', function(req, res){
    Type.update(
        {name: req.body.name},
        {returning: true, where: {id: req.params.typeId}}
    ).then((rowsUpdated) => {
        //res.redirect('/' + req.params.typeId)
        res.json(rowsUpdated) 
    })
    .catch(function(err){
        res.status(400).json({err : `Error occured while updating reason: ${err}`})
    })
    
})
router.delete('/:typeId', function(req, res){
    Type.destroy({where: {id: req.params.typeId}})
        .then((affectedRows) => {
            res.json(affectedRows)
        })
        .catch(err => {
            res.status(400).json({err: `Error while deleting board type id: ${req.params.typeId}`})
        })
})

module.exports = router