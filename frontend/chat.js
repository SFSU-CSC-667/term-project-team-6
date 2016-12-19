/**
 * Created by dusan_cvetkovic on 11/1/16.
 */
import * as events from "./constants/events"
import * as gameClass from "./game"

let thisChat;

class Chat {
    constructor(user, socket) {
        thisChat = this;
        this.user = user.user;
        this.userObj = user;
        this.userSocket = socket;
        this.$usersList = $('#connections');
        this.$highScores = $('#highscore');

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, thisChat.user);
    }

    bindSocketEvents() {
        this.userSocket.on(events.CREATE_GAME, thisChat.onGameCreated);
        this.userSocket.on(events.MESSAGE_SEND, function (messageData) {
            thisChat.onMessageReceived(messageData, '#messages')
        });
        this.userSocket.on(events.GAME_MESSAGE_SEND, function (messageData) {
            thisChat.onMessageReceived(messageData, '#game-messages')
        });
        this.userSocket.on(events.GET_USERS, thisChat.onGetUsers);
        this.userSocket.on(events.GET_HIGH_SCORES, thisChat.onGetHighScores);
        this.userSocket.on(events.UPDATE_USER_SOCKET, thisChat.onUpdateUserSocket);
    }

    onGameCreated(data) {
        const gameCreator = data.userCreatedGame;
        const joinButton = thisChat.buildJoinButton(gameCreator.id);

        const game = new gameClass.Game(data.gameId, thisChat.userSocket,
            gameCreator, true);

        if ($('#connections .btn-join #' + gameCreator.id).length == 0) {
            $('#connections li#' + gameCreator.id).append(joinButton);
            joinButton.on('click', function () {
                game.onJoinGame(thisChat.user, thisChat.userSocket.id);
            });
        }

        if (this.id === data.mySocketId) {
            game.startGame();
        }
    }

    onUpdateUserSocket(data) {
        console.log(data);
        if (data.id == thisChat.user.id) {
            thisChat.userObj.user = data;
            thisChat.user = thisChat.userObj.user;
        }
    }


    bindEvents() {

        $('form#chat-form').submit(function (event) {
            event.preventDefault();
            thisChat.onMessageSubmit('#m', events.MESSAGE_SEND);
        });

        $('form#game-chat-form').submit(function (event) {
            event.preventDefault();
            thisChat.onMessageSubmit('#game-message', events.GAME_MESSAGE_SEND);
        });
    }

    onMessageReceived(msg, selector) {
        $(selector).append($('<li>').addClass("well")
            .text(msg.user.username + " : " + msg.message));
        console.log("message received ", msg)
    }

    onMessageSubmit(selector, socketEvent) {
        this.userSocket.emit(socketEvent,
            {message:$(selector).val(), user:thisChat.user});
        $(selector).val('');
        console.log("message sent ", $(selector).val());
        return false;
    }

    onGetUsers(data) {
        // let $userNameItems = "";
        thisChat.$usersList.html("");
        const usersList = data.usersList;
        usersList.forEach(function (user) {
            const $userNameItem = $('<li/>')
                .addClass("list-group-item")
                .addClass("user")
                .attr("id", user.id)
                .html(user.username);
            data.games.some(function (game) {
                if (user.socket_id == game.socket_created) {
                    console.log(game);
                    const joinButton = thisChat.buildJoinButton(user.id);
                    joinButton.on('click', function () {
                        const gameObj = new gameClass.Game(game.id, thisChat.userSocket,
                            user);
                        gameObj.onJoinGame(thisChat.user, thisChat.userSocket.id);
                    });
                    $userNameItem.append(joinButton);
                    return true;
                }
            });
            thisChat.$usersList.append($userNameItem);
        });
    }

    onGetHighScores(data) {
        // let $userNameItems = "";
        thisChat.$highScores.html("");
        const usersList = data.usersList;
        usersList.forEach(function (score) {
            const highScoreItem = $('<li/>')
                .addClass("score-list");
            const $name = $('<div/>')
                .addClass("score-name")
                .html(score.username);
            const $score = $('<div/>')
                .addClass("score")
                .html(score.score);
            highScoreItem.append($name);
            highScoreItem.append($score);

            thisChat.$highScores.append(highScoreItem)
        });
    }


    buildJoinButton(userID) {
        return $('<button />')
            .addClass('btn-join')
            .addClass('btn-sm')
            .addClass('btn-primary')
            .addClass('pull-right')
            .attr("id", userID)
            .text('Join Game');
    }


}

module.exports = {Chat};



