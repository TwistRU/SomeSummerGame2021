// const { parse } = require("node:path");


const app = new PIXI.Application({
    width: window.innerWidth * 2,
    height: window.innerHeight * 2,
    // transparent: true
});


// const STAMINA = 5;
// const ARMY_SPEED = 5;
// const tile_size = 100;
// const SEED1 = [1, 1, 17, 1, 31, 3]; // первый элемент, на сколько изменяется каждый следующий, каждый n-й элемент, на сколько он изменяется
// const POPULATION_GROWTH = 10;
// const COLORS = {
//     "RED": 0xff0000,
//     "BLUE": 0x0000ff,
//     "GREEN": 0x00ff00,
//     "YELLOW": 0xfff000,
//     "BROWN": 0x964b00,
//     "PURPLE": 0x7300ae,
// }

// const Tints = {
//     "RED": 0xff8888,
//     "BLUE": 0x8888ff,
//     "GREEN": 0x88ff88,
//     "YELLOW": 0xfff666,
//     "GREY": 0x999999,
// }

// const size_x = 25;
// const size_y = 15;

// const Textures = {
//     TGrass_01: null,
//     TGrass_02: null,
//     TGrass_03: null,
//     TGrass_04: null,
//     Tcastle_1_big_red: null,
//     Tcastle_1_big_blue: null,
//     Tcastle_1_big_green: null,
//     Tcastle_1_big_yellow: null,
//     Tcastle_1_big_grey: null,
//     Twarrior_test: null,
//     TileTextures: null,
//     castleTextures: null,
// }

import {
        STAMINA,   // не работает !!!11111!!11
        ARMY_SPEED,
        tile_size,
        SEED1,
        POPULATION_GROWTH,
        COLORS,
        Tints,
        size_x,
        size_y,
        Textures
} from "./constants.js";

import {
    Online
} from "./online.js"

class Army {
    constructor(player_name, number, stamina, sprite, pos_x, pos_y) {
        this.player_name = player_name;
        this.number = number;
        this.stamina = stamina;
        this.sprite = sprite;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}

class Castle {
    constructor(player_name = -1, number_of_soldiers = POPULATION_GROWTH, pos_x, pos_y) {
        this.player_name = player_name;
        this.number_of_soldiers = number_of_soldiers;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.sprite;
        this.color;    // нужен, чтобы определять цвета игроков
    }
}

class Tile {
    constructor(army = null, castle = null) {
        this.army = army;
        this.castle = castle;
    }
}

class Player {
    constructor() {
        this.color = null;
        this.castles = [];
        this.armies = [];
        this.time = 0;      // сколько ходов совершил игрок (удалить)
        this.player_name = null;
    }
}





export class Game {
    constructor(online, userName = undefined, gameTable = undefined) {
        this.online = online;
        this.userName = userName;
        this.gameTable = gameTable;
        this.test_tile;
        // console.log(this.gameTable)   //  []

        this.map = [];       // здесь клетки карты, на которые можно нажимать
        this.castles = [];
        this.armies = [];
        this.players;

        this.mapContainer = new PIXI.Container();
        this.castleContainer = new PIXI.Container();
        this.armyContainer = new PIXI.Container();

        this.gameScreenContainer = new PIXI.Container();
        this.GUIContainer = new PIXI.Container();

        this.response;
        this.pointer_down = false;
        this.castle_selected = null;
        this.army_selected = [-1, -1];
        this.castle_selected = [-1, -1];
        this.mouseDownLastPos = null;

        // this.gameScreenContainer.addChild(this.mapContainer, this.castleContainer, this.armyContainer);
        app.stage.addChild(this.gameScreenContainer, this.GUIContainer);

        // PIXI.loader
        //     .add('files/Grass_01.png')
        //     .add('files/Grass_02.png')
        //     .add('files/Grass_03.png')
        //     .add('files/Grass_04.png')   // загружаю файлы
        //     .add('files/castle_test.png') // это, по-хорошему, надо вынести в отдельный файл
        //     .add('files/castles/1_CASTLE/big_tower_red.png')
        //     .add('files/castles/1_CASTLE/big_tower_blue.png')
        //     .add('files/castles/1_CASTLE/big_tower_grey.png')
        //     .add('files/warriors/1_KNIGHT/IDLE.png')
        //     .load(setup.bind(null, Textures))  //.then(this.enterGameScreen.bind(this))


        // function setup(Textures) {
        //     console.log("texts")
        //     Textures.TGrass_01 = PIXI.Loader.shared.resources['files/Grass_01.png'].texture;  // создаю текстуры
        //     Textures.TGrass_02 = PIXI.Loader.shared.resources['files/Grass_02.png'].texture;
        //     Textures.TGrass_03 = PIXI.Loader.shared.resources['files/Grass_03.png'].texture;
        //     Textures.TGrass_04 = PIXI.Loader.shared.resources['files/Grass_04.png'].texture;
        //     Textures.Tcastle_1_big_red = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_red.png'].texture;
        //     Textures.Tcastle_1_big_blue = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_blue.png'].texture;
        //     Textures.Tcastle_1_big_grey = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_grey.png'].texture;
        //     Textures.Twarrior_test = PIXI.Loader.shared.resources['files/warriors/1_KNIGHT/IDLE.png'].texture;

        //     Textures.TileTextures = {
        //         0: Textures.TGrass_01,
        //         1: Textures.TGrass_02,
        //         2: Textures.TGrass_03,
        //         3: Textures.TGrass_04,
        //     }

        //     Textures.castleTextures = {
        //         "RED": Textures.Tcastle_1_big_red,
        //         "BLUE": Textures.Tcastle_1_big_blue,
        //         "GREY": Textures.Tcastle_1_big_grey,
        //     }
        // }

    }

