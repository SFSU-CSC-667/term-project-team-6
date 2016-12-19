(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisBattleship = void 0;

var Battleship = function () {
    function Battleship() {
        _classCallCheck(this, Battleship);

        this.rows = 10;
        this.columns = 10;
        this.square_size = 40;

        this.player_gameboard = document.getElementById("player_board");
        this.opponent_gameboard = document.getElementById("opponent_board");
        // this.player_gameboard.addEventListener("drop", this.placeShip, false);
        // this.opponent_gameboard.addEventListener("click", this.fire, false);

        this.opponentBoard = this.initBoard(10);
        // this.opponentBoard = [
        //     [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        //     [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // ];

        this.playerBoard = this.initBoard(10);
        // this.playerBoard = [
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        //     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        // ];


        this.placedShips = {};

        thisBattleship = this;
    }

    _createClass(Battleship, [{
        key: "initBoard",
        value: function initBoard(dim) {
            var matrix = [];
            for (var i = 0; i < dim; i++) {
                matrix.push(new Array(dim).fill(0));
            }
            return matrix;
        }
    }, {
        key: "drawBord",


        //initialize boards
        value: function drawBord() {
            var _this = this;

            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "p";
            var left_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

            var i = void 0,
                j = void 0;
            for (i = 0; i < this.rows; i++) {
                var _loop = function _loop() {
                    var top_position = i * _this.square_size;
                    var left_position = j * _this.square_size;

                    var player_square = document.createElement("div");

                    player_square.id = id + i + j;
                    var thisObj = _this;
                    if (id == "p") {
                        _this.player_gameboard.appendChild(player_square);
                        player_square.addEventListener("dragover", function (event) {
                            thisObj.allowDrop(event);
                        });
                        player_square.addEventListener("drop", function (event) {
                            thisObj.onDrop(event);
                        });
                    } else {
                        _this.opponent_gameboard.appendChild(player_square);
                        player_square.addEventListener("click", function (event) {
                            thisObj.fire(event);
                        });
                    }

                    player_square.style.top = top_position + "px";
                    player_square.style.left = left_position + "px";
                };

                for (j = 0; j < this.columns; j++) {
                    _loop();
                }
            }
        }
    }, {
        key: "fire",
        value: function fire(event) {
            var square = event.target;
            var row = square.id.substring(1, 2);
            var column = square.id.substring(2, 3);
            console.log("(" + row + "," + column + ")");

            var fireEvent = { row: row, column: column };

            switch (this.opponentBoard[row][column]) {
                case 0:
                    //miss
                    square.style.background = '#bbb';
                    this.opponentBoard[row][column] = 2;
                    fireEvent.hit = false;
                    break;
                case 1:
                    //hit
                    square.style.background = 'red';
                    this.opponentBoard[row][column] = 3;
                    fireEvent.hit = true;
                    break;
                default:
                    break;
            }

            if (thisBattleship.fireListener) thisBattleship.fireListener(fireEvent);

            event.stopPropagation();
        }
    }, {
        key: "addFireListener",
        value: function addFireListener(listener) {
            thisBattleship.fireListener = listener;
        }
    }, {
        key: "allowDrop",
        value: function allowDrop(event) {
            event.preventDefault();
        }
    }, {
        key: "onDrop",
        value: function onDrop(event) {
            event.preventDefault();
            var ship = event.dataTransfer.getData("text");
            //const leftOffset = event.dataTransfer.getData("leftOffset");
            var leftOffset = 0;
            var previous_pos_id = document.getElementById(ship).parentNode.id;

            //const ship_height = parseInt(document.getElementById(ship).style.height) / this.square_size;
            var ship_height = $($('#' + ship)).height() / this.square_size;
            //this.ship_width = parseInt( document.getElementById(ship).style.width) / square_size;
            var ship_width = $($('#' + ship)).width() / this.square_size;

            var square = event.target;
            var row = parseInt(square.id.substring(1, 2));
            var column = parseInt(square.id.substring(2, 3)) - parseInt(leftOffset);

            console.log({ ship: ship, leftOffset: leftOffset, previous_pos_id: previous_pos_id, ship_height: ship_height, ship_width: ship_width, square: square, row: row, column: column });

            if (column >= 0 && this.canPlace(row, ship_height, column, ship_width)) {
                if (previous_pos_id != "pieces") this.removeShip(previous_pos_id, ship_height, ship_width);
                this.placeShip(square.id, leftOffset, ship_height, ship_width);
                square.appendChild(document.getElementById(ship));
            } else {
                alert("Ship cannot be placed");
            }

            //console.log( document.getElementById( ship));
            this.redrawBoard();
        }
    }, {
        key: "placeShip",
        value: function placeShip(pos_id, leftOffset, shipHeight, shipWidth) {
            pos_id = pos_id.toString();
            var row = parseInt(pos_id.substring(1, 2));
            var column = parseInt(pos_id.substring(2, 3)) - leftOffset;

            var ship = [];

            var i = void 0;
            if (shipHeight > shipWidth) {
                for (i = 0; i < shipHeight; i++) {
                    this.playerBoard[row + i][column] = 1;
                    ship.push({ row: row + i, column: column });
                }
            } else {
                for (i = 0; i < shipWidth; i++) {
                    this.playerBoard[row][column + i] = 1;
                    ship.push({ row: row, column: column + i });
                }
            }

            this.placedShips[this.currentShipId] = ship;
        }
    }, {
        key: "removeShip",
        value: function removeShip(previous_pos_id, ship_height, ship_width) {
            var row = parseInt(previous_pos_id.substring(1, 2));
            var column = parseInt(previous_pos_id.substring(2, 3));

            var i = void 0;
            if (ship_height > ship_width) {
                for (i = 0; i < ship_height; i++) {
                    this.playerBoard[row + i][column] = 0;
                }
            } else {
                for (i = 0; i < ship_width; i++) {
                    this.playerBoard[row][column + i] = 0;
                }
            }
        }
    }, {
        key: "redrawBoard",
        value: function redrawBoard() {
            var i = void 0,
                j = void 0;
            for (i = 0; i < this.rows; i++) {
                for (j = 0; j < this.columns; j++) {
                    switch (this.playerBoard[i][j]) {
                        case 0:
                            //document.getElementById("p" + i + j).style.background = "#f6f8f9";
                            break;
                        case 1:
                            //document.getElementById("p" + i + j).style.background = "#bbb";
                            break;
                    }
                }
            }
        }
    }, {
        key: "dragStart",
        value: function dragStart(event, domElement) {
            event.dataTransfer = event.originalEvent.dataTransfer;
            event.dataTransfer.setData("text", event.target.id);
            //const leftOffset = (event.pageX - event.target.offsetLeft) / thisBattleship.square_size;
            //event.dataTransfer.setData("leftOffset", parseInt(leftOffset));
            event.target.style.opacity = "0.4";

            thisBattleship.currentShipId = event.target.id;
        }
    }, {
        key: "dragStop",
        value: function dragStop(event) {
            event.target.style.opacity = "1";
        }
    }, {
        key: "flipShip",
        value: function flipShip(event) {
            console.log(event);
            var parent_id = event.target.parentNode.id;
            var width = event.target.width;
            var height = event.target.height;
            var ship_height = parseInt(height) / thisBattleship.square_size;
            var ship_width = parseInt(width) / thisBattleship.square_size;

            console.log({ width: width, height: height, ship_width: ship_width, ship_height: ship_height });

            if (parent_id == "pieces") {
                event.target.style.height = width + "px";
                event.target.style.width = height + "px";
                if (width > height) {
                    event.target.src = "../assets/" + event.target.id + "-90.png";
                } else {
                    event.target.src = "../assets/" + event.target.id + ".png";
                }
            } else if (thisBattleship.canPlace(parent_id.substring(1, 2), ship_height, parent_id.substring(2, 3), ship_width)) {
                event.target.style.width = height + "px";
                event.target.style.height = width + "px";

                if (width > height) {
                    event.target.src = "../assets/" + event.target.id + "-90.png";
                } else {
                    event.target.src = "../assets/" + event.target.id + ".png";
                }

                thisBattleship.removeShip(parent_id, ship_height, ship_width);
                thisBattleship.placeShip(parent_id, ship_width, ship_height);
                thisBattleship.redrawBoard();
            } else {
                alert("Cannot rotate ship");
            }
        }
    }, {
        key: "canPlace",
        value: function canPlace(row, ship_height, column, ship_width) {
            if (row + ship_height <= this.rows && column + ship_width <= this.columns) {
                var i = 0;
                for (i = row; i < row + ship_height; i++) {
                    if (this.playerBoard[i][column] == 1) return false;
                }

                for (i = column; i < column + ship_width; i++) {
                    if (this.playerBoard[row][i] == 1) return false;
                }
            } else {
                return false;
            }
            return true;
        }
    }, {
        key: "bindDragEvents",
        value: function bindDragEvents($pieces) {
            $pieces.attr("draggable", "true");
            $pieces.on("click", this.flipShip);
            $pieces.on("dragend", this.dragStop);
            $pieces.on("dragstart", this.dragStart);
        }
    }, {
        key: "setOpponentBoard",
        value: function setOpponentBoard(boardShipPositions) {
            console.log("setting opponent board!!");
            for (var ship in boardShipPositions) {
                boardShipPositions[ship].forEach(function (shipPosition) {
                    thisBattleship.opponentBoard[shipPosition.row][shipPosition.column] = 1;
                });
            }
            console.log("opponent board set!!");
        }
    }, {
        key: "getBoard",
        get: function get() {
            return this.placedShips;
        }
    }]);

    return Battleship;
}();

module.exports = { Battleship: Battleship };

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by dusan_cvetkovic on 11/1/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _events = require('./constants/events');

var events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisChat = void 0;

var Chat = function () {
    function Chat(user, socket) {
        _classCallCheck(this, Chat);

        thisChat = this;
        this.user = user.user;
        this.userObj = user;
        this.userSocket = socket;
        this.$usersList = $('#connections');
        this.$opponentScore = $('#header #opponent');
        this.$userScore = $('#header #user');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, thisChat.user);
    }

    _createClass(Chat, [{
        key: 'bindSocketEvents',
        value: function bindSocketEvents() {
            this.userSocket.on(events.MESSAGE_SEND, thisChat.onMessageSend);
            this.userSocket.on(events.GET_USERS, thisChat.onGetUsers);
            this.userSocket.on(events.CREATE_GAME, thisChat.onGameCreated);
            this.userSocket.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
            this.userSocket.on(events.UPDATE_USER_SOCKET, thisChat.onUpdateUserSocket);
            this.userSocket.on(events.UPDATE_SCORE, thisChat.onUpdateScore);
        }
    }, {
        key: 'onUpdateScore',
        value: function onUpdateScore(gameData) {
            console.log(gameData);
            if (thisChat.user.id == gameData.player1_id) {
                thisChat.$userScore.html("User: " + gameData.player1_username + ": " + gameData.player1_score);
                thisChat.$opponentScore.html("Opp: " + gameData.player2_username + ": " + gameData.player2_score);
            } else {
                thisChat.$userScore.html("User: " + gameData.player2_username + ": " + gameData.player2_score);
                thisChat.$opponentScore.html("Opponent: " + gameData.player1_username + ": " + gameData.player1_score);
            }

            if (thisChat.user.id == gameData.player1_id && gameData.player1_turn || thisChat.user.id == gameData.player2_id && !gameData.player1_turn) {
                $('#opponent_board').removeClass('disabled-button');
            } else {
                $('#opponent_board').addClass('disabled-button');
            }

            thisChat.$opponentScore.show();
        }
    }, {
        key: 'onUpdateUserSocket',
        value: function onUpdateUserSocket(data) {
            console.log(data);
            if (data.id == thisChat.user.id) {
                thisChat.userObj.user = data;
                thisChat.user = thisChat.userObj.user;
            }
        }
    }, {
        key: 'onPlayerJoinedGame',
        value: function onPlayerJoinedGame(data) {
            if (data.user.id === thisChat.user.id) {
                thisChat.userObj.startGame(data.gameId);
                thisChat.$userScore.html("User: " + data.user.username);
            } else {
                thisChat.$opponentScore.html("Opponent: " + data.user.username);
                thisChat.$opponentScore.show();
            }
            console.log("logged to game: ", data);
            $('#game-area').show();
            $('#wait-opponent').hide();
            // $('#wait-opponent').removeClass('loader');

        }
    }, {
        key: 'bindEvents',
        value: function bindEvents() {

            $('form#chat-form').submit(function (event) {
                event.preventDefault();
                thisChat.onMessageSubmit();
            });
        }
    }, {
        key: 'onMessageSend',
        value: function onMessageSend(msg) {
            $('#messages').append($('<li>').addClass("well").text(msg));
            console.log("message received ", msg);
        }
    }, {
        key: 'onMessageSubmit',
        value: function onMessageSubmit() {
            this.userSocket.emit(events.MESSAGE_SEND, $('#m').val());
            $('#m').val('');
            console.log("message sent ", $('#m').val());
            return false;
        }
    }, {
        key: 'onGetUsers',
        value: function onGetUsers(data) {
            // let $userNameItems = "";
            thisChat.$usersList.html("");
            var usersList = data.usersList;
            usersList.forEach(function (user) {
                var $userNameItem = $('<li/>').addClass("list-group-item").addClass("user").attr("id", user.id).html(user.username);
                data.games.some(function (game) {
                    if (user.socket_id == game.socket_created) {
                        var joinButton = thisChat.buildJoinButton(user.id);
                        joinButton.on('click', function () {
                            thisChat.onJoinGame(game.id);
                        });
                        $userNameItem.append(joinButton);
                        return true;
                    }
                });
                thisChat.$usersList.append($userNameItem);
            });

            // this.$usersList.appendChild($userNameItems);

        }
    }, {
        key: 'onGameCreated',
        value: function onGameCreated(data) {
            var userID = data.userCreatedGame;
            var joinButton = thisChat.buildJoinButton(userID);

            if ($('#connections .btn-join #' + userID).length == 0) {
                $('#connections li#' + userID).append(joinButton);
                joinButton.on('click', function () {
                    thisChat.onJoinGame(data.gameId);
                });
            }

            if (this.id === data.mySocketId) {
                thisChat.userObj.startGame(data.gameId);
            }
        }
    }, {
        key: 'buildJoinButton',
        value: function buildJoinButton(userID) {
            return $('<button />').addClass('btn-join').addClass('btn-sm').addClass('btn-primary').addClass('pull-right').attr("id", userID).text('Join Game');
        }
    }, {
        key: 'onJoinGame',
        value: function onJoinGame(gameId) {
            this.userSocket.emit(events.PLAYER_JOIN_GAME, {
                gameId: gameId,
                user: this.user,
                mySocketId: this.userSocket.id
            });
        }
    }]);

    return Chat;
}();

