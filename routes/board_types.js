var express = require('express')
var router = express.Router()
const {Type} = require('../sequelize')
const ac = require('../accesscontrol')
const msg = require('../messages')
const middlewares = require('../middlewares')
const errMsg = msg.error
const sucMsg = msg.success

router.all('*', middlewares.verifyJWTToken)

router.post('/', function(req, res){

    //this is to check if the current user role is allowed to perform this action
    const permission = ac.can(req.user.role).createAny('board_type')
    const ownPermission = ac.can(req.user.role).createOwn('board_type')
    
    if (!permission.granted && !ownPermission.granted) {
        return res.status(403).json({'messsage': errMsg.action_not_allowed})
    }
    
    let ret = {'name': req.body.name}
    Type.create({name: ret.name})
        .then(type => {
            //here the save was successfully and `type` is the new data
            res.json(type)
        })
        .catch(err => {
            console.log(`Error in creaing new board type due to ${err}`)
            res.status(400).json({err: `Error in creaing new board type due to ${err}`})
        })
})


router.get('/', function(req, res){

    const permission = ac.can(req.user.role).readAny('board_type')
    const ownPermission = ac.can(req.user.role).readOwn('board_type')

    if(!permission.granted && !ownPermission.granted){
        res.status(403).json({'message': errMsg.action_not_allowed})
    }
    Type.findAll().then(board_types => {
        res.json({data: board_types})
    })
})

router.get('/:typeId', function(req, res){

    const permission = ac.can(req.user.role).readAny('board_type')
    const ownPermission = ac.can(req.user.role).readOwn('board_type')

    if (!permission.granted && !ownPermission.granted) {
        res.status(403).json({message: errMsg.action_not_allowed})
    }
    
    Type.findById(req.params.typeId)
        .then(board_type => res.json(board_type))
        .catch(err => res.status(400).json({err: `Error in viewing board type details with id: ${typeId}, bcus ${err}`}))
})

router.put('/:typeId', function(req, res){
    const permission = ac.can(req.user.role).updateAny('board_type')
    const ownPermission = ac.can(req.user.role).updateOwn('board_type')

    if(!permission.granted && !ownPermission.granted){
        res.status(403).json({'message': errMsg.action_not_allowed})
    }

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
    const permission = ac.can(req.user.role).readAny('board_type')
    const ownPermission = ac.can(req.user.role).readOwn('board_type')

    if(!permission.granted && !ownPermission.granted){
        return res.status(403).json({'message': errMsg.action_not_allowed})
    }
    Type.destroy({where: {id: req.params.typeId}})
        .then((affectedRows) => {
            res.json(affectedRows)
        })
        .catch(err => {
            res.status(400).json({err: `Error while deleting board type id: ${req.params.typeId}`})
        })
})

module.exports = router