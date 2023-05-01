const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2118422","root","password",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.vjezba = require('./modeli/vjezba.js')(sequelize);
db.zadatak = require('./modeli/zadatak.js')(sequelize);
db.student = require('./modeli/student.js')(sequelize);
db.grupa = require('./modeli/grupa.js')(sequelize);

//relacije
// Veza 1-n vise zadataka se moze nalaziti u vjezbi
db.vjezba.hasMany(db.zadatak,{as:'zadaciVjezbe'});

db.grupa.hasMany(db.student,{as:'studentiGrupe'});

module.exports=db;