package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.time.LocalDateTime;
import java.util.*;
import javax.persistence.CascadeType;
import java.util.stream.Collectors;
import javax.persistence.*;
import javax.persistence.OneToMany;
import java.util.HashSet;

@Entity

public class Game {




    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;

    private LocalDateTime creationDate;

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    Set<GamePlayer> gamePlayers = new HashSet<>();

    @OneToMany(mappedBy = "game", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    Set<Score> scores = new HashSet<>();

    public Game(){}

    public Game(LocalDateTime creationDate){

        this.creationDate = creationDate;
    }


    //////////getters and setters/////////////
    public Long getId(){
    return id;
}

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreationDate(){
        return creationDate;
    }

    public Set<GamePlayer> getGamePlayers() {
        return gamePlayers;
    }

    public void addGamePlayer(GamePlayer gamePlayer){
        this.gamePlayers.add(gamePlayer);
        gamePlayer.setGame(this);
    }
    public List<Player> getPlayers(){
        return this.getGamePlayers().stream().map(GamePlayer::getPlayer).collect(Collectors.toList());
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores (Set<Score> scores) {
        this.scores = scores;
    }
    public void addScores (Score score){
        score.setGame(this);
        scores.add(score);
    }

    /////////////////////////////////DTO//////////////////////////////////////////////
    public Map<String,Object> gamesDTO(){
        Map<String,Object> dto = new LinkedHashMap<>();
        dto.put("id",this.getId());
        dto.put("creationDate",this.getCreationDate());
        dto.put("gamePlayer", this.getGamePlayers().stream().map(GamePlayer::gamePlayersDTO));

        return dto;
    }


}