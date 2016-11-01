--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.1
-- Dumped by pg_dump version 9.5.0

-- Started on 2016-11-01 02:11:33 PDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE battleship;
--
-- TOC entry 2428 (class 1262 OID 17027)
-- Name: battleship; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE battleship WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE battleship OWNER TO postgres;

\connect battleship

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2429 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 190 (class 3079 OID 12623)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2431 (class 0 OID 0)
-- Dependencies: 190
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 185 (class 1259 OID 17091)
-- Name: board_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE board_state (
    position_x integer,
    position_y integer,
    game_id integer NOT NULL,
    player_id integer NOT NULL,
    ship_id integer NOT NULL
);


ALTER TABLE board_state OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 17117)
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE chat (
    game_id integer NOT NULL,
    message character varying(500) NOT NULL,
    "time" timestamp without time zone NOT NULL,
    player_id integer NOT NULL
);


ALTER TABLE chat OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 17072)
-- Name: game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE game (
    id integer NOT NULL,
    player1_id integer NOT NULL,
    player2_id integer NOT NULL,
    player1_score integer DEFAULT 0 NOT NULL,
    player2_score integer DEFAULT 0 NOT NULL,
    player1_turn boolean DEFAULT true NOT NULL
);


ALTER TABLE game OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 17070)
-- Name: game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE game_id_seq OWNER TO postgres;

--
-- TOC entry 2432 (class 0 OID 0)
-- Dependencies: 183
-- Name: game_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE game_id_seq OWNED BY game.id;


--
-- TOC entry 182 (class 1259 OID 17052)
-- Name: high_score; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE high_score (
    score integer DEFAULT 0 NOT NULL,
    ship_sunk integer,
    misses integer,
    hits integer,
    user_id integer
);


ALTER TABLE high_score OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 17046)
-- Name: player; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE player (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL
);


ALTER TABLE player OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 17106)
-- Name: ship; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ship (
    id integer NOT NULL,
    hit boolean NOT NULL
);


ALTER TABLE ship OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 17104)
-- Name: ship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE ship_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE ship_id_seq OWNER TO postgres;

--
-- TOC entry 2433 (class 0 OID 0)
-- Dependencies: 186
-- Name: ship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE ship_id_seq OWNED BY ship.id;


--
-- TOC entry 189 (class 1259 OID 17133)
-- Name: ship_position; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE ship_position (
    position_x integer NOT NULL,
    position_y integer NOT NULL,
    ship_id integer NOT NULL
);


ALTER TABLE ship_position OWNER TO postgres;

--
-- TOC entry 180 (class 1259 OID 17044)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_id_seq OWNER TO postgres;

--
-- TOC entry 2434 (class 0 OID 0)
-- Dependencies: 180
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_id_seq OWNED BY player.id;


--
-- TOC entry 2278 (class 2604 OID 17075)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY game ALTER COLUMN id SET DEFAULT nextval('game_id_seq'::regclass);


--
-- TOC entry 2276 (class 2604 OID 17049)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY player ALTER COLUMN id SET DEFAULT nextval('user_id_seq'::regclass);


--
-- TOC entry 2282 (class 2604 OID 17109)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ship ALTER COLUMN id SET DEFAULT nextval('ship_id_seq'::regclass);


--
-- TOC entry 2419 (class 0 OID 17091)
-- Dependencies: 185
-- Data for Name: board_state; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY board_state (position_x, position_y, game_id, player_id, ship_id) FROM stdin;
\.


--
-- TOC entry 2422 (class 0 OID 17117)
-- Dependencies: 188
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY chat (game_id, message, "time", player_id) FROM stdin;
\.


--
-- TOC entry 2418 (class 0 OID 17072)
-- Dependencies: 184
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY game (id, player1_id, player2_id, player1_score, player2_score, player1_turn) FROM stdin;
2	1	2	0	0	t
3	1	2	15	0	t
\.


--
-- TOC entry 2435 (class 0 OID 0)
-- Dependencies: 183
-- Name: game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('game_id_seq', 3, true);


--
-- TOC entry 2416 (class 0 OID 17052)
-- Dependencies: 182
-- Data for Name: high_score; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY high_score (score, ship_sunk, misses, hits, user_id) FROM stdin;
\.


--
-- TOC entry 2415 (class 0 OID 17046)
-- Dependencies: 181
-- Data for Name: player; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY player (id, username, password) FROM stdin;
1	test	test
2	player	password
\.


--
-- TOC entry 2421 (class 0 OID 17106)
-- Dependencies: 187
-- Data for Name: ship; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY ship (id, hit) FROM stdin;
1	t
2	f
\.


--
-- TOC entry 2436 (class 0 OID 0)
-- Dependencies: 186
-- Name: ship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('ship_id_seq', 2, true);


--
-- TOC entry 2423 (class 0 OID 17133)
-- Dependencies: 189
-- Data for Name: ship_position; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY ship_position (position_x, position_y, ship_id) FROM stdin;
\.


--
-- TOC entry 2437 (class 0 OID 0)
-- Dependencies: 180
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_id_seq', 2, true);


--
-- TOC entry 2286 (class 2606 OID 17080)
-- Name: game_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY game
    ADD CONSTRAINT game_pkey PRIMARY KEY (id);


--
-- TOC entry 2284 (class 2606 OID 17051)
-- Name: pk_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY player
    ADD CONSTRAINT pk_id PRIMARY KEY (id);


--
-- TOC entry 2290 (class 2606 OID 17137)
-- Name: ship_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ship_position
    ADD CONSTRAINT ship_location_pkey PRIMARY KEY (position_x, position_y, ship_id);


--
-- TOC entry 2288 (class 2606 OID 17111)
-- Name: ship_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ship
    ADD CONSTRAINT ship_pkey PRIMARY KEY (id);


--
-- TOC entry 2294 (class 2606 OID 17094)
-- Name: board_state_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_game_id_fkey FOREIGN KEY (game_id) REFERENCES game(id);


--
-- TOC entry 2295 (class 2606 OID 17099)
-- Name: board_state_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id);


--
-- TOC entry 2296 (class 2606 OID 17112)
-- Name: board_state_ship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY board_state
    ADD CONSTRAINT board_state_ship_id_fkey FOREIGN KEY (ship_id) REFERENCES ship(id);


--
-- TOC entry 2297 (class 2606 OID 17123)
-- Name: chat_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_game_id_fkey FOREIGN KEY (game_id) REFERENCES game(id);


--
-- TOC entry 2298 (class 2606 OID 17128)
-- Name: chat_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY chat
    ADD CONSTRAINT chat_player_id_fkey FOREIGN KEY (player_id) REFERENCES player(id);


--
-- TOC entry 2292 (class 2606 OID 17081)
-- Name: fk_player1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY game
    ADD CONSTRAINT fk_player1 FOREIGN KEY (player1_id) REFERENCES player(id);


--
-- TOC entry 2293 (class 2606 OID 17086)
-- Name: fk_player2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY game
    ADD CONSTRAINT fk_player2 FOREIGN KEY (player2_id) REFERENCES player(id);


--
-- TOC entry 2291 (class 2606 OID 17056)
-- Name: fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY high_score
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES player(id);


--
-- TOC entry 2299 (class 2606 OID 17138)
-- Name: ship_location_ship_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY ship_position
    ADD CONSTRAINT ship_location_ship_id_fkey FOREIGN KEY (ship_id) REFERENCES ship(id);


--
-- TOC entry 2430 (class 0 OID 0)
-- Dependencies: 5
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-11-01 02:11:33 PDT

--
-- PostgreSQL database dump complete
--

