/*module.exports = function(sequelize, DataTypes){

    var type = sequelize.define("types", {
        //fields
        name : {
            //properties of column
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate:{
                len: [1, 200]
            }
        }
    })
    return type
}
*/

module.exports = (sequelize, type) => {
    return sequelize.define('types', {
        //fields
        name: {
            //properties of the column
            type: type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [1, 200]
            }
        }
    })
}