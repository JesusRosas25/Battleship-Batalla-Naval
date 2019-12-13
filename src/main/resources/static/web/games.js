var pos= {
"board": []
}
let buttons = [];


var app = new Vue({
  el: "#app",
  data: {
      player: [],
        jsongames: [],
        posPlayer: pos
  }
})

//funcion para los botones 
function bottons(inlogin){
  switch(inlogin){
      case true:
          document.getElementById('login-button').style.display='none'
          
          
          break;
      case false:
          document.getElementById('login-button').style.display='none'
          document.querySelector('close').disable=false
          break;
      
  }
}


//funcion para hacer el fetch de games
function getData(){
 pos.board = [];
  fetch("/api/games").then(function(response){if(response.ok){return response.json()}
}).then(function (json){
    jsongames = json;
    app.player = json.player
      createPos();
      createGames();
      bottons();
      
    });
  }
getData();

//funcion para recorrer games y traer los scores
function createPos (){
  let tabla= document.getElementById('leaders');
  let str= ""
for(var i in jsongames.games){ 
  for(var j in jsongames.games[i].gamePlayer){
        
              var obj = new Object();
              
              obj.userName = jsongames.games[i].gamePlayer[j].player.username;
              obj.points = jsongames.games[i].gamePlayer[j].player.points;
              obj.won = 0;
              obj.lost = 0;
              obj.tied = 0;
              pos.board.push(obj);
              
              createScore();
              str += `<tr>
          <td>${obj.userName}</td>
          <td>${jsongames.games[i].gamePlayer[j].player.points}</td>
          <td>${obj.won}</td>
          <td>${obj.tied}</td>
          <td>${obj.lost}</td>
      </tr>`
          }
          tabla.innerHTML = str;
          //createScore(jsongames.games[i].gamePlayer[j].player.score, jsongames.games[i].gamePlayer[j].player.id);
          //console.log( '%c jsongames.games[i].gamePlayer[j].player.score', ' color: #156c77; font-weight: bold; ' );
          
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
      gms += `<li><a href="/web/game.html?gp=${tableArray[i].gamePlayer[gp].id}"><button id="gp_${tableArray[i].gamePlayer[gp].id}" class="btn btn-danger" type="button" ><span class="spinner-grow spinner-grow-sm"></span>Enter!</button></a></li>`
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




