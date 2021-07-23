import {
    MAX_USERS_IN_ROOM,
    firebaseConfig
} from "./constants.js";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

export class Online {
    constructor(userName) {
        this.userName = userName;
        this.randomInt = Math.floor(Math.random() * 2 ** 63);
    }

    /**
     * Создаёт игровую комнату
     *
     * Возвращает Promise
     */
    createGame() {
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
     * Подключает пользователя к игровой комнате.
     *
     * Возвращает Promise, где
     * null - комнаты не существует
     * true - успешный вхлж в комнату
     * false - камната заполнена
     */
    joinGame(roomId) {
        return database.ref('gameRooms/' + roomId).transaction((roomData) => {
            if (!roomData)
                return roomData;
            if (Object.keys(roomData['users']).length + 1 <= MAX_USERS_IN_ROOM)
                roomData['users'][this.randomInt] = this.userName;

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
        database.ref('gameRooms/' + this.roomId).transaction((roomData) => {
            console.log(roomData);
            if (!roomData)
                return roomData;
            if (Object.keys(roomData.users).length - 1 <= 0)
                roomData = null;
            else
                delete roomData.users[this.randomInt];
            console.log(roomData);
            return roomData;
        });
    }
}
