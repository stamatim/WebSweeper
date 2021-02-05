use WebSweeper;

create table if not exists Game(
GID int AUTO_INCREMENT,
Field VARCHAR(255),
roe int,
col int,
mines int,
Difficulty VARCHAR(50),
viewField VARCHAR(255),
PRIMARY KEY (GID)
);

create table if not exists Leaderboard(
LID int AUTO_INCREMENT,
Score int,
Username VARCHAR(30),
Difficulty VARCHAR(50),
PRIMARY KEY (LID)
);