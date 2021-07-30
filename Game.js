// const { parse } = require("node:path");


const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    // transparent: true
});
document.body.appendChild(app.view);


const STAMINA = 5;
const ARMY_SPEED = 5;
const tile_size = 100;
const SEED1 = [1, 1, 17, 1, 31, 3]; // первый элемент, на сколько изменяется каждый следующий, каждый n-й элемент, на сколько он изменяется
const POPULATION_GROWTH = 10;
const COLORS = {
    RED: 0xff0000,
    BLUE: 0x0000ff,
    GREEN: 0x00ff00,
    YELLOW: 0xfff000,
    BROWN: 0x964b00,
    PURPLE: 0x7300ae,
}

// import {
//         STAMINA,   // не работает !!!11111!!11
//         ARMY_SPEED,
//         tile_size,
//         SEED1,
//         COLORS,
//         POPULATION_GROWTH
// } from "./constants.js";


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



let Textures = {
    TGrass_01: null,
    TGrass_02: null,
    TGrass_03: null,
    TGrass_04: null,
    Tcastle_1_big_red: null,
    Tcastle_1_big_blue: null,
    Tcastle_1_big_green: null,
    Tcastle_1_big_yellow: null,
    Tcastle_1_big_grey: null,
    Twarrior_test: null,
    TileTextures: null,
    castleTextures: null,
}





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
    .load(setup.bind(null, Textures))  //.then(this.enterGameScreen.bind(this))


function setup(Textures){
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
    game1.enterGameScreen();
}





class Game{
    constructor (userName, gameTable){
        this.userName = userName;
        this.gameTable = gameTable;
        this.test_tile;
        console.log(this.gameTable)   //  []
        
        this.map = [];       // здесь клетки карты, на которые можно нажимать
        this.castles = [];
        this.armies = [];
        this.players = [];

        this.mapContainer = new PIXI.Container();
        this.castleContainer = new PIXI.Container();
        this.armyContainer = new PIXI.Container();

        this.gameScreenContainer = new PIXI.Container();
        this.GUIContainer = new PIXI.Container();

        // this.gameScreenContainer.addChild(this.mapContainer, this.castleContainer, this.armyContainer);
        app.stage.addChild(this.gameScreenContainer, this.GUIContainer);
        
    }

    


    enterGameScreen(){
        
        // console.log(Textures.TGrass_01)


        
        let size_x = 25;
        let size_y = 15;
        
        


        ///////  это будет генериться не здесь

        let castle_position = [[1, 1], [2, 6], [8, 3]];
        let belongs_to = [[0], [1]];                    // n-му игроку принадлежат все города из соответстующего массива
        let players_nick_color = [["player1", "RED"], ["player2", "BLUE"]]

        for (let i = 0; i < castle_position.length; i++) {   // создаем ничейные замки
            let cur_castle = new Castle();
            cur_castle.pos_x = castle_position[i][1];
            cur_castle.pos_y = castle_position[i][0];
            cur_castle.sprite = new PIXI.Sprite(Textures.castleTextures["GREY"]);
            cur_castle.sprite.anchor.set(0.5);
            cur_castle.sprite.scale.set(tile_size * 1.5 / 955);
            cur_castle.sprite.position.set(cur_castle.pos_y * tile_size + tile_size * 0.5, cur_castle.pos_x * tile_size);
            this.castles.push(cur_castle);
        }


        for (let i = 0; i < belongs_to.length; i++) {      // создаем игроков и присваеваем им замки, замкам - цвета и текстуры
            let cur_player = new Player();
            cur_player.userName = players_nick_color[i][0];
            cur_player.color = players_nick_color[i][1];

            for (let j = 0; j < belongs_to[i].length; j++) {
                this.castles[belongs_to[i][j]].player_name = players_nick_color[i][0];
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


        //////////////////////  это генерилось не здесь


        

        // создание карты

            
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
                this.map[i][j].interactive = true;
                this.map[i][j].on('pointerover', this.mouseOverTile.bind(null, i, j, this.map));
                this.map[i][j].on('pointerout', this.mouseOutOfTile.bind(null, i, j, this.map));
                this.map[i][j].on('click', this.mousePointerClick.bind(null, i, j, this.gameTable, this.army_selected));
            }
        }


        for (let i = 0; i < size_y; i++){
            for (let j = 0; j < size_x; j++){
                // console.log(size_x, i, j, this.gameTable[i][j])
                if (this.gameTable[i][j].castle){
                    this.castles.push(this.gameTable[i][j].castle);                   // создаём массив замков
                    this.castleContainer.addChild(this.gameTable[i][j].castle.sprite);
                }
            }
        }

        for (let i = 0; i < this.castles.length; i++){   // создаём массив игроков
            let player_exists = false;
            for (let j = 0; j < this.players.length; j++){
                if (this.castles[i].player_name == this.players[i].player_name){
                    this.players[i].castles.push(this.castles[i]);
                    player_exists = true;
                    break;
                }
            }
            if (!player_exists){
                let cur_player = new Player();
                cur_player.player_name = this.castles[i].player_name;
                cur_player.castles.push(this.castles[i]);
            }
        }

        // Подключаем pan zoom
        app.stage.interactive = true;
        app.stage.mousemove = this.mouseMove.bind(null, this.mouseDownLastPos);
        app.stage.mousedown = this.mouseDown.bind(null, this.mouseDownLastPos);
        document.addEventListener('mouseup', this.mouseUp.bind(null, this.mouseDownLastPos));

        this.gameScreenContainer.addChild(this.mapContainer);
        this.gameScreenContainer.addChild(this.castleContainer);
    }


