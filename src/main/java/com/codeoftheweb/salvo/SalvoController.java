package com.codeoftheweb.salvo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api")
public class SalvoController {


    private GameRepository gameRepository;
    private PlayerRepository playerRepository;
    private GamePlayerRepository gamePlayerRepository;
    private ScoreRepository scoreRepository;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Autowired
    SalvoController(GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, PlayerRepository playerRepository, ScoreRepository scoreRepository, ShipRepository shipRepository) {
        this.gameRepository = gameRepository;
        this.gamePlayerRepository = gamePlayerRepository;
        this.playerRepository = playerRepository;
        this.scoreRepository = scoreRepository;

    }

    @GetMapping("/games")
    public Map<String, Object> getGames(Authentication authentication) {
        Map<String, Object> dto = new HashMap<>();
        if (!this.isGuest(authentication))
            dto.put("player", playerRepository.findByUserName(authentication.getName()).playersDTO());
        else
            dto.put("player", "Guest");
        dto.put("games", gameRepository.findAll().stream().map(Game::gamesDTO).collect(Collectors.toList()));
        return dto;
    }

    @RequestMapping(path = "/games", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createGame(Authentication authentication) {
        ResponseEntity<Map<String, Object>> response;
        if (isGuest(authentication)) {
            response = new ResponseEntity<>(makeMap("Error", "You must be logged in first"), HttpStatus.UNAUTHORIZED);
        } else {
            Player player = playerRepository.findByUserName(authentication.getName());
            Game newGame = gameRepository.save(new Game(LocalDateTime.now()));
            GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(newGame, player, newGame.getCreationDate()));

            response = new ResponseEntity<>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
        }
        return response;
    }

    @RequestMapping(path = "/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> createUser(@RequestParam String username, @RequestParam String password) {
        ResponseEntity<Map<String, Object>> response;
        Player player = playerRepository.findByUserName(username);
        if (username.isEmpty() || password.isEmpty()) {
            response = new ResponseEntity<>(makeMap("error", "userName is requerid"), HttpStatus.CONFLICT);
        } else if (player != null) {
            response = new ResponseEntity<>(makeMap("error", "userName already exists"), HttpStatus.CONFLICT);
        } else {
            Player newPlayer = playerRepository.save(new Player(username, passwordEncoder.encode(password)));
            response = new ResponseEntity<>(makeMap("id", newPlayer.getId()), HttpStatus.CREATED);
        }
        return response;

    }

    @RequestMapping(path = "/games/{gameId}/players", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> joinGame(Authentication authentication, @PathVariable long gameId) {
        ResponseEntity<Map<String, Object>> response;
        if (isGuest(authentication)) {
            response = new ResponseEntity<>(makeMap("Error", "you must logged in first"), HttpStatus.UNAUTHORIZED);
        } else {
            Game game = gameRepository.findById(gameId).orElse(null);
            if (game == null) {
                response = new ResponseEntity<>(makeMap("error", "no such game"), HttpStatus.NOT_FOUND);
            } else if (game.getGamePlayers().size() > 1) {
                response = new ResponseEntity<>(makeMap("error", "game is full"), HttpStatus.FORBIDDEN);
            } else {
                Player player = playerRepository.findByUserName(authentication.getName());
                if (game.getGamePlayers().stream().anyMatch(gp -> gp.getPlayer().getId() == player.getId())) {
                    response = new ResponseEntity<>(makeMap("error", "you can't play against yourself"), HttpStatus.FORBIDDEN);
                } else {
                    GamePlayer newGamePlayer = gamePlayerRepository.save(new GamePlayer(game, player, LocalDateTime.now()));
                    response = new ResponseEntity<>(makeMap("gpId", newGamePlayer.getId()), HttpStatus.CREATED);
                }
            }
        }
        return response;
    }


    @RequestMapping("/games_view/{gamePlayerId}")
    public ResponseEntity<Map<String, Object>> getGameView(@PathVariable long gamePlayerId, Authentication authentication) {
        ResponseEntity<Map<String, Object>> response;
        if (isGuest(authentication)) {
            response = new ResponseEntity<>(makeMap("error", "you must be looged in first"), HttpStatus.UNAUTHORIZED);
        } else {
            GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).orElse(null);
            Player player = playerRepository.findByUserName(authentication.getName());
            if (gamePlayer == null) {
                response = new ResponseEntity<>(makeMap("error", "no such game"), HttpStatus.NOT_FOUND);
            } else if (gamePlayer.getPlayer().getId() != player.getId()) {
                response = new ResponseEntity<>(makeMap("error", "this is not your game"), HttpStatus.UNAUTHORIZED);
            } else {
                response = new ResponseEntity<>(this.gameViewDTO(gamePlayer), HttpStatus.OK);
            }
        }
        return response;
    }

