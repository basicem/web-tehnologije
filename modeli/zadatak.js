const Sequelize = require("sequelize");

module.exports = function(sequelize,DataTypes){
    const Zadatak = sequelize.define("zadatak",{
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        naziv:Sequelize.STRING
    })
    return Zadatak;
};