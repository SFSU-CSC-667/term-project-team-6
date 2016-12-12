class User {

    constructor(jsonUser, battleship) {
        this.user = jsonUser;
        this.battleship = battleship;
    }

    // get user(){
    //     return this._user;
    // }


    // get socket(){
    //     return this._socket;
    // }

    submitBoard(board, gameId) {
        $.ajax({
            type: "POST",
            url: "/submit/board",
            data: {board: board, user: this, game_id: gameId},
            success: function (success) {
                console.log("Submit board succeed: ", success)
            },
            dataType: json
        });
    }

    startGame() {
        $('.page').hide();
        $('#game').show();

        const $pieces = $('.ship');
        this.battleship.bindDragEvents($pieces);
        this.battleship.drawBord("p", 0);
        this.battleship.drawBord("o", 450);
    }

}

module.exports = {User};