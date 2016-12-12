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
        this.player_gameboard.addEventListener("drop", this.placeShip, false);
        this.opponent_gameboard.addEventListener("click", this.fire, false);

        this.testBoard = [[0, 0, 0, 1, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        this.testPlayerBoard = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        thisBattleship = this;
    }

    _createClass(Battleship, [{
        key: "drawBord",


        //initialize boards
        value: function drawBord() {
            var _this = this;

            var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "p";
            var left_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 450;

            var i = void 0,
                j = void 0;
            for (i = 0; i < this.rows; i++) {
                var _loop = function _loop() {
                    var top_position = i * _this.square_size;
                    var left_position = left_offset + j * _this.square_size;

                    var player_square = document.createElement("div");
                    _this.player_gameboard.appendChild(player_square);

                    player_square.id = id + i + j;
                    var thisObj = _this;
                    player_square.addEventListener("dragover", function (event) {
                        thisObj.allowDrop(event);
                    });
                    player_square.addEventListener("drop", function (event) {
                        thisObj.onDrop(event);
                    });

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


        // drawBord("p", 0);
        // drawBord("o", 450);

        value: function fire(event) {
            var square = event.target;
            var row = square.id.substring(1, 2);
            var column = square.id.substring(2, 3);
            console.log("(" + row + "," + column + ")");

            switch (this.testBoard[row][column]) {
                case 0:
                    //miss
                    square.style.background = '#bbb';
                    this.testBoard[row][column] = 2;
                    break;
                case 1:
                    //hit
                    square.style.background = 'red';
                    this.testBoard[row][column] = 3;
                    break;
                default:
                    break;
            }

            event.stopPropagation();
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
            var leftOffset = event.dataTransfer.getData("leftOffset");
            var previous_pos_id = document.getElementById(ship).parentNode.id;
            console.log(previous_pos_id);
            console.log(ship);

            var ship_height = parseInt(document.getElementById(ship).style.height) / this.square_size;
            //this.ship_width = parseInt( document.getElementById(ship).style.width) / square_size;
            var ship_width = $($('#' + ship)).width() / this.square_size;

            var square = event.target;
            var row = parseInt(square.id.substring(1, 2));
            var column = parseInt(square.id.substring(2, 3)) - parseInt(leftOffset);

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
        value: function placeShip(pos_id, leftOffset, ship_height, ship_width) {
            pos_id = pos_id.toString();
            var row = parseInt(pos_id.substring(1, 2));
            var column = parseInt(pos_id.substring(2, 3)) - leftOffset;

            var i = void 0;
            if (ship_height > ship_width) {
                for (i = 0; i < ship_height; i++) {
                    this.testPlayerBoard[row + i][column] = 1;
                }
            } else {
                for (i = 0; i < ship_width; i++) {
                    this.testPlayerBoard[row][column + i] = 1;
                }
            }
        }
    }, {
        key: "removeShip",
        value: function removeShip(previous_pos_id, ship_height, ship_width) {
            var row = parseInt(previous_pos_id.substring(1, 2));
            var column = parseInt(previous_pos_id.substring(2, 3));

            var i = void 0;
            if (ship_height > ship_width) {
                for (i = 0; i < ship_height; i++) {
                    this.testPlayerBoard[row + i][column] = 0;
                }
            } else {
                for (i = 0; i < ship_width; i++) {
                    this.testPlayerBoard[row][column + i] = 0;
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
                    switch (this.testPlayerBoard[i][j]) {
                        case 0:
                            document.getElementById("p" + i + j).style.background = "#f6f8f9";
                            break;
                        case 1:
                            document.getElementById("p" + i + j).style.background = "#bbb";
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
            var leftOffset = (event.pageX - event.target.offsetLeft) / thisBattleship.square_size;
            event.dataTransfer.setData("leftOffset", parseInt(leftOffset));
            event.target.style.opacity = "0.4";
        }
    }, {
        key: "dragStop",
        value: function dragStop(event) {
            event.target.style.opacity = "1";
        }
    }, {
        key: "flipShip",
        value: function flipShip(event) {
            //TODO relook at logic
            var parent_id = document.getElementById(event.target.id).parentNode.id;
            var width = event.target.style.width;
            var height = width;
            var ship_height = parseInt(event.target.style.height) / thisBattleship.square_size;
            var ship_width = parseInt(width) / thisBattleship.square_size;

            if (parent_id == "pieces") {
                event.target.style.width = event.target.style.width;
                event.target.style.height = height;
            } else if (thisBattleship.canPlace(parent_id.substring(1, 2), ship_height, parent_id.substring(2, 3), ship_width)) {
                event.target.style.width = event.target.style.width;
                event.target.style.height = height;

                thisBattleship.removeShip(parent_id, ship_height, ship_width);
                thisBattleship.placeShip(parent_id, ship_width, ship_height);
                thisBattleship.redrawBoard();
            } else {
                alert("Connot rotate ship");
            }
        }
    }, {
        key: "canPlace",
        value: function canPlace(row, ship_height, column, ship_width) {
            return row + ship_height <= this.rows && column + ship_width <= this.columns;
        }
    }, {
        key: "bindDragEvents",
        value: function bindDragEvents($pieces) {
            $pieces.attr("draggable", "true");
            // $pieces.on("click", bs.flipShip());
            $pieces.on("dragend", this.dragStop);
            $pieces.on("dragstart", this.dragStart);
        }
    }, {
        key: "getBoard",
        get: function get() {
            return this.player_gameboard;
        }
    }]);

    return Battleship;
}();

module.exports = { Battleship: Battleship };

},{}],2:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by dusan_cvetkovic on 11/1/16.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _events = require("./constants/events");

var events = _interopRequireWildcard(_events);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var thisChat = void 0;

var Chat = function () {
    function Chat(user, socket) {
        _classCallCheck(this, Chat);

        thisChat = this;
        this.user = user;
        this.userSocket = socket;
        this.$usersList = $('#connections');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, thisChat.user);
    }

    _createClass(Chat, [{
        key: "bindSocketEvents",
        value: function bindSocketEvents() {
            this.userSocket.on(events.MESSAGE_SEND, thisChat.onMessageSend);
            this.userSocket.on(events.GET_USERS, thisChat.onGetUsers);
            this.userSocket.on(events.CREATE_GAME, thisChat.onGameCreated);
            this.userSocket.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
        }
    }, {
        key: "onPlayerJoinedGame",
        value: function onPlayerJoinedGame(data) {
            if (data.user.id === thisChat.user.user.id) {
                thisChat.user.startGame();
            }
            console.log("logged to game: ", data);
        }
    }, {
        key: "bindEvents",
        value: function bindEvents() {

            $('form#chat-form').submit(this.onMessageSubmit);
        }
    }, {
        key: "onMessageSend",
        value: function onMessageSend(msg) {
            $('#messages').append($('<li>').addClass("well").text(msg));
            console.log("message received ", msg);
        }
    }, {
        key: "onMessageSubmit",
        value: function onMessageSubmit() {
            this.userSocket.emit(events.MESSAGE_SEND, $('#m').val());
            $('#m').val('');
            console.log("message sent ", $('#m').val());
            return false;
        }
    }, {
        key: "onGetUsers",
        value: function onGetUsers(data) {
            var $userNameItems = "";
            for (var i = 0; i < data.length; i++) {
                $userNameItems += '<li class="list-group-item user" ' + 'id="' + data[i].id + '">' + data[i].username + '</li>';
            }
            // this.$usersList.appendChild($userNameItems);
            thisChat.$usersList.html($userNameItems);
        }
    }, {
        key: "onGameCreated",
        value: function onGameCreated(data) {
            var user = data.userCreatedGame;
            var joinButton = $('<button />').addClass('btn-join').addClass('btn-sm').addClass('btn-primary').addClass('pull-right').attr("id", user.id).text('Join Game');

            if ($('#connections .btn-join #' + user.id).length == 0) {
                $('#connections li#' + user.id).append(joinButton);
                joinButton.on('click', function () {
                    thisChat.onJoinGame(data.gameId);
                });
            }

            if (this.id === data.mySocketId) {
                thisChat.user.startGame();
            }
        }
    }, {
        key: "onJoinGame",
        value: function onJoinGame(gameId) {
            this.userSocket.emit(events.PLAYER_JOIN_GAME, {
                gameId: gameId,
                user: this.user.user,
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

var FIND_LEADER = 'findLeader';

// Host Events
var CREATE_GAME = 'hostCreateNewGame';
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

// lobby
// const PLAYER_RESTART = 'playerRestart';

module.exports = { LOBBY: LOBBY, USER_JOINED: USER_JOINED, MESSAGE_SEND: MESSAGE_SEND, FIND_LEADER: FIND_LEADER,
    CREATE_GAME: CREATE_GAME, GAME_START: GAME_START, COUNTDOWN: COUNTDOWN, NEXT_MOVE: NEXT_MOVE, PLAYER_JOIN_GAME: PLAYER_JOIN_GAME, PLAYER_MOVE: PLAYER_MOVE, PLAYER_RESTART: PLAYER_RESTART,
    NEW_GAME_CREATED: NEW_GAME_CREATED, GET_USERS: GET_USERS, PLAYER_JOINED_GAME: PLAYER_JOINED_GAME
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

$(document).ready(function () {
    var user = void 0;
    var chat = void 0;
    var bs = new battleship.Battleship();
    var clientIO = void 0;

    $('input#login-submit').click(function (event) {
        event.preventDefault();
        $.post('/login', $('form#login-form').serialize(), function () {}, 'json').done(function (result) {
            clientIO = io();
            user = new userClass.User(result.user, bs);

            chat = new chatClass.Chat(user, clientIO);

            $('.page').hide();
            $('#lobby').show();
        }).fail(function (error) {
            console.log("error", error);
        });
    });

    $('button#createGame').click(function (event) {
        "use strict";

        clientIO.emit(events.CREATE_GAME);
    });

    $('#submitBoard').click(function () {
        if (user !== undefined) user.submitBoard(bs.getBoard());
    });
});

},{"./battleship":1,"./chat":2,"./constants/events":3,"./user":5}],5:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
    function User(jsonUser, battleship) {
        _classCallCheck(this, User);

        this.user = jsonUser;
        this.battleship = battleship;
    }

    // get user(){
    //     return this._user;
    // }


    // get socket(){
    //     return this._socket;
    // }

    _createClass(User, [{
        key: "submitBoard",
        value: function submitBoard(board, gameId) {
            $.ajax({
                type: "POST",
                url: "/submit/board",
                data: { board: board, user: this, game_id: gameId },
                success: function success(_success) {
                    console.log("Submit board succeed: ", _success);
                },
                dataType: json
            });
        }
    }, {
        key: "startGame",
        value: function startGame() {
            $('.page').hide();
            $('#game').show();

            var $pieces = $('.ship');
            this.battleship.bindDragEvents($pieces);
            this.battleship.drawBord("p", 0);
            this.battleship.drawBord("o", 450);
        }
    }]);

    return User;
}();

module.exports = { User: User };

},{}]},{},[4]);
