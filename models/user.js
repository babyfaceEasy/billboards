module.exports = (sequelize, type) => {
    return sequelize.define('users', {
        //username
        email: {
            type: type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        //password
        password: {
            type: type.STRING,
            allowNull: false,
        },
        //first_name
        first_name: {
            type: type.STRING(100),
            allowNull:false
        },

        //last_name
        last_name:{
            type: type.STRING(100)
        },
        //gender
        gender: {
            //0 => male 1 => female
            type: type.INTEGER(1),
            validate: {
                isInt: true
            }
        },
        //phone_num
        phone_num:{
            type: type.STRING(100),
            allowNull:false
        }
    })//end of return
}//end of export