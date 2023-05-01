var DOMelementDIVauFormi,brojVjezbi, posaljiPodatke;

window.onload=function(){
    DOMelementDIVauFormi = document.getElementById("container");
    brojVjezbi = document.getElementById("brojVjezbi");

    posaljiPodatke = document.getElementById("posaljiPodatke");
    posaljiPodatke.style.display = "none";


    document.getElementById("prikaziZadatke").addEventListener("click", 
    function(){ 
        if(brojVjezbi.value >= 1 && brojVjezbi.value <= 15) {
            posaljiPodatke.style.display = "block";
        }
        else {
            posaljiPodatke.style.display = "none";
        }
        DOMelementDIVauFormi.innerHTML = "";
        var btn2 = document.getElementById("brojVjezbi");
        VjezbeAjax.dodajInputPolja(DOMelementDIVauFormi, brojVjezbi.value);
    });

    document.getElementById("posaljiPodatke").addEventListener("click", 
    function(){ 
        zadaci = [];
        for(var i = 0; i < brojVjezbi.value; i++) {
            var brojZadatakaVjezbe = document.getElementById("z"+i);
            zadaci.push(Number(brojZadatakaVjezbe.value));
        }

        var ok = true;
        for(var i = 0; i < zadaci.length; i++) {
            if(!(zadaci[i] >= 0 && zadaci[i] <= 10)) {
                ok = false;
                break;
            }
        }
        if(ok) alert("Podaci ispravni :)");
        else alert("Podaci neispravni :(");

        vjezbeObjekat= {brojVjezbi: Number(brojVjezbi.value), brojZadataka: zadaci};

        VjezbeAjax.posaljiPodatke(vjezbeObjekat, function(error, data) {});

    });

}