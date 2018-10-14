module.exports = (sequelize, type) => {
    return sequelize.define('boards', {
        //fields
        name : { type: type.STRING, allowNull:false, validate: { len: [1, 200]} },
        location: { type: type.TEXT('tiny'), allowNull: false },
        latitude: { type: type.INTEGER, allowNull: true, defaultValue:null, validate: { min: -90, max: 90}},
        longitude: { type: type.INTEGER, allowNull: true, defaultValue: null, validate: { min:-180, max: 180}},
        img_url: { type: type.STRING, allowNull:true, defaultValue:null, validate: { len: [1, 200]}}
    })
}