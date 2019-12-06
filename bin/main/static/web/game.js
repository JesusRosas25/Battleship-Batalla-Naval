
let gridInfo = "";
let params = new URLSearchParams(location.search)
let gp = params.get('gp')
let player
let opponent
var getGameData;


//toma el ID de gamePlayer
function getParamGP(){
	
	let param= (new URL(document.location)).searchParams;
	let gp= parseInt(param.get('gp'));

	return gp;
}

getGameData(gp)

function getGameData(gpId){

fetch("/api/games_view/"+getParamGP())
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
  
  
})

.catch(error =>console.log(error))
}
//Actualiza los datos del juego
function getShipsPos(){
  fetch("/api/games_view/"+getParamGP())
  .then(function(response){
    return response.json();

  }).then(function(json){
    gridInfo = json; 
    setShips(gridInfo)
  })
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
function getGpId(gp){
    var newGp = gp.slice(gp.indexOf("=")+1);
    return newGp;
}

var url = window.location.href;
getGameData(getGpId(url))


//ubica los barcos en la grilla
function setShips(json){
  if(json.ships.length !== 0){
    document.getElementById('in-position').style.display= 'none'
    
      for(let i = 0; i < json.ships.length;i++){
        let location = json.ships[i].locations[0]
        let orientation = json.ships[i].locations[0].substring(1) == json.ships[i].locations[1].substring(1) ? 'vertical' : 'horizontal'
        let tipo = json.ships[i].type
        let size = json.ships[i].locations.length
        createShips(tipo.toLowerCase(), size, orientation, document.getElementById('ships'+location),true)
        //createShips(type.toLowerCase(), getShipLength(obj.ships[ship].ship), getOrientation(obj.ships[ship].locations), document.getElementById(`ships${obj.ships[ship].locations[0]}`), true);
    

document.getElementById('in-position').style.display= 'none'  
}
}
}


//Devuelve la ubicacion de los barcos
function getShipsLocations(tipo){
    let cells= document.querySelectorAll(`.${tipo}-busy-cell`)
    let locations= []

    cells.forEach(cell => locations.push(`${cell.dataset.y}${cell.dataset.x}`))

    return locations

}


//Obtiene los players para mostrarlos en pantalla
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
//Crea un objeto con las ubicaciones de los barcos
function setShipsPos(){
    let ships= [];

    ships.push({type: 'CARRIER', locations: getShipsLocations('carrier')})
    ships.push({type: 'BATTLESHIP', locations: getShipsLocations('battleship')})
    ships.push({type: 'SUBMARINE', locations: getShipsLocations('submarine')})
    ships.push({type: 'DESTROYER', locations: getShipsLocations('destroyer')})
    ships.push({type: 'PATROL_BOAT', locations: getShipsLocations('patrol_boat')})

    return ships
}

//Realiza el POST de los barcos en la base de datos
function sendShips(){

    param= new URLSearchParams(window.location.search)
    getGpId(gp)
    url="/api/games/players/"+getGpId(gp)+"/ships"
    data= setShipsPos()
    
    fetch(url,{
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": 'application/json'
      }
      })
        .then(function(response){
            if(response.ok){
                return response.json()
            }else{
                return Promise.reject(response.json())
            }
        }).then(function(json){
            restoringShips()
            getShipsPos()
            
            document.getElementById('in-position').style.display= 'none'
          
            
        }).catch(function(error){
            console.log(error.message)
        }).then(function(json){
            console.log("error")
            
            
        })
}

//Restablece la ubicacion de los barcos en la grilla
function restoringShips(){
    document.getElementById('carrier').remove()
    document.getElementById('battleship').remove()
    document.getElementById('submarine').remove()
    document.getElementById('destroyer').remove()
    document.getElementById('patrol_boat').remove()
}

//Realiza el POST de los salvoes en la base de datos
function sendSalvoes(shots,gamePlayerId){

  param= new URLSearchParams(window.location.search)
  getGpId(gp)
  url="/api/games/players/"+getGpId(gp)+"/salvoes"
  
  
  fetch(url, {
    method: "POST",
    body: JSON.stringify(shots),
    headers: {
      "Content-Type": 'application/json'
    }    
    })
      .then(function(response){
          if(response.ok){
              return response.json()
          }else{
              return Promise.reject(response.json())
          }
      }).then(function(json){
        getShipsPos()
          document.getElementById('available_salvo').remove()
          document.getElementById('fire').style.display= 'block'
          
          
      }).catch(function(json){
        return json;
          
      }).then(function(json){
        console.log("errorMsg")
          document.querySelector("#display").innerText = 'error!!!'
          
      })
}

//recarga los datos del juego
var recharge

function waitOpponent(){
    recharge= setTimeout(function() { 
                                rechargeGridInfo()
                                }, 6000);
}