    @RequestMapping(path = "/games/players/{gamePlayerId}/ships", method = RequestMethod.POST)
    public ResponseEntity<Map<String, Object>> addShips(Authentication authentication, @PathVariable Long gamePlayerId, @PathVariable List<Ship> ships) {
        ResponseEntity<Map<String, Object>> response;
        if (isGuest(authentication)) {
            response = new ResponseEntity<>(makeMap("error", "you must be logged in"), HttpStatus.UNAUTHORIZED);
        } else {
            GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).orElse(null);
            Player player = playerRepository.findByUserName(authentication.getName());

            if (gamePlayer == null) {
                response = new ResponseEntity<>(makeMap("error", "no such game"), HttpStatus.NOT_FOUND);
            } else if (gamePlayer.getPlayer().getId() != player.getId()) {
                response = new ResponseEntity<>(makeMap("error", "this is not your game"), HttpStatus.FORBIDDEN);
            } else if (gamePlayer.getShips().size() > 0) {
                response = new ResponseEntity<>(makeMap("error", "you already have ships"), HttpStatus.FORBIDDEN);
            } else if (ships == null || ships.size() != 5) {
                response = new ResponseEntity<>(makeMap("error", "you must add 5 ships"), HttpStatus.FORBIDDEN);
            }else{
                if (ships.stream().anyMatch(ship -> this.isOutOfRange(ship))){
                    response = new ResponseEntity<>(makeMap("error", "you have ships out of range"), HttpStatus.FORBIDDEN);
                }else if(ships.stream().anyMatch(ship -> this.isNotConsecutive(ship))){
                    response  = new ResponseEntity<>(makeMap("error", "your ships are not consecutive"), HttpStatus.FORBIDDEN);
                }else if(this.areOverLapped(ships)){
                    response = new ResponseEntity<>(makeMap("error", "your shis are overlapped"), HttpStatus.FORBIDDEN);
                }else{
                    ships.forEach(ship -> gamePlayer.addShip(ship));
                    gamePlayerRepository.save(gamePlayer);
                    response = new ResponseEntity<>(makeMap("success", "ships added"), HttpStatus.CREATED);
                }
            }

        }
        return response;
    }




    private Map<String, Object> gameViewDTO(GamePlayer gamePlayer) {
        Map<String, Object> dto = new LinkedHashMap<>();


        if (gamePlayer != null) {
            dto.put("id", gamePlayer.getGame().getId());
            dto.put("creationDate", gamePlayer.getGame().getCreationDate());
            dto.put("gamePlayer", gamePlayer.getGame().getGamePlayers().stream().map(GamePlayer::gamePlayersDTO));
            dto.put("player", gamePlayer.getPlayer().getUserName());
            dto.put("ships", gamePlayer.getShips().stream().map(Ship::ShipDTO));
            dto.put("salvoes",gamePlayer.getGame().getGamePlayers().stream().flatMap(gp->gp.getSalvoes().stream().map(salvo -> salvo.SalvoDTO())));
            if(gamePlayer.getScore() != null){
                dto.put("scores",gamePlayer.getScore().getPoints());
            } else {
                dto.put("scores", null);
            }

        } else {
            dto.put("Error", "No such game");
        }
        return dto;

    }






    private Map<String, Object> makeMap(String key, Object value) {
        Map<String, Object> map = new HashMap<>();
        map.put(key, value);
        return map;
    }
    private boolean isGuest(Authentication authentication){
        return authentication == null;
    }

    private boolean isOutOfRange(Ship ship){
    for(String cell : ship.getLocations()){
        if(!(cell instanceof String ) || cell.length() < 2){
            return true;
        }
        char y = cell.substring(0,1).charAt(0);
        Integer x;
        try {
            x = Integer.parseInt(cell.substring(1));
        }catch(NumberFormatException e){
            x = 99;
        };
        if(x < 1 || x > 10 || y < 'A' || y > 'J'){
            return true;
        }
    }
    return false;
    }
    private boolean isNotConsecutive(Ship ship){
        List<String> cells = ship.getLocations();
        boolean isVertical = cells.get(0).charAt(0) != cells.get(1).charAt(0);
        for(int i = 0; i < cells.size(); i++){
            if(i < cells.size() - 1){
                if(isVertical){
                    char yChar = cells.get(i).substring(0,1).charAt(0);
                    char compareChar = cells.get(i + 1).substring(0,1).charAt(0);
                    if(compareChar - yChar !=1){
                        return true;
                    }
                } else {
                    Integer xInt = Integer.parseInt(cells.get(i).substring(1));
                    Integer compareInt = Integer.parseInt(cells.get(i + 1).substring(1));
                return true;
                }
            }
        }
    return false;
    }
    private boolean areOverLapped(List<Ship> ships){
        List<String> allCells = new ArrayList<>();
        ships.forEach(ship -> allCells.addAll(ship.getLocations()));
        for(int i = 0; i < allCells.size(); i++){
            for(int j = i + 1; j <allCells.size(); j ++){
                if(allCells.get(i).equals(allCells.get(j))){
                    return true;
                }
            }
        }
        return false;
}

}