    setUserName(name) {
        this.userName = name;
    }

    generateGameTable(){
        this.gameTable = [];
        let castle_position = [[1, 1], [2, 6], [8, 3]];
        let belongs_to = [[0], [1]];                    // n-му игроку принадлежат все города из соответстующего массива
        let players_nick_color = [[this.userName, "RED"]]

        for (let i = 0; i < castle_position.length; i++) {   // создаем ничейные замки
            let cur_castle = new Castle();
            cur_castle.pos_x = castle_position[i][1];
            cur_castle.pos_y = castle_position[i][0];
            cur_castle.color = "GREY";
            cur_castle.sprite = new PIXI.Sprite(Textures.castleTextures["GREY"]);
            cur_castle.sprite.anchor.set(0.5);
            cur_castle.sprite.scale.set(tile_size * 1.5 / 955);
            cur_castle.sprite.position.set(cur_castle.pos_y * tile_size + tile_size * 0.5, cur_castle.pos_x * tile_size);
            this.castles.push(cur_castle);
        }


        for (let i = 0; i < belongs_to.length; i++) {      // создаем игроков и присваеваем им замки, замкам - цвета и текстуры
            let cur_player = new Player();
            cur_player.player_name = players_nick_color[i][0];
            cur_player.color = players_nick_color[i][1];

            for (let j = 0; j < belongs_to[i].length; j++) {
                this.castles[belongs_to[i][j]].player_name = players_nick_color[i][0];
                this.castles[belongs_to[i][j]].color = players_nick_color[i][1];
                this.castles[belongs_to[i][j]].sprite = new PIXI.Sprite(Textures.castleTextures[cur_player.color]);
                this.castles[belongs_to[i][j]].sprite.anchor.set(0.5);
                this.castles[belongs_to[i][j]].sprite.scale.set(tile_size * 1.5 / 955);
                this.castles[belongs_to[i][j]].sprite.position.set(this.castles[belongs_to[i][j]].pos_y * tile_size + tile_size * 0.5, this.castles[belongs_to[i][j]].pos_x * tile_size);
                cur_player.castles.push(this.castles[belongs_to[i][j]]);
            }
        }


        for (let i = 0; i < size_y; i++) {         // создаём пустой массив содержания
            this.gameTable.push([]);
            for (let j = 0; j < size_x; j++) {
                let t = new Tile();
                this.gameTable[i].push(t);
            }
        }
        for (let i = 0; i < this.castles.length; i++) {  // наполняем его
            this.gameTable[this.castles[i].pos_x][this.castles[i].pos_y].castle = this.castles[i];
        }
        this.castles = [];
        this.players = [];
        // console.log(this.gameTable);
    }

    


