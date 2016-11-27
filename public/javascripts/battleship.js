var rows = 10;
var columns = 10;
var square_size = 60;

var player_gameboard = document.getElementById( "player_board");
var opponent_gameboard = document.getElementById( "opponent_board");

//initialize boards
for( i = 0; i < rows; i++)
{
    for( j = 0; j < columns; j++)
    {
        var top_position = i * square_size;
        var left_position = j * square_size;

        var player_square = document.createElement("div");
        player_gameboard.appendChild( player_square);

        player_square.id = "p" + i + j;
        player_square.addEventListener( "dragover", allowDrop);
        player_square.addEventListener( "drop", onDrop);

        player_square.style.top = top_position + "px";
        player_square.style.left = left_position + "px";
    }
}


for( i = 0; i < rows; i++)
{
    for( j = 0; j < columns; j++)
    {
        var top_position = i * square_size;
        var left_position = j * square_size;

        var opponent_square = document.createElement("div");
        opponent_gameboard.appendChild( opponent_square);

        opponent_square.id = "o" + i + j;

        opponent_square.style.top = top_position + "px";
        opponent_square.style.left = left_position + "px";
    }
}

var testBoard = [
                [0,0,0,1,1,1,1,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,1,0,0,0],
                [0,0,0,0,0,0,1,0,0,0],
                [1,0,0,0,0,0,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0],
                [1,0,0,1,0,0,0,0,0,0],
                [1,0,0,1,0,0,0,0,0,0],
                [1,0,0,0,0,0,0,0,0,0]
                ]

var testPlayerBoard =   [
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0],
                        [0,0,0,0,0,0,0,0,0,0]
                        ]

// player_gameboard.addEventListener( "drop", placeShip, false);
opponent_gameboard.addEventListener( "click", fire, false);

function fire( event) {
    var square = event.target;
    var row = square.id.substring(1,2);
    var column = square.id.substring(2,3);
    console.log( "(" + row + "," + column + ")");

    switch( testBoard[ row][ column]) {
        case 0: //miss
            square.style.background = '#bbb';
            testBoard[ row][ column] = 2;
            break;
        case 1: //hit
            square.style.background = 'red';
            testBoard[ row][ column] = 3;
            break;
        default:
            break;
    }

    event.stopPropagation();
}

function allowDrop( event) {
    event.preventDefault();
}

function onDrop( event) {
    event.preventDefault();
    var ship = event.dataTransfer.getData( "text");
    var previous_pos_id = document.getElementById( ship).parentNode.id;
    console.log( previous_pos_id);
    console.log( ship);

    var ship_height = parseInt( document.getElementById(ship).style.height) / square_size;
    var ship_width = parseInt( document.getElementById(ship).style.width) / square_size;

    var square = event.target;
    var row = parseInt( square.id.substring( 1, 2));
    var column = parseInt( square.id.substring( 2, 3));

    //console.log( "(" + row + "," + column + ") + (" + ship_height + "," + ship_width + ")" );

    if( canPlace( row, ship_height, column, ship_width)) {
        if( previous_pos_id != "pieces" && canPlace())
            removeShip( previous_pos_id, ship_height, ship_width);
        placeShip( square.id, ship_height, ship_width);
        square.appendChild( document.getElementById( ship));
    } else {
        alert( "Ship cannot be placed");
    }

    //console.log( document.getElementById( ship));
    redrawBoard();
}

function placeShip( pos_id, ship_height, ship_width) {
    var row = parseInt( pos_id.substring( 1, 2));
    var column = parseInt( pos_id.substring( 2, 3));

    if( ship_height > ship_width) {
        for( i = 0; i < ship_height; i++ )
            testPlayerBoard[ row + i][ column] = 1;
    } else {
        for( i = 0; i < ship_width; i++)
            testPlayerBoard[ row][ column + i] = 1;
    }
}

function removeShip( previous_pos_id, ship_height, ship_width) {
    var row = parseInt( previous_pos_id.substring( 1, 2));
    var column = parseInt( previous_pos_id.substring( 2, 3));

    if( ship_height > ship_width) {
        for( i = 0; i < ship_height; i++ )
            testPlayerBoard[ row + i][ column] = 0;
    } else {
        for( i = 0; i < ship_width; i++)
            testPlayerBoard[ row][ column + i] = 0;
    }
}

function redrawBoard( ) {
    for( i = 0; i < rows; i++) {
        for( j = 0; j < columns; j++) {
            switch( testPlayerBoard[ i][ j]) {
                case 0:
                    document.getElementById( "p" + i + j).style.background = "#f6f8f9";
                    break;
                case 1:
                    document.getElementById( "p" + i + j).style.background = "#bbb";
                    break;
            }
        }
    }
}

function dragStart( event) {
    event.dataTransfer.setData( "text", event.target.id);
    event.target.style.opacity = "0.4";
}

function dragStop( event) {
    event.target.style.opacity = "1";
}

function flipShip( event) {
    //TODO relook at logic
    var parent_id = document.getElementById( event.target.id).parentNode.id;
    var width = event.target.style.width;
    var ship_height = parseInt( event.target.style.height) / square_size;
    var ship_width = parseInt( width) / square_size;

    if( parent_id == "pieces" ) {
        event.target.style.width = event.target.style.height;
        event.target.style.height = width;
    } else if ( canPlace( parent_id.substring(1,2), ship_width, parent_id.substring(2,3),ship_height)) {
        event.target.style.width = event.target.style.height;
        event.target.style.height = width;

        removeShip( parent_id, ship_height, ship_width);
        placeShip( parent_id, ship_width, ship_height);
        redrawBoard();
    } else {
        alert( "Connot rotate ship");
    }
}

function canPlace( row, ship_height, column, ship_width) {
    return ((row + ship_height <= rows) && (column + ship_width <= columns));
}