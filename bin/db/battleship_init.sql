CREATE TABLE board_state
(
    position_x INTEGER,
    position_y INTEGER,
    game_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    ship_id INTEGER NOT NULL
);
CREATE TABLE chat
(
    game_id INTEGER NOT NULL,
    message VARCHAR(500) NOT NULL,
    time TIMESTAMP NOT NULL,
    player_id INTEGER NOT NULL
);
CREATE TABLE game
(
    id INTEGER PRIMARY KEY NOT NULL,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER,
    player1_score INTEGER DEFAULT 0 NOT NULL,
    player2_score INTEGER DEFAULT 0 NOT NULL,
    player1_turn BOOLEAN DEFAULT true NOT NULL
);
CREATE TABLE high_score
(
    score INTEGER DEFAULT 0 NOT NULL,
    ship_sunk INTEGER,
    misses INTEGER,
    hits INTEGER,
    user_id INTEGER
);
CREATE TABLE player
(
    id INTEGER PRIMARY KEY NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL
);
CREATE TABLE ship
(
    id INTEGER PRIMARY KEY NOT NULL,
    ship_owner INTEGER NOT NULL,
    size INTEGER DEFAULT 1 NOT NULL
);
CREATE TABLE ship_position
(
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    ship_id INTEGER NOT NULL,
    hit BOOLEAN DEFAULT false,
    CONSTRAINT ship_location_pkey PRIMARY KEY (position_x, position_y, ship_id)
);
ALTER TABLE board_state ADD FOREIGN KEY (game_id) REFERENCES game (id);
ALTER TABLE board_state ADD FOREIGN KEY (player_id) REFERENCES player (id);
ALTER TABLE board_state ADD FOREIGN KEY (ship_id) REFERENCES ship (id);
ALTER TABLE chat ADD FOREIGN KEY (game_id) REFERENCES game (id);
ALTER TABLE chat ADD FOREIGN KEY (player_id) REFERENCES player (id);
ALTER TABLE game ADD FOREIGN KEY (player1_id) REFERENCES player (id);
ALTER TABLE game ADD FOREIGN KEY (player2_id) REFERENCES player (id);
ALTER TABLE high_score ADD FOREIGN KEY (user_id) REFERENCES player (id);
CREATE UNIQUE INDEX player_username_uindex ON player (username);
ALTER TABLE ship ADD FOREIGN KEY (ship_owner) REFERENCES player (id);
ALTER TABLE ship_position ADD FOREIGN KEY (ship_id) REFERENCES ship (id);
