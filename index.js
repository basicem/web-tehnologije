const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const { redirect } = require('express/lib/response');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./public/html'));
app.use(express.static('./public/css'));
app.use(express.static('./public/js'));
app.use(express.static('./public/images'));
app.use(express.static('./public/gspec'));
app.use(express.static('public'));


const db = require('./db.js');
const vjezba = require('./modeli/vjezba.js');
const zadatak = require('./modeli/zadatak.js');
const grupa = require('./modeli/grupa.js');
const student = require('./modeli/student.js');

app.get('/zadatak4.html',function(req,res){
    res.sendFile(__dirname + '/zadatak4.html');
});

app.get('/vjezbe/',function(req,res){

    let brojZadataka = [];
    let brojVjezbi;
    const mojSet = new Set();

    db.zadatak.findAll().then(function(zadaci) {
        zadaci.forEach(zadatak => {
            mojSet.add(zadatak.vjezbaId);
        });
        brojVjezbi = mojSet.size;

        brojac = 0;
        neispravno = false;
        db.vjezba.findAll().then(function(vjezbe) {
            vjezbe.forEach(vjezba => {
                if(!mojSet.has(vjezba.id)) {
                    neispravno = true;
                }
               brojac++;
            });

            if(neispravno) {
                res.json({});
                console.log("Neispravni podaci");
                return;
            }
            if(brojac != brojVjezbi) {
                res.json({});
                console.log("Neispravni podaci");
                return;
            }
    
            mojSet.forEach(element => {
                let brojac = 0;
                zadaci.forEach(zadatak => {
                    if(zadatak.vjezbaId == element) 
                        brojac++;
                })
                brojZadataka.push(brojac);
            })
    
            if(brojVjezbi != brojZadataka.length) {
                res.json({});
                console.log("Neispravni podaci");
                return;
            }
    
            if(!(brojVjezbi >= 1 && brojVjezbi <= 15)) {
                res.json({});
                console.log("Neispravni podaci");
                return;
            }
    
            brojZadataka.forEach(zadatak => {
                if(!(zadatak >= 0 && zadatak <= 10)) {
                    res.json({});
                    console.log("Neispravni podaci");
                    return;
                }
            });
    
            var  json = {
                brojVjezbi: brojVjezbi,
                brojZadataka: brojZadataka
            };
            res.json(json);
    
        })

        
        // console.log("Broj Vjezbi: ", brojVjezbi);
        // console.log("Broj Zadataka: ", brojZadataka);
    });


    

    // fs.readFile('vjezbe.csv', 'utf-8' , (err, data) => {
    //     if (err) {
    //     console.error(err)
    //     return
    //     }
    //     const responseData = data;
    //     if(responseData != 0) {
    //         const myArray = responseData.split(" ");
    //         if(myArray.length != 2) {
    //             res.json({});
    //             console.log("Neispravni podaci");
    //             res.end();
    //             return
    //         }
    //         else if(!(Number(myArray[0]) >= 1 && Number(myArray[0]) <= 15)) {
    //             res.json({});
    //             console.log("Neispravni podaci");
    //             res.end();
    //             return
    //         }
    //         //var json = [];
    //         console.log(myArray);
    //         var broj_vjezbi = Number(myArray[0]);
    //         var broj_zadataka = myArray[1].split(',').map(Number);
    //         if(Number(myArray[0]) != broj_zadataka.length) {
    //             res.json({});
    //             console.log("Neispravni podaci");
    //             res.end();
    //             return
    //         }
    //         for(let i=0; i < broj_zadataka.length; i++) {
    //             if(!(broj_zadataka[i] >= 0 && broj_zadataka[i] <= 10)) {
    //                 res.json({});
    //                 console.log("Neispravni podaci");
    //                 res.end();
    //                 return
    //             }
    //         }
    //         var  json = {
    //             brojVjezbi: broj_vjezbi,
    //             brojZadataka: broj_zadataka
    //         };

    //         res.json(json);
    //     }
    //     else {
    //         res.json({});
    //         console.log("Neispravni podaci");
    //         res.end();
    //         return
    //     }
    // })
});

