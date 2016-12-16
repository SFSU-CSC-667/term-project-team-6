let thisBattleship;

class Battleship {

    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.square_size = 40;

        this.player_gameboard = document.getElementById("player_board");
        this.opponent_gameboard = document.getElementById("opponent_board");
        // this.player_gameboard.addEventListener("drop", this.placeShip, false);
        this.opponent_gameboard.addEventListener("click", this.fire, false);

        this.testBoard = [
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.testPlayerBoard = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        this.placedShips = {};

        thisBattleship = this;
    }

    get getBoard() {
        return JSON.stringify(this.placedShips)
    }

    //initialize boards
    drawBord(id = "p", left_offset = 450) {
        let i, j;
        for (i = 0; i < this.rows; i++) {
            for (j = 0; j < this.columns; j++) {
                const top_position = i * this.square_size;
                const left_position = left_offset + j * this.square_size;

                const player_square = document.createElement("div");
                this.player_gameboard.appendChild(player_square);

                player_square.id = id + i + j;
                const thisObj = this;
                player_square.addEventListener("dragover", function (event) {
                    thisObj.allowDrop(event)
                });
                player_square.addEventListener("drop", function (event) {
                    thisObj.onDrop(event)
                });

                player_square.style.top = top_position + "px";
                player_square.style.left = left_position + "px";
            }
        }
    };


    // drawBord("p", 0);
    // drawBord("o", 450);

    fire(event) {
        const square = event.target;
        let row = square.id.substring(1, 2);
        let column = square.id.substring(2, 3);
        console.log("(" + row + "," + column + ")");

        switch (this.testBoard[row][column]) {
            case 0: //miss
                square.style.background = '#bbb';
                this.testBoard[row][column] = 2;
                break;
            case 1: //hit
                square.style.background = 'red';
                this.testBoard[row][column] = 3;
                break;
            default:
                break;
        }

        event.stopPropagation();
    };

    allowDrop(event) {
        event.preventDefault();
    };

    onDrop(event) {
        event.preventDefault();
        const ship = event.dataTransfer.getData("text");
        const leftOffset = event.dataTransfer.getData("leftOffset");
        const previous_pos_id = document.getElementById(ship).parentNode.id;
        console.log(previous_pos_id);
        console.log(ship);

        const ship_height = parseInt(document.getElementById(ship).style.height) / this.square_size;
        //this.ship_width = parseInt( document.getElementById(ship).style.width) / square_size;
        const ship_width = $($('#' + ship)).width() / this.square_size;

        const square = event.target;
        const row = parseInt(square.id.substring(1, 2));
        let column = parseInt(square.id.substring(2, 3)) - parseInt(leftOffset);

        if (column >= 0 && this.canPlace(row, ship_height, column, ship_width)) {
            if (previous_pos_id != "pieces")
                this.removeShip(previous_pos_id, ship_height, ship_width);
            this.placeShip(square.id, leftOffset, ship_height, ship_width);
            square.appendChild(document.getElementById(ship));
        } else {
            alert("Ship cannot be placed");
        }

        //console.log( document.getElementById( ship));
        this.redrawBoard();
    };

    placeShip(pos_id, leftOffset, shipHeight, shipWidth) {
        pos_id = pos_id.toString();
        const row = parseInt(pos_id.substring(1, 2));
        const column = parseInt(pos_id.substring(2, 3)) - leftOffset;

        let ship = [];

        let i;
        if (shipHeight > shipWidth) {
            for (i = 0; i < shipHeight; i++){
                this.testPlayerBoard[row + i][column] = 1;
                ship.push({row:row+i, column:column});
            }
        } else {
            for (i = 0; i < shipWidth; i++){
                this.testPlayerBoard[row][column + i] = 1;
                ship.push({row:row, column:column+i});
            }
        }

        this.placedShips[this.currentShipId] = ship
    };

    removeShip(previous_pos_id, ship_height, ship_width) {
        const row = parseInt(previous_pos_id.substring(1, 2));
        const column = parseInt(previous_pos_id.substring(2, 3));

        let i;
        if (ship_height > ship_width) {
            for (i = 0; i < ship_height; i++)
                this.testPlayerBoard[row + i][column] = 0;
        } else {
            for (i = 0; i < ship_width; i++)
                this.testPlayerBoard[row][column + i] = 0;
        }
    };

    redrawBoard() {
        let i, j;
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
    };

    dragStart(event, domElement) {
        event.dataTransfer = event.originalEvent.dataTransfer;
        event.dataTransfer.setData("text", event.target.id);
        const leftOffset = (event.pageX - event.target.offsetLeft) / thisBattleship.square_size;
        event.dataTransfer.setData("leftOffset", parseInt(leftOffset));
        event.target.style.opacity = "0.4";

        thisBattleship.currentShipId = event.target.id;
    };

    dragStop(event) {
        event.target.style.opacity = "1";
    };

    flipShip(event) {
        //TODO relook at logic
        const parent_id = document.getElementById(event.target.id).parentNode.id;
        const width = event.target.style.width;
        const height = width;
        const ship_height = parseInt(event.target.style.height) / thisBattleship.square_size;
        const ship_width = parseInt(width) / thisBattleship.square_size;

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
    };

    canPlace(row, ship_height, column, ship_width) {
        return ((row + ship_height <= this.rows) && (column + ship_width <= this.columns));
    }

    bindDragEvents($pieces) {
        $pieces.attr("draggable", "true");
        // $pieces.on("click", bs.flipShip());
        $pieces.on("dragend", this.dragStop);
        $pieces.on("dragstart", this.dragStart);
    }
}

module.exports = {Battleship};