module.exports = { Chat: Chat };

},{"./constants/events":3}],3:[function(require,module,exports){
'use strict';

var LOBBY = 'lobby';
var USER_JOINED = 'user-joined';
var MESSAGE_SEND = 'message-send';
var GET_USERS = 'get-connections';
var UPDATE_USER_SOCKET = 'user-socket';

var FIND_LEADER = 'findLeader';

// Host Events
var CREATE_GAME = 'playerCreateNewGame';
var GAME_START = 'hostRoomFull';
var COUNTDOWN = 'hostCountdownFinished';
var NEXT_MOVE = 'hostNextRound';

// Player Events
var PLAYER_JOIN_GAME = 'playerJoinGame';
var PLAYER_MOVE = 'playerAnswer';
var PLAYER_RESTART = 'playerRestart';

// game events
var NEW_GAME_CREATED = 'newGameCreated';
var PLAYER_JOINED_GAME = 'playerJoinedGame';
var UPDATE_SCORE = 'UPDATE_SCORE';
var SUBMIT_BOARD = 'SUBMIT_BOARD';
var GET_OPPONENT_BOARD = 'GET_OPPONENT_BOARD';
var ON_NEXT_MOVE = 'ON_NEXT_MOVE';

// lobby
// const PLAYER_RESTART = 'playerRestart';

module.exports = { LOBBY: LOBBY, USER_JOINED: USER_JOINED, MESSAGE_SEND: MESSAGE_SEND, FIND_LEADER: FIND_LEADER,
    CREATE_GAME: CREATE_GAME, GAME_START: GAME_START, COUNTDOWN: COUNTDOWN, NEXT_MOVE: NEXT_MOVE, PLAYER_JOIN_GAME: PLAYER_JOIN_GAME, PLAYER_MOVE: PLAYER_MOVE, PLAYER_RESTART: PLAYER_RESTART,
    NEW_GAME_CREATED: NEW_GAME_CREATED, GET_USERS: GET_USERS, PLAYER_JOINED_GAME: PLAYER_JOINED_GAME, UPDATE_USER_SOCKET: UPDATE_USER_SOCKET, UPDATE_SCORE: UPDATE_SCORE, SUBMIT_BOARD: SUBMIT_BOARD,
    GET_OPPONENT_BOARD: GET_OPPONENT_BOARD, ON_NEXT_MOVE: ON_NEXT_MOVE
};

},{}],4:[function(require,module,exports){
'use strict';

var _battleship = require('./battleship');

var battleship = _interopRequireWildcard(_battleship);

var _chat = require('./chat');

var chatClass = _interopRequireWildcard(_chat);

var _user = require('./user');

var userClass = _interopRequireWildcard(_user);

var _events = require('./constants/events');

var events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// console.log(LOBBY)
/**
 * Created by dusan_cvetkovic on 12/5/16.
 */

var user = void 0;
var chat = void 0;
var bs = new battleship.Battleship();
var clientIO = void 0;

function onOpponentBoardSubmit(boardData) {
    if (boardData.user.id != user.user.id) {
        bs.setOpponentBoard(boardData.board);
    }
}
function bindSocketEvents() {
    clientIO.on(events.GET_OPPONENT_BOARD, onOpponentBoardSubmit);
}

$(document).ready(function () {

    function populateHeader(user) {
        $('#header').show();
        $('#header #user').html("Welcome " + user.username);
    }

    function login(result) {
        clientIO = io();
        bindSocketEvents();
        user = new userClass.User(result.user, bs, clientIO);
        chat = new chatClass.Chat(user, clientIO);

        $('.page').hide();
        $('#lobby').show();
        populateHeader(user.user);
    }

    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function () {}, 'json').done(function (result) {
            login(result);
        }).fail(function (error) {
            //TODO update UI
            console.log("error", error);
        });
    });

    $('input#register-submit').click(function (event) {
        event.preventDefault();
        $.post('/register', $('form#register-form').serialize(), function () {}, 'json').done(function (result) {
            login(result);
        }).fail(function (error) {
            //TODO update UI
        });
    });

    $('button#createGame').click(function (event) {
        "use strict";

        clientIO.emit(events.CREATE_GAME, { user: user.user });
    });

    $('#submitBoard').click(function () {
        if (user !== undefined) {
            clientIO.emit(events.SUBMIT_BOARD, user.getBoardData());
        }
        // user.submitBoard()
    });
});

},{"./battleship":1,"./chat":2,"./constants/events":3,"./user":5}],5:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('./constants/events');

