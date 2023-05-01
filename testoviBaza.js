const chai= require('chai');
const chaihttp = require('chai-http');
chai.use(chaihttp);
chai.should();
let assert = chai.assert;

const server = require('./index.js');
const Sequelize = require('sequelize');
const sequelize= require('./db.js').sequelize;
const res = require('express/lib/response');
var vjezba = require("./modeli/vjezba.js")(sequelize);
var zadatak = require('./modeli/zadatak.js')(sequelize);
var grupa = require('./modeli/grupa.js')(sequelize);
var student = require('./modeli/student.js')(sequelize);
 

//Veza 1-n vise zadataka se moze nalaziti u vjezi
vjezba.hasMany(zadatak,{as:'zadaciVjezbe'});
grupa.hasMany(student,{as:'studentiGrupe'});


describe("BazaTest",  function(){


    var nizStudent = [];
    var nizGrupa = [];
    var nizZadatak = [];
    var nizVjezbe = [];


    this.timeout(100000);

    this.beforeAll((done) => {

        sequelize.sync().then(()=>{
            return student.findAll().then((rez)=>{
                rez.forEach(student=> {
                    nizStudent.push({ id:student.id,ime:student.ime,prezime:student.prezime,index:student.index,grupa:student.grupa,grupaId:student.grupaId})
                })
                return grupa.findAll();
            })
            .then(grupe=>{
                grupe.forEach(g => {
                    nizGrupa.push({id:g.id,naziv:g.naziv, termin: g.termin})
                })
                return zadatak.findAll()
            })
            .then(zadaci => {
                zadaci.forEach(z => {
                    nizZadatak.push({id:z.id,naziv:z.naziv,vjezbaId:z.vjezbaId})
                })
                return vjezba.findAll()
            })
            .then(vjezbe=>{
                vjezbe.forEach(v =>{
                    nizVjezbe.push({id:v.id,naziv:v.naziv})
                })
            })
            .then(()=>{
                 sequelize.sync({force:true}).then(()=>{
                    done();
            })
        })
    })
    });


    //testovi za /student {ime:string,prezime:string,index:string,grupa:string}
    it('POST/student (1) ne postoji student, ne postoji grupa', async () =>{
    
        let studentDodaj = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        const response = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj));

        assert.equal(JSON.stringify(response.body), "{\"status\":\"Kreiran student!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 1);
        assert.equal(sviStudenti[0].ime, "Irfan");
        assert.equal(sviStudenti[0].prezime, "Prazina");
        assert.equal(sviStudenti[0].index, 11111);

        assert.equal(sveGrupe.length, 1);
        assert.equal(sveGrupe[0].naziv, "Grupa 1");
        
        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");
        
        console.log("(1) Prvi response " + JSON.stringify(response.body));

    });

    it('POST/student (2) postoji student, ne postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv
        let studentDodaj2 = {ime: "Zeljko", prezime: "Juric", index: "11111", grupa: "Grupa 2"};
        const response2 = await (chai.request(server)
                                .post('/student/')).set('Content-Type','application/json')
                                .send(studentDodaj2);

        assert.equal(JSON.stringify(response1.body), "{\"status\":\"Kreiran student!\"}", "Nije dobar response");
        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Student sa indexom 11111 već postoji!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 1);
        assert.equal(sviStudenti[0].ime, "Irfan");
        assert.equal(sviStudenti[0].prezime, "Prazina");
        assert.equal(sviStudenti[0].index, 11111);

        assert.equal(sveGrupe.length, 1);
        grupa1 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa1.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");

        console.log("(2) Prvi response " + JSON.stringify(response1.body));
        console.log("(2) Drugi response " + JSON.stringify(response2.body));

    });


    it('POST/student (3) ne postoji student, postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv
        let studentDodaj2 = {ime: "Zeljko", prezime: "Juric", index: "22222", grupa: "Grupa 1"};
        const response2 = await (chai.request(server)
                                .post('/student/')).set('Content-Type','application/json')
                                .send(studentDodaj2);

        assert.equal(JSON.stringify(response1.body), "{\"status\":\"Kreiran student!\"}", "Nije dobar response");
        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Kreiran student!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))


        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return sveGrupe;
        }))

        assert.equal(sviStudenti.length, 2);
        assert.equal(sviStudenti[1].ime, "Zeljko");
        assert.equal(sviStudenti[1].prezime, "Juric");
        assert.equal(sviStudenti[1].index, 22222);

        assert.equal(sveGrupe.length, 1);
        grupa1 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa1.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");
        assert.equal(sviStudenti[1].grupaId, sveGrupe[0].id, "Neispravno povezan id");

        console.log("(3) Prvi response " + JSON.stringify(response1.body));
        console.log("(3) Drugi response " + JSON.stringify(response2.body));

    });


    it('POST/student (4) postoji student, postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv
        const response2 = await (chai.request(server)
                                .post('/student/')).set('Content-Type','application/json')
                                .send(studentDodaj1);

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))
        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 1);
        assert.equal(sviStudenti[0].ime, "Irfan");
        assert.equal(sviStudenti[0].prezime, "Prazina");
        assert.equal(sviStudenti[0].index, 11111);

        assert.equal(sveGrupe.length, 1);
        grupa1 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa1.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");

        console.log("(4) Prvi response " + JSON.stringify(response1.body));
        console.log("(4) Drugi response " + JSON.stringify(response2.body));

    });

    //testovi za /student/:index {grupa:string}
    it('PUT/student/:index (1) postoji student, ne postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv
        let grupa1 = {grupa: "Grupa 2"}
        const response2 = await (chai.request(server)
                                .put('/student/11111')).set('Content-Type','application/json')
                                .send(grupa1);

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Promjenjena grupa studentu 11111\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))


        assert.equal(sveGrupe.length, 2);
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 2'});
        assert.equal(grupa2.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[1].id, "Neispravno povezan id");

        console.log("(1) Prvi response " + JSON.stringify(response1.body));
        console.log("(1) Drugi response " + JSON.stringify(response2.body));

    });


    it('PUT/student/:index (2) postoji student, postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv
        let studentDodaj2 = {ime: "Zeljko", prezime: "Juric", index: "22222", grupa: "Grupa 2"};
        const response2 = await (chai.request(server)
                                .post('/student/')).set('Content-Type','application/json')
                                .send(studentDodaj2);
        //Treci poziv                        
        let grupa1 = {grupa: "Grupa 2"}
        const response3 = await (chai.request(server)
                                .put('/student/11111')).set('Content-Type','application/json')
                                .send(grupa1);

        assert.equal(JSON.stringify(response3.body), "{\"status\":\"Promjenjena grupa studentu 11111\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))


        assert.equal(sveGrupe.length, 2);
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa2.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[1].id, "Neispravno povezan id");
        assert.equal(sviStudenti[1].grupaId, sveGrupe[1].id, "Neispravno povezan id");

        console.log("(2) Prvi response " + JSON.stringify(response1.body));
        console.log("(2) Drugi response " + JSON.stringify(response2.body));
        console.log("(2) Treci response " + JSON.stringify(response3.body));

    });

    it('PUT/student/:index (3) ne postoji student,  ne postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv                        
        let grupa1 = {grupa: "Grupa 2"}
        const response2 = await (chai.request(server)
                                .put('/student/22222')).set('Content-Type','application/json')
                                .send(grupa1);

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Student sa indexom 22222 ne postoji\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 1);
        assert.equal(sviStudenti[0].ime, "Irfan");
        assert.equal(sviStudenti[0].prezime, "Prazina");
        assert.equal(sviStudenti[0].index, 11111);

        assert.equal(sveGrupe.length, 1);
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa2.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");

        console.log("(3) Prvi response " + JSON.stringify(response1.body));
        console.log("(3) Drugi response " + JSON.stringify(response2.body));

    });

    it('PUT/student/:index (4) ne postoji student, postoji grupa', async () =>{
    
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));
        //Drugi poziv                        
        let grupa1 = {grupa: "Grupa 1"}
        const response2 = await (chai.request(server)
                                .put('/student/22222')).set('Content-Type','application/json')
                                .send(grupa1);

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Student sa indexom 22222 ne postoji\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 1);
        assert.equal(sviStudenti[0].ime, "Irfan");
        assert.equal(sviStudenti[0].prezime, "Prazina");
        assert.equal(sviStudenti[0].index, 11111);

        assert.equal(sveGrupe.length, 1);
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa2.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");

        console.log("(4) Prvi response " + JSON.stringify(response1.body));
        console.log("(4) Drugi response " + JSON.stringify(response2.body));

    });

    //testovi za /batch/student CSV(ime,prezime,index,grupa)
    it('POST/batch/student (1)', async () =>{
        let studentDodaj1 = {ime: "Irfan", prezime: "Prazina", index: "11111", grupa: "Grupa 1"};
        //Prvi poziv
        const response1 = await (chai.request(server)
                                .post('/student/').set('Content-Type','application/json')
                                .send(studentDodaj1));

        let dodajStudente = "Emina,Basic,18422,Grupa 1";
        const response2 = await (chai.request(server)
                                .post('/batch/student')
                                .set('Content-Type', 'text/plain')
                                .send(dodajStudente));

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Dodano 1 studenata!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 2);
        assert.equal(sviStudenti[1].ime, "Emina");
        assert.equal(sviStudenti[1].prezime, "Basic");
        assert.equal(sviStudenti[1].index, 18422);

        assert.equal(sveGrupe.length, 1);
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(grupa2.length, 1);

        assert.equal(sviStudenti[0].grupaId, sveGrupe[0].id, "Neispravno povezan id");
        assert.equal(sviStudenti[1].grupaId, sveGrupe[0].id, "Neispravno povezan id");
        
        console.log("(1) Prvi response " + JSON.stringify(response2.body));

    });

    it('POST/batch/student (2)', async () =>{
        let dodajStudente = "Emina,Basic,18422,Grupa 1\nIrfan,Prazina,11111,Grupa 2";
        const response2 = await (chai.request(server)
                                .post('/batch/student')
                                .set('Content-Type', 'text/plain')
                                .send(dodajStudente));

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Dodano 2 studenata!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 2);
        assert.equal(sviStudenti[0].ime, "Emina");
        assert.equal(sviStudenti[0].prezime, "Basic");
        assert.equal(sviStudenti[0].index, 18422);

        assert.equal(sviStudenti[1].ime, "Irfan");
        assert.equal(sviStudenti[1].prezime, "Prazina");
        assert.equal(sviStudenti[1].index, 11111);

        assert.equal(sveGrupe.length, 2);
        grupa1 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(sviStudenti[0].grupaId, grupa1[0].id, "Neispravno povezan id");
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 2'});
        assert.equal(sviStudenti[1].grupaId, grupa2[0].id, "Neispravno povezan id");
        
        console.log("(2) Prvi response " + JSON.stringify(response2.body));

    });

    it('POST/batch/student (3)', async () =>{
        let dodajStudente = "Emina,Basic,18422,Grupa 1\nIrfan,Prazina,11111,Grupa 2";
        const response1 = await (chai.request(server)
                                .post('/batch/student')
                                .set('Content-Type', 'text/plain')
                                .send(dodajStudente));

        

         dodajStudente = "Emina,Basic,18422,Grupa 3\nIrfan,Prazina,11111,Grupa 10";
        const response2 = await (chai.request(server)
                                .post('/batch/student')
                                .set('Content-Type', 'text/plain')
                                .send(dodajStudente));

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Dodano 0 studenata, a studenti 18422,11111 već postoje!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 2);
        assert.equal(sviStudenti[0].ime, "Emina");
        assert.equal(sviStudenti[0].prezime, "Basic");
        assert.equal(sviStudenti[0].index, 18422);

        assert.equal(sviStudenti[1].ime, "Irfan");
        assert.equal(sviStudenti[1].prezime, "Prazina");
        assert.equal(sviStudenti[1].index, 11111);

        assert.equal(sveGrupe.length, 2);
        grupa1 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(sviStudenti[0].grupaId, grupa1[0].id, "Neispravno povezan id");
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 2'});
        assert.equal(sviStudenti[1].grupaId, grupa2[0].id, "Neispravno povezan id");
        
        console.log("(3) Prvi response " + JSON.stringify(response2.body));

    });

    it('POST/batch/student (4)', async () =>{
        let dodajStudente = "Emina,Basic,18422,Grupa 1\nIrfan,Prazina,11111,Grupa 2";
        const response1 = await (chai.request(server)
                                .post('/batch/student')
                                .set('Content-Type', 'text/plain')
                                .send(dodajStudente));

        

         dodajStudente = "Emina,Basic,18422,Grupa 1\nIrfan,Prazina,11111,Grupa 2\nZeljko,Juric,12345,Grupa 3";
        const response2 = await (chai.request(server)
                                .post('/batch/student')
                                .set('Content-Type', 'text/plain')
                                .send(dodajStudente));

        assert.equal(JSON.stringify(response2.body), "{\"status\":\"Dodano 1 studenata, a studenti 18422,11111 već postoje!\"}", "Nije dobar response");

        sviStudenti = await (student.findAll().then(function(studenti) {
            return studenti;
        }))

        sveGrupe = await (grupa.findAll().then(function(grupe) {
            return grupe;
        }))

        assert.equal(sviStudenti.length, 3);
        student1 = sviStudenti.filter(function(g){return g.index === 18422});
        student2 = sviStudenti.filter(function(g){return g.index === 11111});
        student3 = sviStudenti.filter(function(g){return g.index === 12345});

        assert.equal(sveGrupe.length, 3);
        grupa1 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 1'});
        assert.equal(student1[0].grupaId, grupa1[0].id, "Neispravno povezan id");
        grupa2 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 2'});
        assert.equal(student2[0].grupaId, grupa2[0].id, "Neispravno povezan id");
        grupa3 = sveGrupe.filter(function(g){return g.naziv === 'Grupa 3'});
        assert.equal(student3[0].grupaId, grupa3[0].id, "Neispravno povezan id");
        
        console.log("(4) Prvi response " + JSON.stringify(response2.body));

    });


    this.afterEach(function(done) {
        sequelize.sync({force:true}).then(()=>{
           done();
        });
    })


    this.afterAll(function(done){
        grupa.bulkCreate(nizGrupa).then(()=>{
            student.bulkCreate(nizStudent).then(()=>{
                vjezba.bulkCreate(nizVjezbe).then(()=>{
                    zadatak.bulkCreate(nizZadatak).then(()=>{
                        done();
                    })
                })
            })
        })
    });

})