    enterGameScreen() {
        PIXI.loader
            .add('files/Grass_01.png')
            .add('files/Grass_02.png')
            .add('files/Grass_03.png')
            .add('files/Grass_04.png')   // загружаю файлы
            .add('files/castle_test.png') // это, по-хорошему, надо вынести в отдельный файл
            .add('files/castles/1_CASTLE/big_tower_red.png')
            .add('files/castles/1_CASTLE/big_tower_blue.png')
            .add('files/castles/1_CASTLE/big_tower_grey.png')
            .add('files/warriors/1_KNIGHT/IDLE.png')
            .load(this.setup.bind(this))  //.then(this.enterGameScreen.bind(this))
    }



    setup() {
        console.log("texts")
        Textures.TGrass_01 = PIXI.Loader.shared.resources['files/Grass_01.png'].texture;  // создаю текстуры
        Textures.TGrass_02 = PIXI.Loader.shared.resources['files/Grass_02.png'].texture;
        Textures.TGrass_03 = PIXI.Loader.shared.resources['files/Grass_03.png'].texture;
        Textures.TGrass_04 = PIXI.Loader.shared.resources['files/Grass_04.png'].texture;
        Textures.Tcastle_1_big_red = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_red.png'].texture;
        Textures.Tcastle_1_big_blue = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_blue.png'].texture;
        Textures.Tcastle_1_big_grey = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_grey.png'].texture;
        Textures.Twarrior_test = PIXI.Loader.shared.resources['files/warriors/1_KNIGHT/IDLE.png'].texture;

        Textures.TileTextures = {
            0: Textures.TGrass_01,
            1: Textures.TGrass_02,
            2: Textures.TGrass_03,
            3: Textures.TGrass_04,
        }

        Textures.castleTextures = {
            "RED": Textures.Tcastle_1_big_red,
            "BLUE": Textures.Tcastle_1_big_blue,
            "GREY": Textures.Tcastle_1_big_grey,
        }

        document.body.appendChild(app.view);
        // console.log(Textures.TGrass_01)


        // создание карты
        if (Online.isHost){
            this.generateGameTable();
        }
        else {
            this.gameTable = Online.getTable();
        }


        let current_tile_number = SEED1[0];
        for (let i = 0; i < size_y; i++) {
            this.map.push([]);
            for (let j = 0; j < size_x; j++) {   // создаем спрайты клеток
                let current_tile = new PIXI.Sprite(Textures.TileTextures[current_tile_number]);
                current_tile_number = (current_tile_number + SEED1[1]) % 4;// здесь может поломаться, если будет больше 4 плиток
                if (((i + 1) * size_y + j + 1) % SEED1[2] === 0) {
                    current_tile_number = (current_tile_number + SEED1[3]) % 4; // + разнообразие карты
                }
                if (((i + 1) * size_y + j + 1) % SEED1[4] === 0) {
                    current_tile_number = (current_tile_number + SEED1[5]) % 4; // + разнообразие карты
                }

                current_tile.width = tile_size;
                current_tile.height = tile_size;
                current_tile.position.set(j * tile_size, i * tile_size);
                this.map[i].push(current_tile);
            }
        }

        for (let i = 0; i < size_y; i++) {          // добавляем спрайты в контейнер и привязываем ивентлисенеры
            for (let j = 0; j < size_x; j++) {
                this.mapContainer.addChild(this.map[i][j]);
                // this.map[i][j].interactive = true;
                this.map[i][j].on('pointerover', this.mouseOverTile.bind(this, i, j));
                this.map[i][j].on('pointerout', this.mouseOutOfTile.bind(this, i, j));
                this.map[i][j].on('click', this.mousePointerClick.bind(this, i, j));
            }
        }
        this.map[0][0].on('click', this.GameMoveEnd.bind(this));


        for (let i = 0; i < size_y; i++) {
            for (let j = 0; j < size_x; j++) {
                // console.log(size_x, i, j, this.gameTable[i][j])
                if (this.gameTable[i][j].castle) {
                    this.castles.push(this.gameTable[i][j].castle);                   // создаём массив замков
                    this.castleContainer.addChild(this.gameTable[i][j].castle.sprite);
                }
            }
        }

        for (let i = 0; i < this.castles.length; i++) {   // создаём массив игроков
            if (this.players[this.castles[i].player_name]) {
                this.players[this.castles[i].player_name].castles.push(this.castles[i]);
            } else {
                let cur_player = new Player();
                cur_player.player_name = this.castles[i].player_name;
                cur_player.color = this.castles[i].color;
                cur_player.castles.push(this.castles[i]);
                this.players[cur_player.player_name] = cur_player;
            }
        }
        // console.log(this.players)

        // Подключаем pan zoom
        app.stage.interactive = true;
        app.stage.mousemove = this.mouseMove.bind(this);
        app.stage.mousedown = this.mouseDown.bind(this);
        document.addEventListener('mouseup', this.mouseUp.bind(this));

        this.gameScreenContainer.addChild(this.mapContainer);
        this.gameScreenContainer.addChild(this.castleContainer);
        this.gameScreenContainer.addChild(this.armyContainer);

    }