app.post('/vjezbe',function(req,res){
    let tijelo = req.body;
    var broj_vjezbi = Number(tijelo['brojVjezbi']);
    var broj_zadataka = tijelo['brojZadataka'];

    broj_zadataka = JSON.stringify(broj_zadataka);
    broj_zadataka = broj_zadataka.replace("[","");
    broj_zadataka = broj_zadataka.replace("]","");
    broj_zadataka = broj_zadataka.split(',').map(Number);
    
    var tekst = "Pogrešan parametar ";
    if(!(broj_vjezbi >= 1 && broj_vjezbi <= 15)) {
        tekst = tekst + "brojVjezbi";
        for(var i = 0; i < broj_zadataka.length; i++) {
            if(!(broj_zadataka[i] >= 0 && broj_zadataka[i] <= 10)) 
                tekst = tekst + ",z" + i;
        }
        var  json = {
            status: "error",
            data: tekst
        };
        res.json(json);
    }

    if(broj_zadataka.length != broj_vjezbi) {
        tekst = tekst + "brojZadataka";
        var  json = {
            status: "error",
            data: tekst
        };
        const jsonContent = JSON.stringify(json);
        res.json(json);
    }

    for(var i = 0; i < broj_zadataka.length; i++) {
        if(!(broj_zadataka[i] >= 0 && broj_zadataka[i] <= 10)) 
            tekst = tekst + "z" + i;
    }
    var  json = {
        status: "error",
        data: tekst
    };

    if(tekst != "Pogrešan parametar ") {
        const jsonContent = JSON.stringify(json);
        res.json(json);
        return;
    }

    let novaLinija = broj_vjezbi + " " + broj_zadataka;
    // fs.writeFile('vjezbe.csv', novaLinija, function(err){
    //     if(err) throw err;
        //  console.log("Novi red uspješno dodan!");
        //  res.json({brojVjezbi: broj_vjezbi, brojZadataka:broj_zadataka});
    // });

    db.zadatak.destroy({
        truncate: { cascade: true },
        restartIdentity: true}).then(function(){     
        db.vjezba.destroy({
        truncate: { cascade: true },
        restartIdentity: true});
    }).then(function() {
        var zadaciListaPromisea = [];
        var vjezbeListaPromisea = [];
        console.log("Novi red uspješno dodan!");
        res.json({brojVjezbi: broj_vjezbi, brojZadataka:broj_zadataka});

        return new Promise(function(resolve,reject){

            id_brojac = 1;
            for(let i = 0; i < broj_zadataka.length; i++) {
                var zadaciListaPromisea = [];
                for(var j = 0; j < broj_zadataka[i]; j++) {
                    zadaciListaPromisea.push(db.zadatak.create({id: id_brojac, naziv:'Zadatak '+(j+1)}));
                    id_brojac++;
                }
                Promise.all(zadaciListaPromisea).then(function(zadaci){
                    vjezbeListaPromisea.push(
                        db.vjezba.create({id: (i+1),naziv:'Vjezba ' + (i+1)}).then(function(v){
                            return v.setZadaciVjezbe(zadaci).then(function(){
                            return new Promise(function(resolve,reject){resolve(v);});
                            });
                        })
                    );
            
            
                    Promise.all(vjezbeListaPromisea).then(function(b){resolve(b);}).catch(function(err){console.log("Vjezbe greska " + err);});
                }).catch(function(err){console.log("Zadaci greska " + err);}); 
            }
        });
    });

});

