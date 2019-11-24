package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.persistence.*;

@Entity

public class Score {
    @Id
@GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
@GenericGenerator(name = "native", strategy = "native")
private Long id;
private LocalDateTime finishDate;
private double points;

@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn( name = "player_id")

private Player player;

@ManyToOne(fetch = FetchType.EAGER)
@JoinColumn(name = "game_id")

private Game game;


public Score () { }

    public Score(Game game, Player player, LocalDateTime finishDate, double points){

    this.game = game;
    this.player = player;
    this.points = points;
    this.finishDate = finishDate;
    
}


//////////////////////setter and getters//////////////////////////

    public Long getId(){
    return id;
}
    public void setId(Long id){
    this.id = id;
}

    public double getPoints() { return points; }

    public void setPoints (double points) { this.points = points; }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public LocalDateTime getFinishDate() {
        return finishDate;
    }

    public void setFinishDate(LocalDateTime finishDate) {
        this.finishDate = finishDate;
    }

    /////////////////////////DTO//////////////////////////////////
    public Map<String, Object> scoreDTO() {

        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("points", this.points);
        dto.put("finishDate", this.finishDate);
        return dto;
    }
}