    mouseDown(e) {
        this.mouseDownLastPos = {x: e.data.originalEvent.offsetX, y: e.data.originalEvent.offsetY};
    }

    mouseUp(e) {
        this.mouseDownLastPos = null;
    }

    mouseMove(e) {
        if (this.mouseDownLastPos) {
            // console.log(this.mouseDownLastPos)
            app.stage.x = Math.min(0, (Math.max(-app.screen.width, app.stage.x + (e.data.originalEvent.offsetX - this.mouseDownLastPos.x))));
            app.stage.y = Math.min(0, (Math.max(-app.screen.height, app.stage.y + (e.data.originalEvent.offsetY - this.mouseDownLastPos.y))));
            this.mouseDownLastPos = {x: e.data.originalEvent.offsetX, y: e.data.originalEvent.offsetY};
        }
    }

    mouseOverTile(i, j) {    // если мышка над клеткой - клетка темнеет
        this.map[i][j].alpha -= 0.25;
    }

    mouseOutOfTile(i, j) {
        this.map[i][j].alpha += 0.25;
    }


    mousePointerClick(i, j) {
        // console.log('click');
        // console.log(this);
        console.log(this.gameTable[i][j]);
        // console.log("army selected", this.army_selected)
        if (this.gameTable[i][j].army != null && this.castle_selected[0] != i && this.castle_selected[1] != j) {
            // console.log("army here")
            if (this.army_selected[0] == -1 && this.gameTable[i][j].army.player_name == this.userName) {    // нажимаем на армию
                this.army_selected = [i, j];
                this.gameTable[i][j].army.sprite.alpha = 0.7;
                // console.log("clicked");
            } else if (this.army_selected[0] == i && this.army_selected[1] == j) {
                this.army_selected = [-1, -1];
                this.gameTable[i][j].army.sprite.alpha = 1;
                // console.log("unclicked");
            } else {
                this.moveArmy(i, j);
            }
        } else if (this.gameTable[i][j].castle != null && this.army_selected[0] == -1) {  // gameTable[i][j].army == null &&  нажимаем на замок
            if (this.castle_selected[0] == -1 && this.gameTable[i][j].castle.player_name == this.userName) {   // если замок не выбран
                this.castle_selected = [i, j];
                this.gameTable[i][j].castle.sprite.tint = 0x888888;
            } else if (this.castle_selected[0] == i && this.castle_selected[1] == j) {
                if (this.gameTable[i][j].castle.number_of_soldiers === 0) {  // если в замке нет войск
                    this.castle_selected = [-1, -1];
                    this.gameTable[i][j].castle.sprite.tint = 0xffffff;
                } else {
                    if (this.gameTable[i][j].army == null) {
                        this.createArmy(i, j, 0, this.userName);
                    }
                    let transfer = Math.ceil(this.gameTable[i][j].castle.number_of_soldiers / 2);
                    this.gameTable[i][j].castle.number_of_soldiers -= transfer;
                    this.gameTable[i][j].army.number += transfer;
                }
            }

        } else {
            if (this.army_selected[0] != -1) {
                this.moveArmy(i, j)
            }
            if (this.castle_selected[0] != -1) {
                this.gameTable[this.castle_selected[0]][this.castle_selected[1]].castle.sprite.tint = 0xffffff;
                this.castle_selected = [-1, -1];
            }
        }
    }