//{ime:string,prezime:string,index:string,grupa:string}
app.post('/student',function(req,res){
    let tijelo = req.body;
    var studentiListaPromisea =[];
    let student;

    if(!tijelo.hasOwnProperty("ime") || !tijelo.hasOwnProperty("prezime") || !tijelo.hasOwnProperty("index") || !tijelo.hasOwnProperty("grupa")) {
        var json = {status: "Neispravni podaci u req.body!"}
        res.json(json); 
        return;
    }

    db.student.findOne({where:{index: parseInt(tijelo.index)}}).then(function(pronadeniStudent){
        student = pronadeniStudent;
        var  json = { status: "Student sa indexom " + tijelo.index + " već postoji!"};
        if(student != null) {
            console.log("Student " + student.index);
            res.json(json); 
            return;
        }

    }).then(function() { 
        if(student != null) return;
        return new Promise(function(resolve,reject){

        studentiListaPromisea.push(db.student.create({ime: tijelo.ime, prezime:tijelo.prezime, index: parseInt(tijelo.index)}));
        
        Promise.all(studentiListaPromisea).then(function(studentiListaPromisea) {

        var student1 = studentiListaPromisea[0];
        var grupa;
        db.grupa.findOne({where:{naziv: tijelo.grupa}}).then(function(pronadenaGrupa){
            if(pronadenaGrupa != null) {
                grupa = pronadenaGrupa;
                return pronadenaGrupa.addStudentiGrupe([student1]).then(function(){
                    return new Promise(function(resolve,reject){resolve(pronadenaGrupa);});
                });
            }
            else {
                grupa = db.grupa.create({naziv: tijelo.grupa, termin: '9:30'}).then(function(v){
                    return v.addStudentiGrupe([student1]).then(function(){
                    return new Promise(function(resolve,reject){resolve(v);});
                    });
                })
            }
        }).then(function() {
            Promise.all([grupa]).then(function(b){resolve(b);}).catch(function(err){console.log("Studenti greska " + err);}).then(function() {
                var  json = { status: "Kreiran student!"};
               res.json(json);
            });
        });

        });
     
    }).catch(function(err){console.log("Studenti greska " + err);});
    });
});

//{grupa:string}
app.put('/student/:index',function(req,res){
    let tijelo = req.body;
    var student_index = req.params['index'];
    
    if(!tijelo.hasOwnProperty("grupa")) {
        var json = {status: "Neispravni podaci u req.body!"}
        res.json(json); 
        return;
    }
    //console.log("Parametar je" + student_index);
    var student;
    db.student.findOne({where:{index: student_index}}).then(function(pronadeniStudent){
        student = pronadeniStudent;
        if(student == null) {
            var  json = { status: "Student sa indexom " + student_index + " ne postoji"};
            res.json(json); 
            return;
        }

    }).then(function() { 
        if(student == null) return;

        return new Promise(function(resolve,reject){

        var grupa;
        db.grupa.findOne({where:{naziv: tijelo.grupa}}).then(function(pronadenaGrupa){
            if(pronadenaGrupa != null) {
                grupa = pronadenaGrupa;
                return pronadenaGrupa.addStudentiGrupe([student]).then(function(){
                    return new Promise(function(resolve,reject){resolve(pronadenaGrupa);});
                });
            }
            else {
                grupa = db.grupa.create({naziv: tijelo.grupa, termin: '9:30'}).then(function(v){
                    return v.addStudentiGrupe([student]).then(function(){
                    return new Promise(function(resolve,reject){resolve(v);});
                    });
                })
            }
        }).then(function() {
            Promise.all([grupa]).then(function(b){resolve(b);}).catch(function(err){console.log("Studenti greska " + err);}).then(function() {
                var  json = { status: "Promjenjena grupa studentu "+ student_index};
               res.json(json);
            });
        });
     
    }).catch(function(err){console.log("Studenti greska " + err);});
    });
    
});

