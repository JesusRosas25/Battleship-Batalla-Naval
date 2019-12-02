
let gridInfo = "";
let params = new URLSearchParams(location.search)
let gp = params.get('gp')
let player
let opponent
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
  
  
})

.catch(error =>console.log(error))
}
function shots(){
  fetch(`/api/game_view/${gpId}`)
  .then(res=> {
    res.json();

  }).then(json=>{
    gridInfo = json;

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

    ships.push({type: 'carrier', locations: getShipsLocations('carrier')})
    ships.push({type: 'battleship', locations: getShipsLocations('battleship')})
    ships.push({type: 'submarine', locations: getShipsLocations('submarine')})
    ships.push({type: 'destroyer', locations: getShipsLocations('destroyer')})
    ships.push({type: 'patrol_boat', locations: getShipsLocations('patrol_boat')})

    return ships
}

//Realiza el POST de los barcos en la base de datos
function sendShips(){

    param= new URLSearchParams(window.location.search)
    getGpId(url)
    url="/api/games/players/"+getGpId(url)+"/ships"
    data= setShipsPos()
    
    fetch(url, {
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
            restoringShips();
            getShipsPositions();
            getGameData(getGpId(url));
            document.getElementById('in-position').style.display= 'none'
          
            
        }).catch(function(error){
            console.log(error.message)
        }).then(function(json){
            
            document.querySelector("#display").innerText = 'error!!!'
            
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
function sendSalvos(){

  param= new URLSearchParams(window.location.search)
  getGpId(url)
  url="/api/games/players/"+getGpId(url)+"/salvoes"
  data= setSalvoesPos()
  
  fetch(url, {
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
          shots()
          document.getElementById('fire').style.display= 'block'
        
          
      }).catch(function(error){
          console.log(error.message)
      }).then(function(json){
          
          document.querySelector("#display").innerText = 'error!!!'
          
      })
}
//muestra el boton para los salvos
function showButton(){
  if(gridInfo){
      document.getElementById('fire').style.display= 'block'
      
  }else{
    document.querySelector("#display").innerText = 'error!!!'
      
  }
}