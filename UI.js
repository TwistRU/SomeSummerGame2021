export class UI {
    constructor(online) {
        this.divContainerStartScreen = document.createElement('div');
        this.divContainerRoomsListScreen = document.createElement('div');
        this.nickname = "";
        this.online = online;
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
        this.divContainerStartScreen.remove();
        console.log(this.nickname);
        this.enterRoomsListScreen()
    }

    enterRoomsListScreen(nextFunc = undefined) {
        this.divContainerRoomsListScreen.style =
            "width: 100%;" +
            "display: flex;" +
            "flex-direction: row;" +
            "flex-wrap: nowrap;";
        // setup
        let leftContainer = document.createElement('div');
        leftContainer.className = 'flexcontainer';
        leftContainer.style = "flex-grow: 2;";
        let leftUpperText = document.createTextNode("Список текущих комнат: ");
        let leftTable = document.createElement('table');
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
            this.online.createGame();
        };
        enterButton.textContent = "Войти";
        enterButton.className = 'flexitem';
        enterButton.onclick = () => {
            this.connectToRoom(userInputRoomId.value)
        };
        // "appending"
        document.body.append(this.divContainerRoomsListScreen);
        this.divContainerRoomsListScreen.append(leftContainer);
        leftContainer.append(leftUpperText);
        leftContainer.append(leftTable);
        this.divContainerRoomsListScreen.append(rightContainer);
        rightContainer.append(rightUpperText);
        rightContainer.append(userInputRoomId);
        rightContainer.append(enterButton);
        rightContainer.append(rightMiddleText);
        rightContainer.append(createButton);
        // filling
        this.online.getRoomList().then((rooms)=>{
            leftTable.insertRow();
            leftTable.rows[0].insertCell(0).textContent = "RoomID";
            leftTable.rows[0].insertCell(1).textContent = 'Users';
            leftTable.rows[0].insertCell(2).textContent = 'Status';
            let i = 1;
            for (const room in rooms) {
                leftTable.insertRow();
                leftTable.rows[i].insertCell(0).textContent = room;
                leftTable.rows[i].insertCell(1);
                for (const user in rooms[room].users) {
                    leftTable.rows[i].cells.item(1).append(rooms[room].users[user]+" ");
                }
                leftTable.rows[i].insertCell(2).textContent = rooms[room].status;
                i++;
            }
        });

    }

    connectToRoom(roomId) {
        let result = this.online.joinGame(roomId);
    }

    exitRoomsListScreen() {
        this.divContainerRoomsListScreen.remove();
    }
}