var events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisUser = void 0;
var socket = void 0;

var User = function () {
    function User(jsonUser, battleship, socketIO) {
        _classCallCheck(this, User);

        this.user = jsonUser;
        this.battleship = battleship;
        socket = socketIO;
        thisUser = this;

        this.bindSocketEvents();
    }

    _createClass(User, [{
        key: 'bindSocketEvents',
        value: function bindSocketEvents() {
            // this.clientIO.on(events.MESSAGE_SEND, thisChat.onMessageSend);
            // this.clientIO.on(events.GET_USERS, thisChat.onGetUsers);
            // this.clientIO.on(events.CREATE_GAME, thisChat.onGameCreated);
            // this.clientIO.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
        }
    }, {
        key: 'getBoardData',
        value: function getBoardData() {
            return {
                board: thisUser.battleship.getBoard,
                user: thisUser.user,
                game_id: thisUser.userGameId
            };
        }
    }, {
        key: 'startGame',
        value: function startGame(gameId) {
            $('.page').hide();
            $('#game').show();

            var $pieces = $('.ship');
            this.battleship.bindDragEvents($pieces);
            this.battleship.drawBord("p", 0);
            this.battleship.drawBord("o", 10);
            this.battleship.addFireListener(thisUser.onFireEvent);

            if (gameId != undefined) {
                thisUser.userGameId = gameId;
            }
        }
    }, {
        key: 'onFireEvent',
        value: function onFireEvent(fireEvent) {
            socket.emit(events.ON_NEXT_MOVE, {
                game_id: thisUser.userGameId,
                user: thisUser.user,
                fire_event: fireEvent
            });
        }
    }]);

    return User;
}();

module.exports = { User: User };

},{"./constants/events":3}]},{},[4]);
