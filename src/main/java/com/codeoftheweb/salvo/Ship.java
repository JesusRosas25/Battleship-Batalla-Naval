package com.codeoftheweb.salvo;

import org.hibernate.annotations.GenericGenerator;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.*;
import java.util.*;
import javax.persistence.ManyToOne;




@Entity
public class Ship {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String type;

    @ElementCollection
    private List<String> locations = new ArrayList<>();


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "gamePlayer_Id")
    private GamePlayer gamePlayer;

    public Ship(){ }

    public Ship(String type, List<String> locations){
        this.type = type;
        this.locations = locations;

    }

    public static void add(Ship ship) {  }



    ///////////////////Getters and Setters//////////////////////

    public Long getId() { return this.id; }

    public void setId(Long id) { this.id = id;  }

    public String getType() { return this.type; }

    public void setType(String type) { this.type = type; }

    public List<String> getLocations() { return this.locations;  }

    public void setLocations(List<String> locations) { this.locations = locations;  }

    public GamePlayer getGamePlayer() { return this.gamePlayer;  }

    public void setGamePlayer(GamePlayer gamePlayer) { this.gamePlayer = gamePlayer; }

    //////////////////////DTO//////////////////////////////////////////////
    public Map<String,Object> ShipDTO(){

        Map<String,Object> dto = new LinkedHashMap<>();
        dto.put("type", this.getType());
        dto.put("locations", this.getLocations());
        return dto;
    }



}