    pointer_down = false;
    castle_selected = null;
    army_selected = [-1, -1];
    mouseDownLastPos = null;

    mouseDown(mouseDownLastPos, e) {
        mouseDownLastPos = {x: e.data.originalEvent.offsetX, y: e.data.originalEvent.offsetY};
    }

    mouseUp(mouseDownLastPos, e) {
        console.log(mouseDownLastPos);
        mouseDownLastPos = null;
    }

    mouseMove(mouseDownLastPos, e) {
        if (mouseDownLastPos) {
            console.log(mouseDownLastPos)
            app.gameScreenContainer.x = Math.min(0, (Math.max(-app.screen.width, app.stage.x + (e.data.originalEvent.offsetX - mouseDownLastPos.x))));
            app.gameScreenContainer.y = Math.min(0, (Math.max(-app.screen.height, app.stage.y + (e.data.originalEvent.offsetY - mouseDownLastPos.y))));
            mouseDownLastPos = {x: e.data.originalEvent.offsetX, y: e.data.originalEvent.offsetY};
        }
    }

    mouseOverTile(i, j, map) {    // если мышка над клеткой - клетка темнеет
        map[i][j].alpha -= 0.25;
    }

    mouseOutOfTile(i, j, map) {
        map[i][j].alpha += 0.25;
    }



    mousePointerClick(i, j, gameTable, army_selected) {
        console.log('click');
        console.log(gameTable[i][j]);
        console.log(army_selected);
        if (gameTable[i][j].army != null && gameTable[i][j].castle == null) {
            console.log("army here")
            if (army_selected[0] == -1) {
                army_selected = [i, j];
                gameTable[i][j].army.sprite.tint = 0xff7777;
                // console.log("clicked");
            } else if (army_selected[0] == i && army_selected[1] == j) {
                army_selected = [-1, -1];
                gameTable[i][j].army.sprite.tint = 0xffffff;
                // console.log("unclicked");
            }
        } else if (gameTable[i][j].army == null && gameTable[i][j].castle != null) {

        } else {
            if (army_selected[0] != -1) {
                
                let from_x, from_y, to_x, to_y;
                from_x = army_selected[1] * tile_size + tile_size * 0.5;
                from_y = army_selected[0] * tile_size + tile_size * 0.5;
                to_x = j * tile_size + tile_size * 0.5;
                to_y = i * tile_size + tile_size * 0.5;

                // moveArmyFromTo(from_x, from_y, to_x, to_y, ARMY_SPEED, gameTable[army_selected[1]][army_selected[0]]);
                gameTable[i][j].army = gameTable[army_selected[0]][army_selected[1]].army;
                gameTable[army_selected[0]][army_selected[1]].army = null;

                gameTable[i][j].army.sprite.x = j * tile_size + tile_size * 0.5;
                gameTable[i][j].army.sprite.y = i * tile_size + tile_size * 0.5;

                army_selected = [i, j];
                army_selected = [-1, -1];
                gameTable[i][j].army.sprite.tint = 0xffffff;
            }
        }
    }

