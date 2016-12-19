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

        this.bindEvents();
        this.bindSocketEvents();

        this.userSocket.emit(events.USER_JOINED, thisChat.user);
    }

    bindSocketEvents() {
        this.userSocket.on(events.CREATE_GAME, thisChat.onGameCreated);
        this.userSocket.on(events.MESSAGE_SEND, thisChat.onMessageSend);
        this.userSocket.on(events.GET_USERS, thisChat.onGetUsers);
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
            thisChat.onMessageSubmit();
        });
    }

    onMessageSend(msg) {
        $('#messages').append($('<li>').addClass("well").text(msg));
        console.log("message received ", msg)
    }

    onMessageSubmit() {
        this.userSocket.emit(events.MESSAGE_SEND, $('#m').val());
        $('#m').val('');
        console.log("message sent ", $('#m').val());
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
                        const game = new gameClass.Game(game.id, thisChat.userSocket,
                            user);
                        game.onJoinGame(thisChat.user, thisChat.userSocket.id);
                    });
                    $userNameItem.append(joinButton);
                    return true;
                }
            });
            thisChat.$usersList.append($userNameItem);
        });

        // this.$usersList.appendChild($userNameItems);


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



