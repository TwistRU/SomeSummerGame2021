export class Offline {
    constructor(userName) {
        this.userName = userName;
        this.randomInt = Math.floor(Math.random() * 2 ** 63);
        this.gameRoom = {};
        this.roomId = 'Offline'
    }

    createGame() {
        this.gameRoom = {
            status: 'wait',
            users: {[this.randomInt]: this.userName}
        };
    }

    joinGame() {
        this.gameRoom.users[this.randomInt] = this.userName;
    }

    leaveGame() {
        delete this.gameRoom.users[this.randomInt];
    }
}