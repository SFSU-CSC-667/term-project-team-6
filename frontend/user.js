import * as events from "./constants/events"

let thisUser;
let socket;

class User {

    constructor(jsonUser, battleship, socketIO) {
        this.user = jsonUser;
        this.battleship = battleship;
        socket = socketIO;
        thisUser = this;

        this.bindSocketEvents()
    }

    bindSocketEvents() {
        // this.clientIO.on(events.MESSAGE_SEND, thisChat.onMessageSend);
        // this.clientIO.on(events.GET_USERS, thisChat.onGetUsers);
        // this.clientIO.on(events.CREATE_GAME, thisChat.onGameCreated);
        // this.clientIO.on(events.PLAYER_JOINED_GAME, thisChat.onPlayerJoinedGame);
    }

    getBoardData() {
        return {
            board: thisUser.battleship.getBoard,
            user: thisUser.user,
            game_id: thisUser.userGameId
        };
    }

    startGame(gameId) {
        $('.page').hide();
        $('#game').show();

        const $pieces = $('.ship');
        this.battleship.bindDragEvents($pieces);
        this.battleship.drawBord("p", 0);
        this.battleship.drawBord("o", 10);
        this.battleship.addFireListener(thisUser.onFireEvent);

        if (gameId != undefined) {
            thisUser.userGameId = gameId;
        }
    }

    onFireEvent(fireEvent) {
        socket.emit(events.ON_NEXT_MOVE, {
            game_id: thisUser.userGameId,
            user: thisUser.user,
            fire_event:fireEvent
        });
    }

}

module.exports = {User};