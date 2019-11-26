let data
let gridInfo
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
  gridInfo = json
  getPlayerId(gpId)
  getShips(gridInfo.ships)
  getSalvoes(gridInfo.salvoes)
})

.catch(error =>console.log(error))
}

function getShips(ships){
  ships.forEach(ship => {

    createShips(ship.type,
      ship.locations.length,
      ship.locations[0][0] == ship.locations[1][0] ? "horizontal": "vertical" ,
    document.getElementById(`ships${ship.locations[0]}`),
    true
  )
  })
}
  
function getSalvoes(salvoes){

  salvoes.forEach(salvo => salvo.locations.forEach( loc => {
    if(player.id == salvo.playerId){
      document.getElementById("salvoes"+loc).style.background = "red"
    }else{
      document.getElementById("ships"+loc).style.background = "red"
    }


    
  }))

}


function getPlayerId(gpId){
  for (var i in gridInfo.gamePlayer){
      if (gpId == gridInfo.gamePlayer[i].id){
          $("#gamer1").html(gridInfo.gamePlayer[i].player.firstName )
        player = gridInfo.gamePlayer[i].player
          
        }else {
          $("#gamer2").html(" "+gridInfo.gamePlayer[i].player.firstName+ "")
          opponent = gridInfo.gamePlayer[i].player
      
  }
}
}

function getShips(){
  fetch('/games/players/{gamePlayerId}/ships',{method: 'POST',})
    .then
  },})
}