app.use(bodyParser.text());
app.post('/batch/student',function(req,res){
    let tijelo = req.body;    
    //console.log(tijelo);

    let listaStudenata = [];
    let listaGrupa = [];
    var studentiListaPromisea =[];
    var grupeListaPromisea =[];
    var indexiKojiVecPostoje = [];
    var ispisiSve = [];
    var indexi = new Set();
    let redovi = tijelo.split('\n');  
    const mapaStudenata = new Map();  
    redovi.forEach(element => {
        let studentNovi = element.split(',');
        studentNovi[3] = studentNovi[3].replace("\r","");
        //if(indexi.has(studentNovi[2]) == false) {
            //console.log("Index " + studentNovi[2]);
            indexi.add(studentNovi[2]);
            listaStudenata.push(studentNovi);
        //}
        //else {
            indexiKojiVecPostoje.push(studentNovi[2]);
        //}
    });
    
    brojPostojecih = 0, brojNovihDodanih = 0;
    let s;
    brojProlaza = 0;

    db.student.findAll().then(function(studenti){
        return studenti;
    }).then((studenti) => {
        listaStudenataKojiNisuUBazi = new Set();
        listaStudenata.forEach(stariStudent => {
            let uBazi = false;
            studenti.forEach(noviStudent => {
                if(parseInt(stariStudent[2]) === noviStudent.index) {
                    uBazi = true;
                }
            })
            if(uBazi == false) {
                listaStudenataKojiNisuUBazi.add(stariStudent);
                if(!(listaGrupa.includes(stariStudent[3]))) {
                    listaGrupa.push(stariStudent[3]);
                }
            }
            else    
                ispisiSve.push(stariStudent[2]) 
        });
        //console.log(listaStudenataKojiNisuUBazi);

        listaGrupa.forEach(grupa => {
            var dodaj_u_mapu = [];
            listaStudenataKojiNisuUBazi.forEach(student => {
                if(student[3] === grupa)
                    dodaj_u_mapu.push(student);
            })
            mapaStudenata.set(grupa, dodaj_u_mapu);
        });
        //console.log(mapaStudenata);
        return listaStudenataKojiNisuUBazi;
    }).then(listaStudenataKojiNisuUBazi => {

        listaStudenataKojiNisuUBazi.forEach(studentDodaj => {
            studentiListaPromisea.push(db.student.create({ime: studentDodaj[0], prezime: studentDodaj[1], index: parseInt(studentDodaj[2])}));
            brojNovihDodanih++;
        });

    }).then(() => {
        Promise.all(studentiListaPromisea).then(function(studenti){
            //console.log("Trebao dodati studente ;(");
            const iterator1 = mapaStudenata[Symbol.iterator]();
            for (const element of iterator1) {
                grupeListaPromisea.push(
                    db.grupa.findOrCreate({where:{naziv: element[0], termin:'9:30'}}).then(function(pronadenaGrupa){
                        pronadenaGrupa = pronadenaGrupa[0];
                        studenti1 = [];
                        
                        element[1].forEach(element => {
                            //console.log("INDEX JE: " + element[2]);
                            student1 = studenti.filter(function(a){return a.index === parseInt(element[2])})[0];
                            studenti1.push(student1)
                        });
                        //console.log(studenti1);
                        //student1 = studenti.filter(function(a){return a.index === 18422})[0];
                        //console.log("Studenti grupe su: " + element[1])
                        return pronadenaGrupa.addStudentiGrupe(studenti1).then(function(){
                            return new Promise(function(resolve,reject){resolve(pronadenaGrupa);});
                        });
                    })
              )
            }
            Promise.all(grupeListaPromisea).then(function(grupe) {
                if(ispisiSve.length == 0)
                    res.json({status:"Dodano " + brojNovihDodanih + " studenata!"});
                else 
                res.json({status:"Dodano " + brojNovihDodanih + " studenata, a studenti " + ispisiSve + " već postoje!"});
                return;
            })
        })
    })    
});

var server = app.listen(3000);
module.exports = server;