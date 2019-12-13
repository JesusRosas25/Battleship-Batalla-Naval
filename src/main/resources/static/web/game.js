let data;
let gridInfo = []
let params = new URLSearchParams(location.search)
let gp = params.get('gp')
let player
let opponent
let salvoes = {}

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
  gridInfo = json
  getPlayerId(gpId)
  getShips(gridInfo.ships)
  setSalvoes(gridInfo.salvoes)
  getShots(gridInfo.salvoes)
})

.catch(error =>console.log(error))
}
//Actualiza el juego despues de cada disparo
function afterShot(){
  fetch("/api/games_view/"+gp)
  .then(function(response){
    if (response.ok) {

      return response.json();
    }
  })
  .then(function(json){
      gridInfo = json;
      console.log(gridInfo.salvoes)
      setSalvoes(gridInfo.salvoes);
      document.getElementById('in-position').style.display= 'none'
      //esperaAlRival()
  })
}
function getShips(ships){
  if(ships.length !== 0){
    document.getElementById('in-position').style.display= 'none'
  ships.forEach(ship => {

    createShips(ship.type,
      ship.locations.length,
      ship.locations[0][0] == ship.locations[1][0] ? "horizontal": "vertical" ,
    document.getElementById(`ships${ship.locations[0]}`),
    true
  )
  })
}else{
    createShips('carrier', 5, 'horizontal', document.getElementById('dock'),false)
createShips('battleship', 4, 'horizontal', document.getElementById('dock'),false)
createShips('submarine', 3, 'horizontal', document.getElementById('dock'),false)
createShips('destroyer', 3, 'horizontal', document.getElementById('dock'),false)
createShips('patrol_boat', 2, 'horizontal', document.getElementById('dock'),false)
document.getElementById('in-position').style.display= 'block'
  }
}
 //Muestra los impactos y barcos en las grillas 
function setSalvoes(salvoes){

  salvoes.forEach(salvo => salvo.locations.forEach( loc => {
    if(player.id == salvo.playerId){
      document.getElementById("salvoes"+loc).style.background = "red"
      document.getElementById("salvoes"+loc).dataset.salvoJson = true
    }else{
      document.getElementById("ships"+loc).style.background = "red"
    }


    
  }))

}

