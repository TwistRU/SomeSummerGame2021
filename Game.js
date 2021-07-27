// const { parse } = require("node:path");

const app = new PIXI.Application({
    width: 3000,
    height: 2000,
    // transparent: true
});
document.body.appendChild(app.view);


PIXI.loader
    // .add('files/ball_2.png')
    // .add('files/ball_2_selected.png')
    .add('files/Grass_01.png')
    .add('files/Grass_02.png')
    .add('files/Grass_03.png')
    .add('files/Grass_04.png')   // загружаю файлы
    .add('files/castle_test.png') // это, по-хорошему, надо вынести в отдельный файл
    .add('files/castles/1_CASTLE/big_tower_red.png')
    .add('files/castles/1_CASTLE/big_tower_grey.png')
    .add('files/warriors/1_KNIGHT/IDLE.png')
    .load(setup);


const COLORS = [0xff0000, 0x0000ff, 0x00ff00, 0xfff000, 0x964b00, 0x7300ae]  // red, blue, green, yellow, brown, purple
const GREY = 0x808080;
const LIGHT_RED = 0xff4040;
const RED = 0xff0000;

const CURRENT_PLAYER = 0;
const STAMINA = 5;
const ARMY_SPEED = 5;


let castles = [];
let armies = [];
let players = [];

let map = [];       // здесь клетки карты, на которые можно нажимать
let contents = [];  // здесь всё, что находится на этих клетках


