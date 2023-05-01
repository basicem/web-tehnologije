let VjezbeAjax = (function () {

    let vidljiva = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]

    let dodajInputPolja  = function(DOMelementDIVauFormi,brojVjezbi) {
        if(brojVjezbi >= 1 && brojVjezbi <=15) {
            for(var i=0; i < brojVjezbi; i++) {
                //labela
                let l = document.createElement("LABEL");
                let t = document.createTextNode("Unesite broj zadataka za vježbu " +  (i+1) +  ": ");
                l.appendChild(t);
                l.style.color = "#965a3e";
                l.style.display = "block";
                l.style.padding = "5px";
                DOMelementDIVauFormi.appendChild(l);
                //ulaz
                let z_i = document.createElement("input");
                z_i.setAttribute("type", "number");
                z_i.setAttribute("id", "z"+i);
                z_i.setAttribute("name", "z"+i);
                z_i.setAttribute("value", 4);
                DOMelementDIVauFormi.appendChild(z_i);
            }
        }
    }

    let posaljiPodatke = function(vjezbeObjekat,callbackFja){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                callbackFja(null,jsonRez);
            }
            else if (ajax.readyState == 4)
            callbackFja(ajax.statusText,null);
        }
        ajax.open("POST","http://localhost:3000/vjezbe",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(vjezbeObjekat));
    }

    let dohvatiPodatke = function(callbackFja) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                callbackFja(null, jsonRez);
            }
            else if (ajax.readyState == 4)
            callbackFja(ajax.statusText,null);
        }
        ajax.open("GET", "http://localhost:3000/vjezbe", true);
        ajax.send();
    }

    //{brojVjezbi:N,brojZadatakaPoVjezbi1:[v1,v2,v3,v4]}
    let iscrtajVjezbe = function(divDOMelement, objekat) {
        //console.log(objekat.brojVjezbi);
        if(objekat.brojVjezbi >= 0 && objekat.brojVjezbi <= 10) {
            for(let i = 0; i < objekat.brojVjezbi; i++) {

                //div
                let div_v_i = document.createElement("div");
                div_v_i.setAttribute("id", "divVjezba"+(i+1));

                //button
                let v_i = document.createElement("BUTTON");
                v_i.innerHTML = "Vježba " + parseInt(i+1);
                v_i.setAttribute("id", "vjezba"+(i+1));

                //click na button vjezba_i
                v_i.addEventListener("click", function(){
                    if(vidljiva[i] == false) {
                        vidljiva[i] = true;
                        niz = objekat.brojZadataka;
                        iscrtajZadatke(div_v_i, niz[i]);
                    }
                });

                v_i.style = "background-color: #a57164; border: 2px solid;color: #ffddca;margin: 0;width: 100%;padding: 25px;text-align: center;text-decoration: none;display: block;font-size: 16px;"
                v_i.setAttribute("id", "v"+(i+1));
                div_v_i.appendChild(v_i);
                divDOMelement.appendChild(div_v_i);
            }
        }
    }

    let iscrtajZadatke = function(vjezbaDOMelement,brojZadataka) {
        //alert(vjezbaDOMelement.id);
        //alert(brojZadataka);
        if(brojZadataka >= 0 && brojZadataka <= 15) {
            for(let i = 0; i < brojZadataka; i++) {
                
                let z_i = document.createElement("BUTTON");
                z_i.innerHTML = "Zadatak " + parseInt(i+1);
                z_i.setAttribute("id", "zadatak"+(i+1));
                z_i.style = "background-color: #987654;border: none;color: #ffddca;border: 2px solid;padding: 15px 15px;margin: 0;text-align: center;text-decoration: none;display: inline-block;font-size: 14px;";
                vjezbaDOMelement.appendChild(z_i)
            }
        }
    }
    
    return {    
        dodajInputPolja : dodajInputPolja,
        posaljiPodatke: posaljiPodatke,
        dohvatiPodatke: dohvatiPodatke,
        iscrtajVjezbe: iscrtajVjezbe,
        iscrtajZadatke: iscrtajZadatke
        }  
}());
