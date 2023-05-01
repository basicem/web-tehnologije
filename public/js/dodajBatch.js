var csv;
var ajaxstatus;

window.onload=function(){
    csv = document.getElementById("csv");
    ajaxstatus = document.getElementById("ajaxstatus");
    
    document.getElementById("posaljiPodatke").addEventListener("click", 
    function(){ 
        ajaxstatus.innerHTML = "";
        redovi = csv.value.split("\n");
        var studenti = [];
        redovi.forEach(student => {
            studenti.push(student.split(","));
        });
        console.log(studenti);
        tacno = true;
        for(var i = 0; i < studenti.length; i++) {
            if(studenti[i].length != 4) {
                tacno = false;
                break;
            }
        }
        if(tacno == false) {
            ajaxstatus.innerHTML = "Morate unijeti sve podatke ispravno!";
        }
        else {
            StudentAjax.dodajBatch(csv.value, function(error, data) { 
                if(data == null)
                    alert("Nesto nije uredu :(")
                else {
                    ajaxstatus.innerHTML = data.status;
                }
                
            });
        }
    });
}