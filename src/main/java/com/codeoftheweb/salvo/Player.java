package com.codeoftheweb.salvo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.crypto.password.PasswordEncoder;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.*;
import java.util.HashSet;
import java.util.*;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;

@Entity
public class Player {


    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "native")
    @GenericGenerator(name = "native", strategy = "native")
    private Long id;
    private String userName;
    /*private String firstName;
    private String lastName;*/


    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<GamePlayer> gamePlayers = new HashSet<>();

    @OneToMany(mappedBy = "player", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Score> scores = new HashSet<>();
    private String password;

    public Player() {
    }

    public Player(String userName, String password/*, String firstName, String lastName*/) {
        this.userName = userName;
        this.password = password;
        /*this.firstName = firstName;
        this.lastName = lastName;*/

    }
    ///////////////////////getter's and setter's//////////////////////////////////


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserName() {
        return this.userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    /*public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }*/

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<Score> getScores() {
        return this.scores;
    }


    public void addScore(Score score) {
        scores.add(score);
        score.setPlayer(this);
    }

    public Score getScoreByGame(Game game) {
        return this.scores.stream()
                .filter(score -> score.getGame().getId() == game.getId())
                .findFirst()
                .orElse(null);
    }

    @JsonIgnore
    public List<Game> getGames() {
        return this.gamePlayers.stream().map(GamePlayer::getGame).collect(Collectors.toList());
    }

    /////////////////////DTO////////////////////
    public Map<String, Object> playersDTO() {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("id", this.getId());
        dto.put("username", this.getUserName());
        /*dto.put("firstName", this.getFirstName());
        dto.put("lastName", this.getLastName());*/
        double total = this.getScores().stream().mapToDouble(Score::getPoints).sum();
        dto.put("points", total);

        return dto;
    }


}