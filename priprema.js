const db = require('./db.js')

db.sequelize.sync({force:true}).then(function(){
    inicializacija().then(function(){
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();
    });
});

function inicializacija(){


    var zadaciListaPromisea = [];
    var vjezbeListaPromisea = [];
    var studentiListaPromisea =[];
    var grupeListaPromisea =[];

    return new Promise(function(resolve,reject){

    zadaciListaPromisea.push(db.zadatak.create({id: 1, naziv:'Zadatak 1'}));
    zadaciListaPromisea.push(db.zadatak.create({id: 2, naziv:'Zadatak 2'}));
    zadaciListaPromisea.push(db.zadatak.create({id: 3,naziv:'Zadatak 3'}));
    zadaciListaPromisea.push(db.zadatak.create({id: 4,naziv:'Zadatak 4'}));
    zadaciListaPromisea.push(db.zadatak.create({id: 5,naziv:'Zadatak 5'}));


    Promise.all(zadaciListaPromisea).then(function(zadaci){
        var zadatak1 = zadaci.filter(function(a){return a.naziv==='Zadatak 1'})[0];
        var zadatak2 = zadaci.filter(function(a){return a.naziv==='Zadatak 2'})[0];
        var zadatak3 = zadaci.filter(function(a){return a.naziv==='Zadatak 3'})[0];
        var zadatak4 = zadaci.filter(function(a){return a.naziv==='Zadatak 4'})[0];
        var zadatak5 = zadaci.filter(function(a){return a.naziv==='Zadatak 5'})[0];

        vjezbeListaPromisea.push(
            db.vjezba.create({id: 1, naziv:'Vjezba 1'}).then(function(v){
                return v.setZadaciVjezbe([zadatak1,zadatak2]).then(function(){
                return new Promise(function(resolve,reject){resolve(v);});
                });
            })
        );

        vjezbeListaPromisea.push(
            db.vjezba.create({id: 2, naziv:'Vjezba 2'}).then(function(v){
                return v.setZadaciVjezbe([zadatak3,zadatak4, zadatak5]).then(function(){
                return new Promise(function(resolve,reject){resolve(v);});
                });
            })
        );

        Promise.all(vjezbeListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Vjezbe greska " + err);});
    }).catch(function(err){console.log("Zadaci greska " + err);});   


    studentiListaPromisea.push(db.student.create({ime:'Meho', prezime:'Mehic', index: 12345}));
    studentiListaPromisea.push(db.student.create({ime:'Neko', prezime:'Nekic', index: 54321}));
    studentiListaPromisea.push(db.student.create({ime:'Pero', prezime:'Peric', index: 77777}));

    Promise.all(studentiListaPromisea).then(function(studenti){
        var student1 = studenti.filter(function(a){return a.index === 12345})[0];
        var student2 = studenti.filter(function(a){return a.index === 54321})[0];
        var student3 = studenti.filter(function(a){return a.index === 77777})[0];

    
        grupeListaPromisea.push(
            db.grupa.create({naziv:'Grupa 1', termin: '9:30'}).then(function(v){
                return v.setStudentiGrupe([student1,student2]).then(function(){
                return new Promise(function(resolve,reject){resolve(v);});
                });
            })
        );

        grupeListaPromisea.push(
            db.grupa.create({naziv:'Grupa 2', termin: '9:30'}).then(function(v){
                return v.setStudentiGrupe([student3]).then(function(){
                return new Promise(function(resolve,reject){resolve(v);});
                });
            })
        );

        Promise.all(grupeListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Grupe greska " + err);});
    }).catch(function(err){console.log("Studenti greska " + err);});   

    });
}