    createArmy(i, j, number, player_name) {     // создаю армию из пока одного солдата
        console.log(this)
        let warrior = new PIXI.Sprite(Textures.Twarrior_test);
        warrior.anchor.set(0.5);
        warrior.scale.set(tile_size / 1000);
        warrior.position.set(j * tile_size + tile_size * 0.5, i * tile_size + tile_size * 0.5);
        // console.log(this.players)
        warrior.tint = Tints[this.players[player_name].color];
        this.armyContainer.addChild(warrior);

        let cur_army = new Army(player_name, number, STAMINA, warrior, i, j);
        this.armies.push(cur_army);
        this.gameTable[i][j].army = cur_army;
    }


    moveArmy(i, j) {
        if (!this.gameTable[i][j].army && !this.gameTable[i][j].castle) {  // на пустую клетку
            this.gameTable[i][j].army = this.gameTable[this.army_selected[0]][this.army_selected[1]].army;
            this.gameTable[i][j].army.sprite.x = j * tile_size + tile_size * 0.5;
            this.gameTable[i][j].army.sprite.y = i * tile_size + tile_size * 0.5;
            this.gameTable[this.army_selected[0]][this.army_selected[1]].army = null;
            this.gameTable[i][j].army.sprite.alpha = 1;
            this.army_selected = [-1, -1];
        } else if (!this.gameTable[i][j].castle) {   // на клетку с армией
            if (this.gameTable[i][j].army.player_name == this.userName) { // со своей
                // console.log(this.army_selected)
                // console.log(this.gameTable[this.army_selected[0]][this.army_selected[1]])
                this.gameTable[i][j].army.number += this.gameTable[this.army_selected[0]][this.army_selected[1]].army.number;
                this.armyContainer.removeChild(this.gameTable[this.army_selected[0]][this.army_selected[1]].army.sprite);
                this.gameTable[this.army_selected[0]][this.army_selected[1]].army = null;
            } else {           // с чужой
                let army1 = this.gameTable[this.army_selected[0]][this.army_selected[1]].army.number;
                let army2 = this.gameTable[i][j].army.number;
                console.log(army1, army2);
                if (army1 - army2 <= 0) {                        // если проиграли
                    this.gameTable[i][j].army.number -= army1;
                    this.armyContainer.removeChild(this.gameTable[this.army_selected[0]][this.army_selected[1]].army.sprite);
                    this.gameTable[this.army_selected[0]][this.army_selected[1]].army = null;
                }
                if (army2 - army1 <= 0) {                        // если победили
                    this.armyContainer.removeChild(this.gameTable[i][j].army.sprite);
                    this.gameTable[i][j].army = null;
                    if (army1 - army2 > 0) {  // если выжили
                        this.gameTable[this.army_selected[0]][this.army_selected[1]].army.number -= army2;
                        this.gameTable[i][j].army = this.gameTable[this.army_selected[0]][this.army_selected[1]].army;
                        this.gameTable[i][j].army.sprite.x = j * tile_size + tile_size * 0.5;
                        this.gameTable[i][j].army.sprite.y = i * tile_size + tile_size * 0.5;
                        this.gameTable[this.army_selected[0]][this.army_selected[1]].army = null;
                        this.gameTable[i][j].army.sprite.alpha = 1;
                    }
                }
            }
        } else if (!this.gameTable[i][j].army) {   // на клетку с замком
            console.log("to castle")
            if (this.gameTable[i][j].castle.player_name == this.userName) { // со своим
                this.gameTable[i][j].castle.number_of_soldiers += this.gameTable[this.army_selected[0]][this.army_selected[1]].army.number;
            } else {   // с чужим
                let army1 = this.gameTable[this.army_selected[0]][this.army_selected[1]].army.number;
                let castle2 = this.gameTable[i][j].castle.number_of_soldiers;
                if (army1 - castle2 < 0) {  // если проиграли
                    this.gameTable[i][j].castle.number -= army1;
                    console.log("lose")
                } else if (castle2 - army1 < 0) {  // если победили
                    this.gameTable[i][j].castle.player_name = this.userName;
                    this.gameTable[i][j].castle.color = COLORS[this.userName.color];
                    this.castleContainer.removeChild(this.gameTable[i][j].castle.sprite);
                    this.gameTable[i][j].castle.sprite = new PIXI.Sprite(Textures.castleTextures[this.players[this.userName].color]);
                    this.gameTable[i][j].castle.sprite.anchor.set(0.5);
                    this.gameTable[i][j].castle.sprite.scale.set(tile_size * 1.5 / 955);
                    this.gameTable[i][j].castle.sprite.position.set(j * tile_size + tile_size * 0.5, i * tile_size);
                    this.castleContainer.addChild(this.gameTable[i][j].castle.sprite);
                    console.log(this.castleContainer)
                    this.players[this.userName].castles.push(this.gameTable[i][j].castle);
                    this.gameTable[i][j].castle.number_of_soldiers = army1 - castle2;
                    // console.log(this.gameTable[i][j].castle)
                    console.log("win")
                } else { // если ничья
                    this.gameTable[i][j].castle.player_name = null;
                    this.gameTable[i][j].castle.color = "GREY";
                    this.gameTable[i][j].castle.sprite = new PIXI.Sprite(Textures.castleTextures["GREY"]);
                    this.gameTable[i][j].castle.sprite.anchor.set(0.5);
                    this.gameTable[i][j].castle.sprite.scale.set(tile_size * 1.5 / 955);
                    this.gameTable[i][j].castle.sprite.position.set(j * tile_size + tile_size * 0.5, i * tile_size);
                    this.castleContainer.addChild(this.gameTable[i][j].castle.sprite);
                    this.gameTable[i][j].castle.number_of_soldiers = 0;
                    console.log("draw")
                }
            }
            this.armyContainer.removeChild(this.gameTable[this.army_selected[0]][this.army_selected[1]].army.sprite);
            this.gameTable[this.army_selected[0]][this.army_selected[1]].army = null;

        }

        this.army_selected = [-1, -1];

    }


