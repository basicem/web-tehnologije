chai.should();
 
describe('VjezbeAjax', function() {
  beforeEach(function() {
    this.xhr = sinon.useFakeXMLHttpRequest();
 
    this.requests = [];
    this.xhr.onCreate = function(xhr) {
      this.requests.push(xhr);
    }.bind(this);
  });
 
  afterEach(function() {
    this.xhr.restore();
  });
 
  
    //dodajInputPolja
    it('VjezbaAjax.dodajInputPolja ok', function() {
        DOMelementDIVauFormi = document.getElementById("containerTest");
        DOMelementDIVauFormi.innerHTML = "";
        VjezbeAjax.dodajInputPolja(DOMelementDIVauFormi, 5);
        sviTu = true;
        for(var i = 0; i < 5; i++) {
            v_i = document.getElementById("z"+i);
            if(v_i == null) {
                sviTu = false;
                break;
            }
            if(v_i.value != 4) {
                sviTu = false;
                break;
            }
        }
        sviTu.should.equal(true);
    });

    //dodajInputPolja
    it('VjezbaAjax.dodajInputPolja proslijedjen broj veci od 15', function() {
        DOMelementDIVauFormi = document.getElementById("containerTest");
        DOMelementDIVauFormi.innerHTML = "";
        VjezbeAjax.dodajInputPolja(DOMelementDIVauFormi, 19);
        sviTu = true;
        for(var i = 0; i < 19; i++) {
            v_i = document.getElementById("z"+i);
            if(v_i != null) {
                sviTu = false;
                break;
            }
        }
        sviTu.should.equal(true);
    });


  //GET
  it('VjezbaAjax.dohvatiPodatke vraca ok podatke', function(done) {
    var data = {
        brojVjezbi: 3,
        brojZadataka: [1,2,3]
    }
    var dataJson = JSON.stringify(data);
   
    VjezbeAjax.dohvatiPodatke(function(error, result) {
      result.should.deep.equal(data);
      done();
    });
   
    this.requests[0].respond(200, { 'Content-Type': 'text/json' }, dataJson);
  });

  it('VjezbaAjax.dohvatiPodatke greska', function(done) {
    var data = {
        brojVjezbi: 3,
        brojZadataka: [1,2,3]
    }
    var dataJson = JSON.stringify(data);
   
    VjezbeAjax.dohvatiPodatke(function(error, result) {
        error.should.equal("Internal Server Error");
        if(result == null) 
            result = "Doesn't Exist";
        result.should.equal("Doesn't Exist");
      done();
    });
   
    this.requests[0].respond(500, { 'Content-Type': 'text/json' }, dataJson);
  });

  //POST
  it('VjezbaAjax.posaljiPodatke ok podaci', function() {
    var data = {
        brojVjezbi: 3,
        brojZadataka: [1,2,3]
    }
    var dataJson = JSON.stringify(data);
   
    VjezbeAjax.posaljiPodatke(data, function() { });
   
    this.requests[0].requestBody.should.equal(dataJson);
  });

    it('VjezbaAjax.posaljiPodatke greska', function() {
        var data = {
            brojVjezbi: 5,
            brojZadataka: [1,2,3]
        }
        var dataJson = JSON.stringify(data);
        
        VjezbeAjax.posaljiPodatke(data, function(error, result) {
            error.should.equal("Internal Server Error");
            if(result == null) 
                result = "Doesn't Exist";
            result.should.equal("Doesn't Exist");
            });
        
        this.requests[0].respond(500, { 'Content-Type': 'text/json' }, null);
    });


    //iscrtajVjezbe
    it('VjezbaAjax.iscrtajVjezbe ok', function() {
        divDOMelement = document.getElementById("containerTest");
        divDOMelement.innerHTML = "";
        var data = {
            brojVjezbi: 3,
            brojZadataka: [1,2,3]
        }
        //var dataJson = JSON.stringify(data);
        VjezbeAjax.iscrtajVjezbe(DOMelementDIVauFormi, data);
        sviTu = true;
        for(var i = 0; i < 3; i++) {
            divVjezba = document.getElementById("divVjezba"+(i+1));
            v_i = document.getElementById("v"+(i+1));
            if(v_i == null || divVjezba == null) {
                sviTu = false;
                break;
            }
        }
        sviTu.should.equal(true);
    });

    //iscrtajVjezbe
    it('VjezbaAjax.iscrtajVjezbe error', function() {
        divDOMelement = document.getElementById("containerTest");
        divDOMelement.innerHTML = "";
        var data = {
            brojVjezbi: 11,
            brojZadataka: [1,2,3,4,5,6,7,8,9,10,11]
        }
        //var dataJson = JSON.stringify(data);
        VjezbeAjax.iscrtajVjezbe(DOMelementDIVauFormi, data);
        sviTu = true;
        for(var i = 0; i < 11; i++) {
            v_i = document.getElementById("v"+(i+1));
            if(v_i != null) {
                sviTu = false;
                break;
            }
        }
        sviTu.should.equal(true);
    });

    //iscrtajZadatke
    it('VjezbaAjax.iscrtajZadatke ok', function() {
        vjezbaDOMelement = document.getElementById("containerTest");
        vjezbaDOMelement.innerHTML = "";

        //var dataJson = JSON.stringify(data);
        VjezbeAjax.iscrtajZadatke(vjezbaDOMelement, 5);
        sviTu = true;
        for(var i = 0; i < 5; i++) {
            z_i = document.getElementById("zadatak"+(i+1));
            if(z_i == null) {
                sviTu = false;
                break;
            }
        }
        sviTu.should.equal(true);
    });

        //iscrtajZadatke
        it('VjezbaAjax.iscrtajZadatke error', function() {
            vjezbaDOMelement = document.getElementById("containerTest");
            vjezbaDOMelement.innerHTML = "";
    
            //var dataJson = JSON.stringify(data);
            VjezbeAjax.iscrtajZadatke(vjezbaDOMelement, 80);
            sviTu = true;
            for(var i = 0; i < 80; i++) {
                z_i = document.getElementById("zadatak"+(i+1));
                if(z_i != null) {
                    sviTu = false;
                    break;
                }
            }
            sviTu.should.equal(true);
        });


});