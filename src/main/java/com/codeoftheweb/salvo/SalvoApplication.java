package com.codeoftheweb.salvo;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;



@SpringBootApplication
public class SalvoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SalvoApplication.class, args);

	}

	@Autowired
	PasswordEncoder passwordEncoder;
	@Bean
	public CommandLineRunner initData(PlayerRepository playerRepository, GameRepository gameRepository, GamePlayerRepository gamePlayerRepository, ShipRepository shipRepository, SalvoRepository salvoRepository, ScoreRepository scoreRepository ) {
		return (args) -> {


			Player player1 = playerRepository.save(new Player("jesusrosas2508@gmail.com",passwordEncoder.encode("24")/*,"Jesus", "Rosas"*/));
			Player player2 = playerRepository.save(new Player("chloe23@gmail.com",passwordEncoder.encode("42")/*,"Chloe", "O'Brian" */));
			Player player3 = playerRepository.save(new Player("kimbauer245@hotmail.com",passwordEncoder.encode ("kb")/*,"Kim", "Bauer"*/));
			Player player4 = playerRepository.save(new Player("palmerdavid2@outlook.com",passwordEncoder.encode ("mole")/*,"David", "Palmer"*/));
			Player player5 = playerRepository.save(new Player("desslermichelle@gmail.com",passwordEncoder.encode ("michelle3")/*,"Michelle", "Dessler"*/));

			Game game1 = gameRepository.save(new Game(LocalDateTime.now()));
			Game game2 = gameRepository.save(new Game(LocalDateTime.now().plusHours(1)));
			Game game3 = gameRepository.save(new Game(LocalDateTime.now().plusHours(2)));

			GamePlayer gp1 = gamePlayerRepository.save(new GamePlayer(game1,player5,LocalDateTime.now()));
			GamePlayer gp2 = gamePlayerRepository.save(new GamePlayer(game2,player3,LocalDateTime.now()));
			GamePlayer gp3 = gamePlayerRepository.save(new GamePlayer(game2,player4,LocalDateTime.now()));
			GamePlayer gp4 = gamePlayerRepository.save(new GamePlayer(game1,player1,LocalDateTime.now()));
            GamePlayer gp5 = gamePlayerRepository.save(new GamePlayer(game3,player2,LocalDateTime.now()));
            GamePlayer gp6 = gamePlayerRepository.save(new GamePlayer(game3,player4,LocalDateTime.now()));

            gp1.addShip(new Ship("submarine", Arrays.asList("C3","C4","C5")));
            gp1.addShip(new Ship("destroyer",Arrays.asList("D4","D5","D6")));
            gp1.addShip(new Ship("carrier", Arrays.asList("A7","B7","C7","D7","E7")));

            gp2.addShip(new Ship("patrol_boat",Arrays.asList("A1","B1")));
            gp2.addShip(new Ship("destroyer",Arrays.asList("F1","F2","F3")));

            gp3.addShip(new Ship("carrier",Arrays.asList("A3","B3","C3","D3","E3")));
            gp3.addShip(new Ship("battleship",Arrays.asList("A1","B1","C1","D1")));

            gp4.addShip(new Ship("carrier",Arrays.asList("A3","B3","C3","D3","E3")));
            gp4.addShip(new Ship("submarine",Arrays.asList("C4","C5","C6")));
            gp4.addShip(new Ship("destroyer",Arrays.asList("D4","D5","D6")));
            gp4.addShip(new Ship("patrol_boat",Arrays.asList("A1","A2")));
            gp4.addShip(new Ship("destroyer",Arrays.asList("J1","J2","J3")));



            gp1.addSalvo(new Salvo(4,Arrays.asList("C7","B2","D2")));
            gp1.addSalvo(new Salvo(5,Arrays.asList("A7","C3","C7")));
			gp2.addSalvo(new Salvo(4,Arrays.asList("A1","C7")));
			gp2.addSalvo(new Salvo(5,Arrays.asList("B4","F5")));
			gp3.addSalvo(new Salvo(4,Arrays.asList("C4","D5")));
			gp3.addSalvo(new Salvo(5,Arrays.asList("D1","F1")));
			gp4.addSalvo(new Salvo(4,Arrays.asList("A1","F3","D7","B4","C7")));
			gp4.addSalvo(new Salvo(5,Arrays.asList("C1","A7","B5","F3","E5")));



			gamePlayerRepository.save(gp1);
            gamePlayerRepository.save(gp2);
            gamePlayerRepository.save(gp3);
            gamePlayerRepository.save(gp4);

            scoreRepository.save(new Score(game1,player1, LocalDateTime.now().plusMinutes(50),0.0));
            scoreRepository.save(new Score(game1,player5, LocalDateTime.now().plusMinutes(50),0.0));
            scoreRepository.save(new Score(game2,player3, LocalDateTime.now().plusMinutes(44),0.0));
            scoreRepository.save(new Score(game2,player4, LocalDateTime.now().plusMinutes(44),0.0));
			scoreRepository.save(new Score(game3,player2, LocalDateTime.now().plusMinutes(25),0.0));
			scoreRepository.save(new Score(game3,player4, LocalDateTime.now().plusMinutes(25),0.0));
		};

	}
}