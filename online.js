import {
    MAX_USERS_IN_ROOM,
    firebaseConfig,
} from "./constants.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export class Online {
    constructor(userName=undefined) {
        this.userName = userName;
        this.randomInt = Math.floor(Math.random() * 2 ** 63);
        this.roomId = null;
        this.table = null;
        this.host = null;
        this.nowTurn = null;
    }

    setName(userName){
        this.userName = userName;
    }

    /**
     * Создаёт игровую комнату
     */
    createGame() {
        this.host = true;
        return database.ref('gameRooms').get()
            .then((snapshot) => {
                let data = {};
                if (snapshot.exists()) {
                    data = snapshot.val();
                } else {
                }
                console.log(data);

                // найти свободный номер комнаты
                let roomId;
                do {
                    roomId = Math.floor(100000 + Math.random() * 900000);
                } while (data.hasOwnProperty(roomId))

                database.ref('gameRooms/' + roomId).set({
                    status: "wait",
                    users: {[this.randomInt]: this.userName},
                })
                this.roomId = roomId;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    /**
     * Получить список игровых комнат
     * Возвращает Promise
     */
    getRoomList() {
        return database.ref('gameRooms').get()
            .then((snapshot) => {
                return snapshot.val();
            });
    }

    /**
     * Подключает пользователя к игровой комнате.
     *
     * Возвращает Promise, где
     * null - комнаты не существует
     * true - успешный вхлж в комнату
     * false - камната заполнена
     */
    joinGame(roomId) {
        this.host = false;
        return database.ref('gameRooms/' + roomId).transaction((roomData) => {
            if (!roomData)
                return roomData;
            if (roomData.status === 'wait' && Object.keys(roomData.users).length + 1 <= MAX_USERS_IN_ROOM)
                roomData.users[this.randomInt] = this.userName;

            return roomData;
        })
            .then((roomData) => {
                let snapshot = roomData.snapshot.val()
                console.log(snapshot);
                if (!snapshot)
                    return null;
                let status = Boolean(snapshot.users[this.randomInt] && snapshot.users[this.randomInt] === this.userName);
                if (status)
                    this.roomId = roomId;
                return status;
            });
    }

    /**
     * Отключает игрока от комнаты
     */
    leaveGame() {
        database.ref('gameRooms/' + this.roomId).transaction((snapshot) => {
            if (!snapshot)
                return snapshot;
            if (Object.keys(snapshot.users).length - 1 <= 0)
                snapshot = null;
            else
                delete snapshot.users[this.randomInt];
            return snapshot;
        })
            .then(() => {
                this.roomId = null;
            });
        database.ref('gameSessions/' + this.roomId).transaction((snapshot) => {
            if (!snapshot)
                return snapshot;
            if (Object.keys(snapshot.players).length - 1 <= 0)
                snapshot = null;
            else
                delete snapshot.players[this.randomInt];
            return snapshot;
        })
            .then(() => {
                this.roomId = null;
            });
        console.log(database.ref('gameSessions/' + this.roomId).off('value'));
    }

    startGame(startGameTable) {  // запускает только создатель лобби
        if (!this.host)
            return;
        database.ref('gameRooms/' + this.roomId + '/status').set('run')
        database.ref('gameRooms/' + this.roomId + '/users').get()
            .then((snapshot) => {
                this.players = snapshot.val();
            })
            .then(() => {
                let playersId = Object.keys(this.players);
                database.ref('gameSessions/' + this.roomId).set({
                    table: startGameTable,
                    players: this.players,
                    nowTurn: playersId[Math.floor(Math.random() * playersId.length)]
                })
            });
    }

    startListeningGameInfo() {
        return database.ref('gameSessions/' + this.roomId).on('value', (snapshot) => {
            let data = snapshot.val();
            console.log("new data");
            if (!data)
                return;
            this.table = data.table;
            this.nowTurn = data.nowTurn;
            this.players = data.players;
        });
    }

    getTable() {
        return this.table;
    }

    isHost(){
        return this.host;
    }

    makeMove(newTable) {
        let playersId = Object.keys(this.players);
        database.ref('gameSessions/' + this.roomId).update({
            table: newTable,
            nowTurn: this.players[playersId[(playersId.indexOf(this.randomInt.toString()) + 1) % playersId.length]],
        });
    }
}
