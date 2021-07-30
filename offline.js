import {
    MAX_USERS_IN_ROOM,
} from "./constants.js";

import {
    genTable,
} from "./game-logic.js";

let gameRoom = {};
let gameSession = {};
let players = {};

export class Offline {
    constructor(userName) {
        this.userName = userName;
        this.randomInt = Math.floor(Math.random() * 2 ** 63);
        this.roomId = 'Offline';
        this.table = null;
        this.host = null;
    }

    createGame() {
        this.host = null;
        gameRoom = {
            status: 'wait',
            users: {[this.randomInt]: this.userName}
        };
    }

    joinGame() {  // используется для добавления ботов
        this.host = false;
        return new Promise((resolve) => {
            if (gameRoom.users && Object.keys(gameRoom.users).length + 1 <= MAX_USERS_IN_ROOM) {
                gameRoom.users[this.randomInt] = this.userName;
                resolve(true);
            }
            resolve(false);
        });
    }

    leaveGame() {
        this.host = null;
        gameRoom = {};
        gameSession = {};
    }

    startGame() {
        if (!this.host)
            return;
        gameRoom.status = 'run';

        players = gameRoom.users;
        let playersId = Object.keys(players);
        gameSession = {
            table: genTable(),
            players: players,
            nowTurn: playersId[Math.floor(Math.random() * playersId.length)]
        };
    }

    startListeningGameInfo() {
        // pass
    }

    getTable() {
        return this.table;
    }

    makeMove(newTable) {
        let playersId = Object.keys(players);
        gameSession.table = newTable;
        gameSession.nowTurn = players[playersId[(playersId.indexOf(this.randomInt.toString()) + 1) % playersId.length]];
    }
}