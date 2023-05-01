let assert = chai.assert;
describe('Tabela', function() {
    describe('crtaj()', function() {
        it('T6', function() {
            Tabela.crtaj(2,3);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1]
            let redovi = tabela.getElementsByTagName("tr");
            assert.equal(redovi.length, 8,"Broj redova treba biti 3");
        });
        it('T3', function() {
            Tabela.crtaj(3,3);
            let tabele = document.getElementsByTagName("table");
            let tabela = tabele[tabele.length-1]
            let redovi = tabela.getElementsByTagName("tr");
            let kolone = redovi[2].getElementsByTagName("td");
            let brojPrikazanih = 0;
            for(let i=0;i<kolone.length;i++){
            let stil = window.getComputedStyle(kolone[i])
            if(stil.display!=='none') brojPrikazanih++;
            }
            assert.equal(brojPrikazanih, 2,"Broj kolona treba biti 2");
        });
    });


    // describe('crtaj()', function() {
    //     it('T1', function() {
    //         Tabela.crtaj(2,3);
    //         let tabele = document.getElementsByTagName("table");
    //         let tabela = tabele[tabele.length-1]
    //         let redovi = tabela.getElementsByTagName("tr");
    //         assert.equal(redovi.length, 40,"Broj redova treba biti 3");
    //     });
    //     it('T2', function() {
    //         Tabela.crtaj(2,3);
    //         let tabele = document.getElementsByTagName("table");
    //         let tabela = tabele[tabele.length-1]
    //         let redovi = tabela.getElementsByTagName("tr");
    //         let kolone = redovi[2].getElementsByTagName("td");
    //         let brojPrikazanih = 0;
    //         for(let i=0;i<kolone.length;i++){
    //         let stil = window.getComputedStyle(kolone[i])
    //         if(stil.display!=='none') brojPrikazanih++;
    //         }
    //         assert.equal(brojPrikazanih, 20,"Broj kolona treba biti 2");
    //     });
    //     it('T4', function() {
    //         Tabela.crtaj(3,3);
    //         let tabele = document.getElementsByTagName("table");
    //         let tabela = tabele[tabele.length-1]
    //         let redovi = tabela.getElementsByTagName("tr");
    //         let kolone = redovi[2].getElementsByTagName("td");
    //         let brojPrikazanih = 0;
    //         for(let i=0;i<kolone.length;i++){
    //         let stil = window.getComputedStyle(kolone[i])
    //         if(stil.display!=='none') brojPrikazanih++;
    //         }
    //         assert.equal(brojPrikazanih, 31,"Broj kolona treba biti 2");
    //     });
    // });
});