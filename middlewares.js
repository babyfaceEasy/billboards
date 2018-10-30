const jwt = require('jsonwebtoken')
const ac = require('./accesscontrol')
module.exports = {
    verifyJWTToken : function(req, res, next){
        const token = (req.headers['authorization']).split(' ')[1]

        if(!token){
            return res.status(401).json({auth: false, message: 'No token provided.'})
        }

        //verify the token
        try{
            const decodedToken =  jwt.verify(token, 'b@byf2cezzz')
            req.user = decodedToken
            //hence access would be by req.user
            //console.log(`Role:  ${req.user.role}`)
            next()
        }catch(err){
            //invalid log
            return res.status(401).json({auth:false, message: `Invalid Token`})
        }
    },

    checkPermission : function(req, res, next){
        //const permission = ac.can(req.user.role) 
    }
}