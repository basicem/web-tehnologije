var indexStudenta, grupaStudenta;
var ajaxstatus;

window.onload=function(){
    indexStudenta = document.getElementById("index");
    grupaStudenta = document.getElementById("grupa");

    ajaxstatus = document.getElementById("ajaxstatus");
    
    document.getElementById("posaljiPodatke").addEventListener("click", 
    function(){ 
        ajaxstatus.innerHTML = "";
        if(!indexStudenta.value.trim() || !grupaStudenta.value.trim()) {
            ajaxstatus.innerHTML = "Morate unijeti sve podatke ispravno!";
        }
        else {
            StudentAjax.postaviGrupu(indexStudenta.value, grupaStudenta.value, function(error, data) { 
                if(data == null)
                    alert("Nesto nije uredu :(")
                else {
                    ajaxstatus.innerHTML = data.status;
                }
                
            });
        }
    });
}