    GameMove(func) {   // проигрыш и выигрыш ещё не тестился
        this.response = func;
        let dead = true;
        for (let i = 0; i < this.players[this.userName].castles.length; i++) {  // если у игрока не осталось замков
            console.log(this.players[this.userName].castles[i]);
            if (this.players[this.userName].castles[i].player_name == this.userName) {
                dead = false;
                break;
            }
        }
        if (dead) {
            for (let i = 0; i < this.players[this.userName].armies.length; i++) { // и армий, он проигрывает
                if (this.players[this.userName].armies[i].number > 0) {
                    dead = false;
                    break;
                }
            }
        }
        if (!dead) {
            for (let i = 0; i < size_y; i++) {
                for (let j = 0; j < size_x; j++) {
                    this.map[i][j].interactive = true;
                }
            }
            // alert("Your move!");
        } else {
            this.players[this.userName].color = "GREY";
            alert("You lost!");
            // this.response(gameTable);
        }
    }

    GameMoveEnd() {
        for (let i = 0; i < size_y; i++) {
            for (let j = 0; j < size_x; j++) {
                this.map[i][j].interactive = false;  // отключение интерактивности в конце хода
            }
        }
        let win = true;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].color != "GREY") {
                win = false;
            }
        }
        if (win) {
            alert("You win!");
        } else {
            for (let i = 0; i < this.castles.length; i++) {
                if (this.castles[i].player_name == this.userName) {  // прирост населения
                    this.castles[i].number_of_soldiers += POPULATION_GROWTH;
                }
            }
            alert("Your move ended!")
        }
        // this.response(gameTable);
    }


}


// game1.createArmy(3, 3, 10, "player1");

// let k = 1.5;
// game1.gameScreenContainer.scale.x *= k;
// game1.gameScreenContainer.scale.y *= k;



