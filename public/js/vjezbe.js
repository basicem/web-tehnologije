var divDOMelement;

window.onload=function(){
    
    divDOMelement = document.getElementById("odabirVjezbe");
    VjezbeAjax.dohvatiPodatke(function(error, data) {VjezbeAjax.iscrtajVjezbe(divDOMelement,data)});

}