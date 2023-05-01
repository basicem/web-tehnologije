var imeStudenta, prezimeStudenta, indexStudenta, grupaStudenta;
var ajaxstatus;
window.onload=function(){
    imeStudenta = document.getElementById("ime");
    prezimeStudenta = document.getElementById("prezime");
    indexStudenta = document.getElementById("index");
    grupaStudenta = document.getElementById("grupa");

    ajaxstatus = document.getElementById("ajaxstatus");
    
    document.getElementById("posaljiPodatke").addEventListener("click", 
    function(){ 
        ajaxstatus.innerHTML = "";
        if(!imeStudenta.value.trim() || !prezimeStudenta.value.trim() || !indexStudenta.value.trim() || !grupaStudenta.value.trim()) {
            ajaxstatus.innerHTML = "Morate unijeti sve podatke ispravno!";
        }
        else {
            studentObjekat = {ime: imeStudenta.value, prezime: prezimeStudenta.value, index: indexStudenta.value, grupa: grupaStudenta.value};
            StudentAjax.dodajStudenta(studentObjekat, function(error, data) { 
                if(data == null)
                    alert("Nesto nije uredu :(")
                else {
                    ajaxstatus.innerHTML = data.status;
                }
            });
        }
    });

}