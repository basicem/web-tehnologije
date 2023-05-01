const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Vjezba = sequelize.define("vjezba",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        naziv:Sequelize.STRING
    })
    return Vjezba;
};