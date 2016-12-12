const LOBBY = 'lobby';
const USER_JOINED = 'user-joined';
const MESSAGE_SEND = 'message-send';
const GET_USERS = 'get-connections';

const FIND_LEADER = 'findLeader';

// Host Events
const CREATE_GAME = 'hostCreateNewGame';
const GAME_START = 'hostRoomFull';
const COUNTDOWN = 'hostCountdownFinished';
const NEXT_MOVE = 'hostNextRound';

// Player Events
const PLAYER_JOIN_GAME = 'playerJoinGame';
const PLAYER_MOVE = 'playerAnswer';
const PLAYER_RESTART = 'playerRestart';

// game events
const NEW_GAME_CREATED = 'newGameCreated';
const PLAYER_JOINED_GAME = 'playerJoinedGame';

// lobby
// const PLAYER_RESTART = 'playerRestart';

module.exports = {LOBBY, USER_JOINED, MESSAGE_SEND, FIND_LEADER,
    CREATE_GAME, GAME_START, COUNTDOWN, NEXT_MOVE, PLAYER_JOIN_GAME, PLAYER_MOVE, PLAYER_RESTART,
    NEW_GAME_CREATED, GET_USERS, PLAYER_JOINED_GAME
};