    createArmy(i, j, number, player_name) {     // создаю армию из пока одного солдата
        let warrior = new PIXI.Sprite(this.Twarrior_test);
        warrior.anchor.set(0.5);
        warrior.scale.set(tile_size / 1000);
        warrior.position.set(j * tile_size + tile_size * 0.5, i * tile_size + tile_size * 0.5);
        this.armyContainer.addChild(warrior);

        let cur_army = new Army(number, player_name, STAMINA, warrior, i, j);
        this.armies.push(cur_army);
        console.log(this.gameTable)
        console.log(this.gameTable[i][j]);
        this.gameTable[i][j].army = cur_army;
    }




    
    


}


let game1 = new Game("qwer", [])
// game1.enterGameScreen();
console.log(game1)

// let k = 1.5;
// game1.gameScreenContainer.scale.x *= k;
// game1.gameScreenContainer.scale.y *= k;



game1.createArmy(3, 3, 10, "player1");










// function setup() {               //  Main  //   old



    function moveArmyFromTo(from_x, from_y, to_x, to_y, speed = ARMY_SPEED, sprite) {
        let delta_x = to_x - from_x,
            delta_y = to_y - from_y,
            path_length = Math.sqrt(delta_x * delta_x + delta_y * delta_y),
            dx = (delta_x / path_length) * speed,
            dy = (delta_y / path_length) * speed;


        app.ticker.add(armyMoveAnimation);

        function armyMoveAnimation() {
            let next_finish = false;
            if (Math.sqrt((to_x - sprite.x) * (to_x - sprite.x) + (to_y - sprite.y) * (to_y - sprite.y)) <= speed) {
                next_finish = true;
            }
            if (next_finish) {
                sprite.x = to_x;
                sprite.y = to_y;
                app.ticker.remove(armyMoveAnimation);
            }
            sprite.x += dx;
            sprite.y += dy;
            // if (ball.x <= ball.width / 2 || ball.x >= app.renderer.width - ball.width / 2){
            //     dx *= -1;
            // }
            // if (ball.y <= ball.height / 2 || ball.y >= app.renderer.height - ball.height / 2){
            //     dy *= -1;
            // }
        }
    }



    



///////////////////////    Some ball    //////////////////


    // let ball_texture = PIXI.Loader.shared.resources['files/ball_2.png'].texture;
    // let ball_selected_texture = PIXI.Loader.shared.resources['files/ball_2_selected.png'].texture;

    // let ball = new PIXI.Sprite(ball_texture);

    // app.stage.addChild(ball);
    // let pos_x = 100, pos_y = 100;
    // ball.scale.set(0.1, 0.1);
    // ball.position.set(pos_x, pos_y);
    // ball.anchor.set(0.5);


    //fly_ball_to_point(100, 100, 600, 300, 10);

    // let dx = 2, dy = 3;

    // let to_x, to_y, from_x, from_y, speed;
    // from_x = 100;
    // from_y = 100;
    // to_x = 600;
    // to_y = 200;
    // speed = 20;


    function fly_ball_to_point(from_x, from_y, to_x, to_y, speed = 20) {

        let delta_x = to_x - from_x,
            delta_y = to_y - from_y,
            path_length = Math.sqrt(delta_x * delta_x + delta_y * delta_y),
            dx = (delta_x / path_length) * speed,
            dy = (delta_y / path_length) * speed;

        // delta_x = Math.round(delta_x);
        // delta_y = Math.round(delta_y);

        // let n = 0;

        // let x_sign = delta_x / Math.round(delta_x),
        //     y_sign = delta_y / Math.round(delta_y);

        app.ticker.add(ball_flying_animation);

        function ball_flying_animation() {
            // n++;
            // if (n > 200){
            //     debugger;
            // }
            //ball.rotation += 0.02;
            let next_finish = false;
            if (Math.sqrt((to_x - ball.x) * (to_x - ball.x) + (to_y - ball.y) * (to_y - ball.y)) <= speed) {
                next_finish = true;
            }
            if (next_finish) {
                ball.x = to_x;
                ball.y = to_y;
                app.ticker.remove(ball_flying_animation);
            }
            ball.x += dx;
            ball.y += dy;
            // if (ball.x <= ball.width / 2 || ball.x >= app.renderer.width - ball.width / 2){
            //     dx *= -1;
            // }
            // if (ball.y <= ball.height / 2 || ball.y >= app.renderer.height - ball.height / 2){
            //     dy *= -1;
            // }
        }
    }

// }