//deberia crear los salvos
function getShots(salvoes){
	if(salvoes.length !== 0){
	document.getElementById('fire').style.display = 'block'
	salvoes.forEach(salvo => {
	createSalvoes(salvo.parent, salvo.locations[0][0] == salvo.locations[1][0],document.getElementById(`salvoes${salvo.locations[0]}`))
	})
	
	}else{
    createSalvoes(document.getElementById('dock'),false)
createSalvoes( document.getElementById('dock'),false)
createSalvoes(document.getElementById('dock'),false)
createSalvoes(document.getElementById('dock'),false)
createSalvoes( document.getElementById('dock'),false)
}
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


//Realiza el POST de los barcos en la base de datos
function sendShips(){
  param= new URLSearchParams(window.location.search)
  currentGP= param.get('gp')
  url="/api/games/players/"+currentGP+"/ships"
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
          getGameData()
          
          document.getElementById('in-position').style.display= 'none'
        
          
      }).catch(function(error){
          console.log(error.message)
      }).then(function(json){
          console.log("error")
          
          
      })
}
//Devuelve la ubicacion de los barcos
function getShipsLocations(tipo){
  let cells= document.querySelectorAll(`.${tipo}-busy-cell`)
  let locations= []

  cells.forEach(cell => locations.push(`${cell.dataset.y}${cell.dataset.x}`))

  return locations

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
//Restablece la ubicacion de los barcos en la grilla
function restoringShips(){
  document.getElementById('carrier').remove()
  document.getElementById('battleship').remove()
  document.getElementById('submarine').remove()
  document.getElementById('destroyer').remove()
  document.getElementById('patrol_boat').remove()
}


//Realiza el POST de los salvoes en la base de datos
function sendSalvoes(){
  let salvoes = document.querySelectorAll("div[data-salvo]")
  let locationSalvo = []
  if(salvoes != null && salvoes.length == 5){
    salvoes.forEach(e=>locationSalvo.push(e.dataset.y+e.dataset.x))
  
  param= new URLSearchParams(window.location.search)
  currentGP= param.get('gp')
  url="/api/games/players/"+currentGP+"/salvoes"
  console.log(url)
  fetch(url, {
    method: "POST",
    body: JSON.stringify(locationSalvo),
    headers: {
      "Content-Type": 'application/json'
    }    
    })
      .then(function(response){
          if(response.ok){
            console.log("nice")
            document.querySelectorAll("div[data-salvo]").forEach(e=>{
              e.removeAttribute("data-salvo")
              e.style.background = ""
            })
            afterShot()
              /*return response.json()*/
          }else{
             /* return Promise.reject(response.json())*/
          }
      })
      /*
      .then(function(json){
        
        /*
        disableAimed()
        afterShot()
          document.getElementById('available_salvo').remove()
          document.getElementById('fire').style.display= 'block'
          
          */
         /*
      }).catch(function(json){
        return json;
          
      }).then(function(json){
        console.log("errorMsg")
          document.querySelector("#display").innerText = 'error!!!'
          
      })
      */
    }
}
//LE QUITA LA CLASE AIMED A LAS CELDAS DONDE SE DISPARO
/*function disableAimed(){
  let inSight= document.querySelectorAll('.aimedSalvo')

  inSight.forEach(singht => singht.classList.remove('aimedSalvo'))
}*/

celdaActivas()
function celdaActivas(){
  document.querySelectorAll("#gridSalvo div[data-y]").forEach(e=>e.addEventListener('click',addSalvos))
}

function addSalvos(event){
  let clickCelda = event.target
  let salvosInGrid = document.querySelectorAll("div[data-salvo]")
  if(salvosInGrid != undefined && salvosInGrid.length < 5 && clickCelda.dataset.salvoJson == undefined){
    clickCelda.style.background = "red"
    clickCelda.dataset.salvo = true;
  }
  console.log(document.querySelectorAll("div[data-salvo]"))
}

//recarga los datos del juego
var recharge

function waitOpponent(){
    recharge= setTimeout(function() { 
                                rechargeGridInfo()
                                }, 6000);
}

function getTurn (){
  var array=[]
  var turn = 0;

  gridInfo.salvoes.map(function(salvo){
    if(salvo.player == getGameData.id){
      array.push(salvo.turn);
    }
  })
  turn = Math.max.apply(Math, arr);
  
  if (turn == -Infinity){
    return 1;
  } else {
    return turn + 1;
  }
  
}


























/*
let gridInfo = "";

let params = new URLSearchParams(location.search)
let gp = params.get('gp')
let player
let opponent
let salvoes





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
  getSalvoes(gridInfo.salvoes)
  getShips(gridInfo.ships)
  
})

.catch(error =>console.log(error))
}



//Actualiza los datos del juego
function getShipsPos(){
  fetch(`/api/games_view/${gpId}`)
  .then(function(response){
    return response.json();

  }).then(function(json){
    gridInfo = json; 
    
    //setShips(gridInfo.ships)
  })
}


//Funcion para los id de gamePlayer
function getGpId(gp){
    var newGp = gp.slice(gp.indexOf("=")+1);
    return newGp;
}

var url = window.location.href;
getGameData(getGpId(url))

//Trae los barcos a la grilla
function getShips(gridInfo){
  if(gridInfo.ships.length !== 0){
    document.getElementById('in-position').style.display= 'none'
  ships.forEach(ship => {

    createShips(ship.type,
      ship.locations.length,
      ship.locations[0][0] == ship.locations[1][0] ? "horizontal": "vertical" ,
    document.getElementById(`ships${ship.locations[0]}`),true)
  })
}
else{
 

}
}

//Trae los salvoes a la grilla 
function getSalvoes(salvoes){

  salvoes.forEach(salvo => salvo.locations.forEach( loc => {
    if(player.id == salvo.playerId){
      document.getElementById("salvoes"+loc).style.background = "red"
    }else{
      document.getElementById("ships"+loc).style.background = "red"
    }


    
  }))

}

//ubica los barcos en la grilla
/*function setShips(ships){
for (i=0;i<gridInfo.length;i++){


    let shipType = ships[i].type
    let shipLoc = ships[i].location

    let orientation 

    if(shipLoc[0][0] == shipLoc[1][0]){
        orientation = "horizontal"
    } else {
        orientation = "vertical"
    }

    createShips(shipType,shipLoc.length, orientation, document.getElementById("ships"+shipLoc[0]), true )


}

}*/
/*(json){
  if(json.ships.length !== 0){
    document.getElementById('in-position').style.display= 'none'
    
      for(let i = 0; i < json.ships.length;i++){
        let location = json.ships[i].locations[0]
        let orientation = json.ships[i].locations[0].substring(1) == json.ships[i].locations[1].substring(1) ? 'vertical' : 'horizontal'
        let tipo = json.ships[i].type
        let size = json.ships[i].locations.length
        createShips(tipo.toLowerCase(), size, orientation, document.getElementById('ships'+location),true)
        //createShips(type.toLowerCase(), getShipLength(obj.ships[ship].ship), getOrientation(obj.ships[ship].locations), document.getElementById(`ships${obj.ships[ship].locations[0]}`), true);
    }else{
        createShips('carrier', 5, 'horizontal', document.getElementById('dock'),false)
        createShips('battleship', 4, 'horizontal', document.getElementById('dock'),false)
        createShips('submarine', 3, 'horizontal', document.getElementById('dock'),false)
        createShips('destroyer', 3, 'horizontal', document.getElementById('dock'),false)
        createShips('patrol_boat', 2, 'horizontal', document.getElementById('dock'),false)
        document.getElementById('in-position').style.display= 'none'  
      
}
}
*/