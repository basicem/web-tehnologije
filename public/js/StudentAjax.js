let StudentAjax = (function () {

    let dodajStudenta = function(studentObjekat,fnCallback){
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null,jsonRez);
            }
            else if (ajax.readyState == 4)
            fnCallback(ajax.statusText,null);
        }
        ajax.open("POST","http://localhost:3000/student",true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(studentObjekat));
    }

    //index:String,grupa:String,fnCallback:Function
    let postaviGrupu = function(index, grupa, fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null,jsonRez);
            }
            else if (ajax.readyState == 4)
            fnCallback(ajax.statusText,null);
        }
        ajax.open("PUT","http://localhost:3000/student/" + index,true);
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify({grupa:grupa}));
    }

    //csvStudenti:String,fnCallback:Function
    let dodajBatch = function(csvStudenti,fnCallback) {
        var ajax = new XMLHttpRequest();
        ajax.onreadystatechange = function() {
            if (ajax.readyState == 4 && ajax.status == 200){
                var jsonRez = JSON.parse(ajax.responseText);
                fnCallback(null,jsonRez);
            }
            else if (ajax.readyState == 4)
            fnCallback(ajax.statusText,null);
        }
        ajax.open("POST","http://localhost:3000/batch/student/",true);
        //ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(csvStudenti);
    }

    return {    
        dodajStudenta : dodajStudenta,
        postaviGrupu: postaviGrupu,
        dodajBatch: dodajBatch

    }  
}());
