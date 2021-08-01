export class UI {
    constructor(online, funcNickname, funcNext) {
        this.divContainerStartScreen = document.createElement('div');
        this.divContainerRoomsListScreen = document.createElement('div');
        this.nickname = "";
        this.online = online;
        this.nextFunc = funcNext;
        this.nicknameFunc = funcNickname;
    }

    enterStartScreen(nextFunc = undefined) {
        let upperText = document.createTextNode("Введите никнейм: ");
        upperText.className = 'flexitem';
        this.divContainerStartScreen.className = 'flexcontainer';
        let userInputName = document.createElement("input");
        userInputName.className = 'flexitem';
        let enterButton = document.createElement('button');
        enterButton.textContent = "Продолжить";
        enterButton.className = 'flexitem';
        enterButton.onclick = () => {
            this.exitStartScreen();
        };
        this.userInputName = userInputName;
        this.divContainerStartScreen.append(upperText);
        this.divContainerStartScreen.append(userInputName);
        this.divContainerStartScreen.append(enterButton);
        document.body.append(this.divContainerStartScreen);
    }

    exitStartScreen() {
        this.nickname = this.userInputName.value;
        this.online.setName(this.nickname);
        this.nicknameFunc(this.nickname);
        this.divContainerStartScreen.remove();
        console.log("Nickname: " + this.nickname);
        this.enterRoomsListScreen()
    }

    enterRoomsListScreenAgain() {
        document.body.append(this.divContainerRoomsListScreen);
    }

    enterRoomsListScreen() {
        this.divContainerRoomsListScreen.style =
            "width: 100%;" +
            "display: flex;" +
            "flex-direction: row;" +
            "flex-wrap: nowrap;";
        // setup
        let leftContainer = document.createElement('div');
        leftContainer.className = 'flexcontainer';
        leftContainer.style = "flex-grow: 2;";
        let updateRoomListButton = document.createElement('button');
        updateRoomListButton.textContent = 'Обновить список комнат';
        updateRoomListButton.onclick = () => {
            console.log(this.online)
            this.online.getRoomList().then((rooms) => {
                console.log(rooms);
                this.fillRoomList(rooms);
            })
        }
        let leftUpperText = document.createTextNode("Список текущих комнат: ");
        let leftTable = document.createElement('table');
        leftTable.id = 'roomList';
        leftTable.insertRow();
        leftTable.rows[0].insertCell(0).textContent = "RoomID";
        leftTable.rows[0].insertCell(1).textContent = 'Users';
        leftTable.rows[0].insertCell(2).textContent = 'Status';
        let rightContainer = document.createElement('div');
        rightContainer.className = 'flexcontainer';
        rightContainer.style = "flex-grow: 1;";
        let rightUpperText = document.createTextNode("Введите RoomId чтобы присоединиться к комнате ");
        let userInputRoomId = document.createElement("input");
        userInputRoomId.className = 'flexitem';
        let enterButton = document.createElement('button');
        let rightMiddleText = document.createTextNode("или");
        let createButton = document.createElement('button');
        createButton.textContent = 'Создать комнату';
        createButton.onclick = () => {
            this.online.createGame().then(()=>{
                this.roomId = this.online.roomId;
                this.exitRoomsListScreen();
                this.enterRoomScreen();
            });
        };
        enterButton.textContent = "Войти";
        enterButton.className = 'flexitem';
        enterButton.onclick = () => {
            this.connectToRoom(userInputRoomId.value)
        };
        // "appending"
        document.body.append(this.divContainerRoomsListScreen);
        this.divContainerRoomsListScreen.append(leftContainer);
        leftContainer.append(updateRoomListButton);
        leftContainer.append(leftUpperText);
        leftContainer.append(leftTable);
        this.divContainerRoomsListScreen.append(rightContainer);
        rightContainer.append(rightUpperText);
        rightContainer.append(userInputRoomId);
        rightContainer.append(enterButton);
        rightContainer.append(rightMiddleText);
        rightContainer.append(createButton);
    }

    fillRoomList(rooms) {
        let leftTable = document.getElementById('roomList');
        console.log('filling table');
        for (let i = 0; leftTable.rows.length !== 1; i++) {
            leftTable.deleteRow(1);
        }
        let i = 1;
        for (const room in rooms) {
            leftTable.insertRow(-1);
            leftTable.rows[i].insertCell(0).textContent = room;
            leftTable.rows[i].insertCell(1);
            for (const user in rooms[room].users) {
                leftTable.rows[i].cells.item(1).append(rooms[room].users[user] + " ");
            }
            leftTable.rows[i].insertCell(-1).textContent = rooms[room].status;
            i++;
        }
    }

    setTimeTextToUpperRight(sometext) {
        let text = document.createElement('p');
        text.textContent = sometext;
        this.divContainerRoomsListScreen.children.item(1).prepend(text);
        setTimeout(() => {
            text.remove()
        }, 1000);
    }

    connectToRoom(roomId) {
        console.log(this.online);
        this.roomId = roomId;
        this.online.joinGame(roomId).then((res) => {
            switch (res) {
                case null:
                    this.setTimeTextToUpperRight('Комнаты не существует');
                    break;
                case false:
                    this.setTimeTextToUpperRight('Комната переполнена');
                    break;
                case true:
                    this.setTimeTextToUpperRight('Будет выполнен переход в игровую комнату');
                    setTimeout(() => {
                        this.exitRoomsListScreen();
                        this.enterRoomScreen();
                    }, 1000);
                    break;
                default:
                    this.setTimeTextToUpperRight('Произошла ошибка. Попробуйте ещё раз');
            }
        });
    }

    exitRoomsListScreen() {
        this.divContainerRoomsListScreen.remove();
    }

    enterRoomScreen() {
        // setup
        this.divContainerRoomScreen = document.createElement('div');
        this.divContainerRoomScreen.className = 'flexcontainer';
        let text_update_Container = document.createElement('div');
        text_update_Container.style =
            "display: flex;" +
            "flex-direction: row;" +
            "flew-wrap: nowrap";
        let upperText = document.createElement('p');
        upperText.textContent = 'Информация о комнате - ';
        let updateButton = document.createElement('button');
        updateButton.textContent = 'Обновить';
        updateButton.onclick = () => {
            this.online.getRoomList().then((rooms) => {
                    console.log(this.roomId);
                    this.fillRoom(rooms[this.roomId]);
                }
            )
        }
        let roomInfo = document.createElement('div');
        roomInfo.id = 'roominfo';
        let leaveButton = document.createElement('button');
        leaveButton.id = 'leaveButton';
        leaveButton.textContent = 'Выйти из комнаты';
        leaveButton.onclick = () => {
            this.online.leaveGame();
            this.exitRoomScreen();
            this.enterRoomsListScreenAgain();
        }
        // "appending"
        document.body.append(this.divContainerRoomScreen);
        this.divContainerRoomScreen.append(text_update_Container);
        text_update_Container.append(upperText);
        text_update_Container.append(updateButton);
        this.divContainerRoomScreen.append(roomInfo);
        this.divContainerRoomScreen.append(leaveButton);
        if(this.online.isHost()){
            let hostText = document.createElement('p');
            hostText.textContent = 'Вы хост';
            let startGameButton = document.createElement('button');
            startGameButton.textContent = 'Начать игру'
            startGameButton.onclick = ()=>{
                this.exitRoomScreen();
                this.nextFunc();
            }
            this.divContainerRoomScreen.append(hostText);
            this.divContainerRoomScreen.append(startGameButton);
        }
    }

    fillRoom(roomInfo) {
        document.getElementById('roominfo').remove();
        // setup
        let roomInfoContainer = document.createElement('div');
        roomInfoContainer.style =
            "display: flex;" +
            "flex-direction: column;" +
            "flex-wrap: nowrap";
        roomInfoContainer.id = "roominfo";
        // "appending"
        this.divContainerRoomScreen.insertBefore(
            roomInfoContainer,
            this.divContainerRoomScreen.children.namedItem('leaveButton')
        );
        // filling
        let text = document.createElement('p');
        text.textContent = 'Игроки в комнате:';
        roomInfoContainer.append(text);
        for (const user in roomInfo.users) {
            let text = document.createElement('p');
            text.textContent = 'Игрок ' + roomInfo.users[user];
            roomInfoContainer.append(text);
        }
    }

    exitRoomScreen() {
        this.divContainerRoomScreen.remove()
    }
}