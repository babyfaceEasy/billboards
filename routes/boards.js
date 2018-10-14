//routes file

const express = require('express')
const router = express.Router()
const paginate = require('express-paginate')
const {Board, Type} = require('../sequelize')

router.get('/test', function(req, res){
    res.send('testing board routes')
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

router.post('/', function(req, res){
    //create a new board
    let board = {
        name: req.body.name,
        typeId: req.body.typeId,
        location: req.body.location
    }
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