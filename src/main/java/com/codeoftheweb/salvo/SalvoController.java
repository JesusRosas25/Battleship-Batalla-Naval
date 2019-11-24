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
    SalvoController(GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, PlayerRepository playerRepository, ScoreRepository scoreRepository) {
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
    public ResponseEntity<Map<String, Object>> getGameView(@PathVariable long gamePlayerId, Authentication authentication){
        ResponseEntity<Map<String, Object>> response;
        if(isGuest(authentication)) {
            response = new ResponseEntity<>(makeMap("error", "you must be looged in first"), HttpStatus.UNAUTHORIZED);
        }else{
            GamePlayer gamePlayer = gamePlayerRepository.findById(gamePlayerId).orElse(null);
            Player player = playerRepository.findByUserName(authentication.getName());
            if(gamePlayer == null) {
                response = new ResponseEntity<>(makeMap("error", "no such game"), HttpStatus.NOT_FOUND);
            }else if(gamePlayer.getPlayer().getId() != player.getId()) {
                response = new ResponseEntity<>(makeMap("error", "this is not your game"), HttpStatus.UNAUTHORIZED);
            }else{
                response = new ResponseEntity<>(this.gameViewDTO(gamePlayer), HttpStatus.OK);
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
            dto.put("scores",gamePlayer.getScore().getPoints());
            dto.put("finishDate", gamePlayer.getScore().getFinishDate());


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

    
}
