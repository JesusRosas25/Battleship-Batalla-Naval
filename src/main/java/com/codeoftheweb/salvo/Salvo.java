package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.ManyToOne;


@Entity
public class Salvo {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private int turn;
    @ElementCollection
    private List<String> locations = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayer_Id")
    private GamePlayer gamePlayer;

    public Salvo ( ) { }

    public Salvo (int turn, List<String> locations) {
        this.locations = locations;
        this.turn = turn;
    }
    public static void add(Salvo salvo) {}

    ///////////////////getter's and setter's//////////////////////


    public Long getId() { return this.id; }

    public void setId(Long id) { this.id = id; }

    public List<String> getLocations() { return this.locations; }

    public void setLocations(List<String> locations) { this.locations = locations; }

    public int getTurn() { return this.turn;}

    public void setTurn(int turn) { this.turn = turn; }

    public GamePlayer getGamePlayer() { return this.gamePlayer;  }

    public void setGamePlayer(GamePlayer gamePlayer) { this.gamePlayer = gamePlayer; }

    private List<String> getHits(List<String> myShots, Set<Ship> opponentShips){
        List<String> allEnemyLocs = new ArrayList<>();
        opponentShips.forEach(ship->allEnemyLocs.addAll(ship.getLocations()));
        return myShots
                .stream()
                    .filter(shot-> allEnemyLocs
                       .stream()
                         .anyMatch(loc -> loc.equals(shot)))
                              .collect(Collectors.toList());

    private List<Ship> getSunkenShips(Set<Salvo> mySalvoes, Set<Ship>opponentShips){
    List<String> allShots = new ArrayList<>();
    mySalvoes.forEach(salvo ->allShots.addAll(salvo.getLocations()));

    return opponentShips 
    .stream()
    .filter(ship -> allShots.containsAll(ship.getLocations()))
    .collect(Collectors.toList());
}
    }
    /////////////////////DTO/////////////////////////

    public Map<String,Object> SalvoDTO(){
        Map<String,Object> dto = new LinkedHashMap <>();
        dto.put("playerId", this.getGamePlayer().getPlayer().getId());
        dto.put("locations", this.getLocations());
        dto.put("turn", this.getTurn());

        GamePlayer opponent = this.getGamePlayer().getOpponent();
        if(opponent != null){
            Set<Ship> enemyShips = opponent.getShips();
            dto.put("hits", this.getHits(this.getLocations(),enemyShips));
        Set<Salvo> mySalvoes = this.getHits(this.getLocations(),enemyShips));
            .getSalvoes()
            .stream()
            .filter(salvo -> salvo.getTurn() <= this.getTurn())
            .collect(Collectors.toSet());
            dto.put("sunken", this.getSunkenShips(mySalvoes,enemyShips).stream().map(Ship::shipDTO));
    }
        return dto;
    }


}