class Army {
    constructor(player_id, number, stamina, sprite, pos_x, pos_y) {
        this.player_id = player_id;
        this.number = number;
        this.stamina = stamina;
        this.sprite = sprite;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}

class Castle {
    constructor(player_id = -1, number_of_soldiers = 0, pos_x, pos_y) {
        this.player_id = player_id;
        this.number_of_soldiers = number_of_soldiers;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
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
        this.time = 0;      // сколько ходов совершил игрок
    }
}


function setup() {               //  Main  //
    let TGrass_01 = PIXI.Loader.shared.resources['files/Grass_01.png'].texture;  // создаю текстуры
    let TGrass_02 = PIXI.Loader.shared.resources['files/Grass_02.png'].texture;
    let TGrass_03 = PIXI.Loader.shared.resources['files/Grass_03.png'].texture;
    let TGrass_04 = PIXI.Loader.shared.resources['files/Grass_04.png'].texture;
    let Tcastle_test = PIXI.Loader.shared.resources['files/castle_test.png'].texture;
    let Tcastle_1_big_red = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_red.png'].texture;
    let Tcastle_1_big_grey = PIXI.Loader.shared.resources['files/castles/1_CASTLE/big_tower_grey.png'].texture;
    let Twarrior_test = PIXI.Loader.shared.resources['files/warriors/1_KNIGHT/IDLE.png'].texture;
    let TileTextures = {
        0: TGrass_01,
        1: TGrass_02,
        2: TGrass_03,
        3: TGrass_04,
    }


    /////   параметры карты   /////
    let tile_size = 100;
    let seed = [1, 1, 17, 1, 31, 3]; // первый элемент, на сколько изменяется каждый следующий, каждый n-й элемент, на сколько он изменяется
    let size_x = 25;
    let size_y = 15;


    let mapContainer = new PIXI.Container();
    let castleContainer = new PIXI.Container();


    let left_border, right_border, up_border, down_border;  // здесь должны быть нормальные текстуры
    left_border = new PIXI.Graphics();                      // здесь создаются границы
    left_border.lineStyle(2, 0xc7cb28);
    left_border.beginFill(0xcbc5f07);
    left_border.drawRect(0, 0, 15, 1080);
    left_border.endFill();

    right_border = new PIXI.Graphics();
    right_border.lineStyle(2, 0xc7cb28);
    right_border.beginFill(0xcbc5f07);
    right_border.drawRect(1920 - 15, 0, 15, 1080);
    right_border.endFill();

    up_border = new PIXI.Graphics();
    up_border.lineStyle(2, 0xc7cb28);
    up_border.beginFill(0xcbc5f07);
    up_border.drawRect(0, 0, 1920, 15);
    up_border.endFill();

    down_border = new PIXI.Graphics();
    down_border.lineStyle(2, 0xc7cb28);
    down_border.beginFill(0xcbc5f07);
    down_border.drawRect(0, 1080 - 15, 1920, 15);
    down_border.endFill();


    /////   параметры игроков   /////

    let player_number = 1;                               // это, в принципе, не нужно, но если мы прикрутим генерацию замков,
    let castle_number = 3;                               // может пригодится
    let castle_position = [[1, 1], [2, 6], [9, 4]];
    let belongs_to = [[0]];                             // n-му игроку принадлежат все города из соответстующего массива

    for (let i = 0; i < castle_number; i++) {   // создаем замки
        let cur_castle = new Castle(-1, 0, castle_position[i][1], castle_position[i][0]);
        castles.push(cur_castle);
    }

    for (let i = 0; i < player_number; i++) {      // создаем игроков
        let cur_player = new Player();
        for (let j = 0; j < belongs_to[i].length; j++) {
            castles[belongs_to[i][j]].player_id = i;
            cur_player.castles.push(castles[belongs_to[i][j]]);
        }
        players.push(cur_player);
    }


    ///////// utils /////////////////////////////////////////////////////////////////////////////////////////////////

    let pointer_down = false;
    let castle_selected = null;
    let army_selected = [-1, -1];


    ///////// utils ///////


    createMap(size_x, size_y, seed);
    fillMap(castles);
    mapContainer.x += 15;
    mapContainer.y += 15;
    castleContainer.x += 15;
    castleContainer.y += 15;


    app.stage.addChild(left_border);
    app.stage.addChild(right_border);
    app.stage.addChild(up_border);
    app.stage.addChild(down_border);


    function createMap(size_x, size_y, seed) {     // создание карты

        for (let i = 0; i < size_x; i++) {         // ресайзим массив содержания
            contents.push([]);
            for (let j = 0; j < size_y; j++) {
                let t = new Tile();
                contents[i].push(t);
            }
        }
        let current_tile_number = seed[0];
        for (let i = 0; i < size_y; i++) {
            map.push([]);
            for (let j = 0; j < size_x; j++) {   // создаем спрайты клеток
                let current_tile = new PIXI.Sprite(TileTextures[current_tile_number]);
                current_tile_number = (current_tile_number + seed[1]) % 4;// здесь может поломаться, если будет больше 4 плиток
                if (((i + 1) * size_y + j + 1) % seed[2] == 0) {
                    current_tile_number = (current_tile_number + seed[3]) % 4; // + разнообразие карты
                }
                if (((i + 1) * size_y + j + 1) % seed[4] == 0) {
                    current_tile_number = (current_tile_number + seed[5]) % 4; // + разнообразие карты
                }

                // current_tile.scale.set(0.25, 0.25);     // ахтунг! здесь может всё сломаться, если размер плитки не 512*512
                current_tile.width = tile_size;
                current_tile.height = tile_size;
                current_tile.position.set(j * tile_size, i * tile_size);
                map[i].push(current_tile);
                contents[i].push();
            }
        }
        app.stage.addChild(mapContainer);
        for (let i = 0; i < size_y; i++) {
            for (let j = 0; j < size_x; j++) {
                mapContainer.addChild(map[i][j]);
                map[i][j].interactive = true;
                map[i][j].on('pointerover', mouseOverTile.bind(null, i, j));
                map[i][j].on('pointerout', mouseOutOfTile.bind(null, i, j));
                map[i][j].on('pointerdown', setPointerDown);
                map[i][j].on('pointerup', mouseLeftClickTile.bind(null, i, j));
            }
        }
    }


    function setPointerDown() {  // это, наверное, можно было бы сделать по другому, но я не знаю, как
        pointer_down = true;
    }


    function mouseOverTile(i, j) {    // если мышка над клеткой - клетка темнеет
        map[i][j].alpha -= 0.25;
    }

    function mouseOutOfTile(i, j) {
        map[i][j].alpha += 0.25;
        pointer_down = false;
    }

    function mouseLeftClickTile(i, j) {
        if (pointer_down) {
            console.log(contents[i][j]);
            console.log(army_selected);
            if (contents[i][j].army != null && contents[i][j].castle == null) {
                console.log("army here")
                if (army_selected[0] == -1) {
                    army_selected = [i, j];
                    contents[i][j].army.sprite.tint = 0xff7777;
                    // console.log("clicked");
                } else if (army_selected[0] == i && army_selected[1] == j) {
                    army_selected = [-1, -1];
                    contents[i][j].army.sprite.tint = 0xffffff;
                    // console.log("unclicked");
                }
            } else if (contents[i][j].army == null && contents[i][j].castle != null) {

            } else {
                if (army_selected[0] != -1) {

                    let from_x, from_y, to_x, to_y;
                    from_x = 15 + army_selected[1] * tile_size + tile_size * 0.5;
                    from_y = 15 + army_selected[0] * tile_size + tile_size * 0.5;
                    to_x = 15 + j * tile_size + tile_size * 0.5;
                    to_y = 15 + i * tile_size + tile_size * 0.5;

                    // moveArmyFromTo(from_x, from_y, to_x, to_y, ARMY_SPEED, contents[army_selected[1]][army_selected[0]]);
                    contents[i][j].army = contents[army_selected[0]][army_selected[1]].army;
                    contents[army_selected[0]][army_selected[1]].army = null;

                    contents[i][j].army.sprite.x = 15 + j * tile_size + tile_size * 0.5;
                    contents[i][j].army.sprite.y = 15 + i * tile_size + tile_size * 0.5;

                    army_selected = [i, j];
                }
            }
            pointer_down = false;
        }
    }


    function fillMap(castles) {      // наполняем содержание (пока только замками)
        app.stage.addChild(castleContainer);
        for (let i = 0; i < castles.length; i++) {
            contents[castles[i].pos_x][castles[i].pos_y].castle = castles[i];
            let current_castle;


            if (castles[i].player_id == 0) {
                current_castle = new PIXI.Sprite(Tcastle_1_big_red);    // переписать!
            } else {
                current_castle = new PIXI.Sprite(Tcastle_1_big_grey);
            }
            current_castle.anchor.set(0.5);
            current_castle.scale.set(tile_size * 1.5 / 955);
            current_castle.position.set(castles[i].pos_y * tile_size + tile_size * 0.5, castles[i].pos_x * tile_size)
            castleContainer.addChild(current_castle);
        }
    }


    function createArmy(i, j, number, player_id) {     // создаю армию из пока одного солдата
        let warrior = new PIXI.Sprite(Twarrior_test);
        warrior.anchor.set(0.5);
        warrior.scale.set(tile_size / 1000);
        warrior.position.set(j * tile_size + tile_size * 0.5 + 15, i * tile_size + tile_size * 0.5 + 15);
        app.stage.addChild(warrior);

        let cur_army = new Army(number, player_id, STAMINA, warrior, i, j);
        armies.push(cur_army);
        contents[i][j].army = cur_army;
    }


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


    createArmy(3, 3, 1, 0);


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

}
