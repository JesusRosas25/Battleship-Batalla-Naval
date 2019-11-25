var pos= {
"board": []
}
let buttons = [];
let scores = [];
let player =[];
var app = new Vue({
  el: "#app",
  data: {
      
        jsongames: [],
        posPlayer: pos
  }
})

function bottons(inlogin){
  switch(inlogin){
      case true:
          document.getElementById('login-button').style.display='none'
          document.getElementById('loginMod').style.display= 'none'
          document.getElementById('loginModal').style.display= 'block'
          break;
      case false:
          document.getElementById('login-button').style.display='none'
          document.querySelector('close').disable=false
          break;
      
  }
}


//funcion para hacer el fetch de games
function getData(){
  
  fetch("/api/games").then(function(response){if(response.ok){return response.json()}
}).then(function (json){
    jsongames = json;
      createPos();
      createScore();
      createGames();
      bottons();
      
    });
  }
getData();

//funcion para recorrer games y traer los scores
function createPos (){
for(var i = 0; i< jsongames.length; i++){ 
  for(var j = 0; j < gamePlayer[i].length; j++){
    for(var k = 0; k < players[j].length; k++){
  var rev = pos.board.find(function(player){ return players.id == games[i].gamePlayer[j].players.id });
          if (rev == undefined){
              var obj = new Object();
              
              obj.userName = games[i].gamePlayer[j].players.userName;
              obj.creationDate = games[i].creationDate;
              obj.points = 0;
              obj.won = 0;
              obj.lost = 0;
              obj.tied = 0;
              pos.board.push(obj);
          }
          createScore(games[i].gamePlayer[j].players.score, games[i].gamePlayer[j].player.id, games[i].creationDate);

        }
      }
    }    
  }
    


//funcion para calcular los scores
function createScore (score, playerId){
    pos.board.map(function(boar){
        if ( playerId == boar.id ){
            boar.points += score;
            if (score === 1.0){
                boar.won += 1;
            } else if (score === 0.0){
                boar.lost += 1;
            } else if (score === 0.5){
                boar.tied += 1;
            }
            
        }
    })
}
//funcion para ingresar 
$("#login-button").click(login);
function login(){ 
  if(!$("#username-form").val() || !$("#pssword").val() ){
    $("#newUser").html("Empty fields");  
  } else {
        $.post("/api/login", { username: $("#username-form").val(), password: $("#pssword").val()})
        .done(function(){
          $("#newUser").html("");
          $("#loginModal");
          inlogin= true;
          bottons(inlogin);
          getData();
          alert("Welcome")
          
                      })          
                      .fail(function(){
                        alert("Wrong username or password")
                    })
    }
}
//funcion para registrar un nuevo usuario
$("#signup").click(registerNewUser)
function registerNewUser(){
  if(!$("#username-reg").val() || !$("#userpssword").val()){
    $("#newUser").html("Empty fields");
  }else{
      $.post("/api/players",{ username: $("#username-reg").val(), password: $("#userpssword").val()})
              
      .done(function(){
        $("#newUser").html("");
        $("#modal-register");
        getData();
                })
                .fail(function(error){
                  alert("SingUp Fail!")
                })
}
}

//funcion para desloguearse
    $("#logoutbtn").click(logout);
  function logout(){
fetch('/api/logout',{method: 'POST',})
.then(function(response){
  if(response.ok){
    console.log('Successful')
    $('#logoutbtn'). modal('hide')
    inlogin= true;
    bottons(inlogin);
    getData();
  }else{
    console.log('error with the logging')
  }
}).catch(function(error){
  console.log(error.message)
})
}
  
//Funcion para cargar los juegos, botones y volver a ingresar al juego 
function createGames() {
  let gboard= document.getElementById('tableGames');
  let gms="";
  
  let tableArray = jsongames.games.reverse()

  for (let i=0;i<jsongames.games.length;i++){
    
      gms += `<li>Creation Date: ${tableArray[i].creationDate}</li><ul>`;
          
      if(tableArray[i].gamePlayer.length === 2){
      for (gp in tableArray[i].gamePlayer){
      gms += `<li>Player: ${tableArray[i].gamePlayer[gp].player.username}</li>`;
      
      if(jsongames.player.id === tableArray[i].gamePlayer[gp].player.id){
      gms += `<li><a href="/web/game.html?gp=${tableArray[i].gamePlayer[gp].id}"><button id="gp_${tableArray[i].gamePlayer[gp].id}" class="btn btn-danger" type="button" ><span class="spinner-grow spinner-grow-sm"></span>Enter!</button></li></a>`
      }
      }
          }
          if(tableArray[i].gamePlayer.length === 1){
              for (gp in tableArray[i].gamePlayer){
                  gms += `<li>Player: ${tableArray[i].gamePlayer[gp].player.username}</li>`;
                  
                  if(jsongames.player.id === tableArray[i].gamePlayer[gp].player.id){
                      gms += `<li><a href="/web/game.html?gp=${tableArray[i].gamePlayer[gp].id}"><button id="gp_${tableArray[i].gamePlayer[gp].id}" class="btn btn-danger" type="button" ><span class="spinner-grow spinner-grow-sm"></span>Enter!</button></a></li>`
                  }else{
                      if(tableArray[i].player !== "guest"){
                          gms += `<li><button id="g_${tableArray[i].id}" data-gameid="${tableArray[i].id}" class="btn btn-success" type="button" onclick="joinGame(this)" ><span class="spinner-border spinner-border-sm"></span>Join!</button></li>`
                      }
                  }
              }
          }    
      gms+= `</ul>`;
  }

  gboard.innerHTML= gms;
}

//crea un nuevo game


function createGame(){

    if(jsongames.player !== "guest"){

        $.post("/api/games")
            .then(function(data){
              window.location.href = "/web/game.html?gp="+data.gpId;
                return response.json();
                    
            }
            ).fail(function(){
                console.log(error.message)
                alert ("Error for create new game!")
            })

      

    }
}
//funcion para unirse a un juego
function joinGame(gameId){

  let id= gameId.getAttribute('data-gameid')

  fetch(`/api/games/${id}/players`,{method: "POST"})
      .then(function(response){
          if(response.ok){
              return response.json()
        }else{
          return promise.reject(response.json())
        }
      })
        .then(function(data){
          let gpId= data["GamePLayerId"]
          window.location.href= "/web/game.html?gp="+data.gpId
      }).then(function(json){
          return json;
      }).catch(function(json){
          errorMsg= json['Error'];
          console.log(errorMsg)
          alert("Error for join")
         
      })
    }



