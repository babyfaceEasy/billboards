module.exports = (sequelize, type) => {
    return sequelize.define('boards', {
        //fields
        name : { type: type.STRING, allowNull:false, validate: { len: [1, 200]} },
        location: { type: type.TEXT('tiny'), allowNull: false },
        latitude: { type: type.FLOAT, allowNull: true, defaultValue:null, validate: { min: -90, max: 90}},
        longitude: { type: type.FLOAT, allowNull: true, defaultValue: null, validate: { min:-180, max: 180}},
        altitude: {type: type.FLOAT, allowNull:true, defaultValue:null},
        altitude_accuracy: {type: type.FLOAT, allowNull:true, defaultValue:null},
        rate: {type: type.FLOAT, allowNull:false, defaultValue: 0.00},// same as price
        reach: {type: type.INTEGER, allowNull:false, defaultValue:0}, 
        vacant: {type: type.BOOLEAN, allowNull:false, defaultValue:false},
        img_url: { type: type.STRING, allowNull:true, defaultValue:null, validate: { len: [1, 200]}}
    })
}