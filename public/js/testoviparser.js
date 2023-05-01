let TestoviParser = (function () {
    var dajTacnost  = function(txt) {
        let vratiObjekat = {
            "tacnost" : "0%",
            "greske" : []
        };
        var obj;
        try {
            obj = JSON.parse(txt);
        }
        catch(something) {
            vratiObjekat.greske.push("Testovi se ne mogu izvršiti");
            return vratiObjekat;
        }

        if(!obj.hasOwnProperty('stats') || !obj.hasOwnProperty('tests') || !obj.hasOwnProperty('failures') || !obj.hasOwnProperty('passes')){
            vratiObjekat.greske.push("Testovi se ne mogu izvršiti");
            return vratiObjekat;
        }
        
        var brojTestova = JSON.stringify(obj.stats.tests), brojTacnih = JSON.stringify(obj.stats.passes), brojNetacnih = JSON.stringify(obj.stats.failures);
        if(brojNetacnih == 0) {
            vratiObjekat.tacnost = "100%"
        }
        else {
            var procenat = brojTacnih/brojTestova * 100;
            if(Number.isInteger(procenat))
                vratiObjekat.tacnost = procenat + "%";
            else
                vratiObjekat.tacnost = Math.round(procenat * 10) / 10 + "%";

            //trebamo dodati nazive testova koji nisu prosli
            var nizTestova = obj.failures;
            for (const x in nizTestova) {
                vratiObjekat.greske.push(nizTestova[x].fullTitle);
              }
        }
        return vratiObjekat;
    }
    var porediRezultate = function(rezultat1, rezultat2) {
        var obj1;
        var obj2;
        let vratiObjekat2 = {
            "promjena" : "0%",
            "greske" : []
        };
        //Nemoguce parsiranje
        try {
            var obj1 = JSON.parse(rezultat1);
            var obj2 = JSON.parse(rezultat2);
        }
        catch(something) {
            vratiObjekat2.greske.push("Testovi se ne mogu izvršiti");
            return vratiObjekat2;
        }


        var isti = false;
        var nizTestova1 = obj1.tests;
        var nizTestova2 = obj2.tests;
    
        if(nizTestova1.length == nizTestova2.length) {
            for (const test1 in nizTestova1) {
                var jedanNaziv = nizTestova1[test1].fullTitle;
                isti = false;
                for(const test2 in nizTestova2) {
                    if(jedanNaziv == nizTestova2[test1].fullTitle) {
                        isti = true;
                        break;
                    }
                    if(isti == false) break;
                }
                if(isti == false) break;
            }
            if(isti == true) {
                //znaci da su isti promjena je tacnost rezultata2
                vratiObjekat2.promjena = dajTacnost(rezultat2).tacnost;
                //prikazujemo greske samo iz rezultata2
                var testoviKojiSuPali = obj2.failures;
                for (const x in testoviKojiSuPali) {
                    vratiObjekat2.greske.push(testoviKojiSuPali[x].fullTitle);
                }
                vratiObjekat2.greske.sort();
                return vratiObjekat2;
            }
            
        }
        //document.getElementById("ispis").innerHTML = isti;
        //definitivno nisu isti
        //broj testova koji padaju u rezultatu1 a ne pojavljuju se u rezultatu2
        var brojTestova = 0;
        var nalasiSe = false;
        var oniKojiPadajuURezultat1 = obj1.failures;
        for(const pada in oniKojiPadajuURezultat1) {
            nalasiSe = false;
            for(const test2 in obj2.tests) {
                if(oniKojiPadajuURezultat1[pada].fullTitle == nizTestova2[test2].fullTitle) {
                    nalasiSe = true
                    break;
                }
            }
            if(nalasiSe == false) {
                brojTestova++;
                vratiObjekat2.greske.push(oniKojiPadajuURezultat1[pada].fullTitle);
            }
        }

        
        vratiObjekat2.greske.sort();
        //document.getElementById("ispis").innerHTML = vratiObjekat2.greske;
        //oni koji padaju u rezultatu2
        var testoviKojiPadajuUDrugom = obj2.failures;
        var nazivi = [];
        for(const c in testoviKojiPadajuUDrugom) {
            nazivi.push(testoviKojiPadajuUDrugom[c].fullTitle);
        }
        nazivi.sort();
        vratiObjekat2.greske.push(...nazivi);

        var brojTestovauRezultat2 = obj2.stats.tests;
        var brojTestovaKojiPadajuRezultat2 = obj2.stats.failures;
        vratiObjekat2.promjena = (brojTestova + brojTestovaKojiPadajuRezultat2)/(brojTestova + brojTestovauRezultat2)*100 + "%"; 
        return vratiObjekat2;
        
    }
    return {
        dajTacnost : dajTacnost,
        porediRezultate: porediRezultate
        }  
}());


