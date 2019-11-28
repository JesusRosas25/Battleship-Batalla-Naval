
let gridInfo
let params = new URLSearchParams(location.search)
let gp = params.get('gp')
let player
let opponent
let salvoes
var getGameData;

getGameData(gp)

function getGameData(gpId){

fetch(`/api/games_view/${gpId}`)
.then(res => {
  if(res.ok){
    return res.json()
  }else{
    throw new Error(res.statusText)
  } 
})
.then(json=>{
  gridInfo = json;
  getPlayerId(gpId);
  getShips(gridInfo.ships);
  getSalvoes(gridInfo.salvoes);
  
})

.catch(error =>console.log(error))
}

//function para desloguearse
$("#logoutbtn").click(function(){
        $.post("/api/logout").done(function(){
            window.location.replace("/web/games.html");
        })
    })

var url = window.location.href;
//boton atras
$("#back").click(function(){
  window.location.replace("/web/games.html");
})
//Funcion para los id de gamePlayer
function getGpId (gp){
    var Gp = gp.slice(gp.indexOf("=")+1);
    return Gp;
}

var url = window.location.href;
getGameData(getGpId(url))

//Devuelve la ubicacion de los barcos
function getShipsLocations(tipo){
    let cells= document.querySelectorAll(`.${tipo}-busy-cell`)
    let locations= []

    cells.forEach(cell => locations.push(`${cell.dataset.y}${cell.dataset.x}`))

    return locations

}
/*function getShips(ships){
  ships.forEach(ship => {
    createShips(ship.type,
      ship.locations.length,
      ship.locations[0][0] == ship.locations[1][0] ? "horizontal": "vertical" ,
      
    document.getElementById(`ships${ship.locations[0]}`),
    true
  )
  })
}*/
/*function getSalvoes(salvoes){

  salvoes.forEach(salvo => salvo.locations.forEach( loc => {
    if(player.id == salvo.playerId){
      document.getElementById("salvoes"+loc).style.background = "red"
    }else{
      document.getElementById("ships"+loc).style.background = "red"
    }
 
  }))

}*/


function getPlayerId(gpId){
  for (var i in gridInfo.gamePlayer){
      if (gpId == gridInfo.gamePlayer[i].id){
          $("#gamer1").html(gridInfo.gamePlayer[i].player.username)
        player = gridInfo.gamePlayer[i].player
          
        }else {
          $("#gamer2").html(gridInfo.gamePlayer[i].player.username)
          opponent = gridInfo.gamePlayer[i].player
      
  }
}
}
//CREA UN OBJETO CON LAS UBICACIONES DE LOS BARCOS
function setShipsPositions(){
    let ships= [];

    ships.push({type: 'carrier', locations: getShipsLocations('carrier')})
    ships.push({type: 'battleship', locations: getShipsLocations('battleship')})
    ships.push({type: 'submarine', locations: getShipsLocations('submarine')})
    ships.push({type: 'destroyer', locations: getShipsLocations('destroyer')})
    ships.push({type: 'patrol_boat', locations: getShipsLocations('patrol_boat')})

    return ships
}

//REALIZA EL POST EN LA DB CON LOS BARCOS POSICIONADOS
function sendShips(){

    param= new URLSearchParams(window.location.search)

    url="/api/games/players/"+getGpId(url)+"/ships"
    data= setShipsPositions()
    
    fetch(url, {method: "POST", 
    body: JSON.stringify(data),
    dataType: "text",
    ContentType: 'application/json'})
        .then(function(response){
            if(response.ok){
                return response.json()
            }else{
                return Promise.reject(response.json())
            }
        }).then(function(json){
            redrawShips();
            getShipsPositions();
            getGameData(getGpId(url));
            document.getElementById('in-position').style.display= 'none'
          
            
        }).catch(function(error){
            console.log(error.message)
        }).then(function(json){
            
            document.querySelector("#display p").innerText = 'error'
            
        })
}

//QUITA LOS BARCOS DE LA GRILLA PARA VOLVER A DIBUJARLOS ESTATICOS
function redrawShips(){
    document.getElementById('carrier').remove()
    document.getElementById('battleship').remove()
    document.getElementById('submarine').remove()
    document.getElementById('destroyer').remove()
    document.getElementById('patrol_boat').remove()
}

/*function addShips(){
$.post({
  url: "/api/games/players/"+getGpId(url)+"/ships", 
  data: JSON.stringify(json),
  dataType: "text",
  contentType: "application/json"
})
.done(function () {
  console.log("done");
  getGameData(getGpId(url));
})
.fail(function () {
  console.log("fail");

})

$("#in-position").click(function(){
    var obj = new Object();
    var arr = [];
    if($(this).attr("data-gs-width") != "1"){
      for(var i = 0; i < parseInt($(this).attr("data-gs-width")); i++){
        arr.push(String.fromCharCode(parseInt($(this).attr("data-gs-y"))+65)+(parseInt($(this).attr("data-gs-x"))+i+1).toString());
      }
    } else{
      for(var i = 0; i < parseInt($(this).attr("data-gs-height")); i++){
        arr.push(String.fromCharCode(parseInt($(this).attr("data-gs-y"))+i+65)+(parseInt($(this).attr("data-gs-x"))+1).toString());
      }
    }
    
    obj.type = $(this).children();
    obj.cells = arr;
    data.push(obj);
  })
  addShips(); 
}*/
