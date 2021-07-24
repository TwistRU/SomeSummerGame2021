// const { parse } = require("node:path");

const app = new PIXI.Application({
    width: 1440,
    height: 720,
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
    .load(setup);



let castles = [];
let armies = [];
let players = [];


class army{
    constructor(number, player_id, stamina = 5){
        this.number = number;
        this.player_id = player_id;
        this.stamina = stamina;
    }
}

class castle{
    constructor(player_id){
        this.player_id = player_id;
    }
}

class tile {
    constructor(army = null, castle = null){
        this.army = army;
        this.castle = castle;
    }
}








function setup(){
    let TGrass_01 = PIXI.Loader.shared.resources['files/Grass_01.png'].texture;  // создаю текстуры
    let TGrass_02 = PIXI.Loader.shared.resources['files/Grass_02.png'].texture;
    let TGrass_03 = PIXI.Loader.shared.resources['files/Grass_03.png'].texture;
    let TGrass_04 = PIXI.Loader.shared.resources['files/Grass_04.png'].texture;

    const tile_size = 90;
    let seed = [1, 1, 11, 1, 31, 1]; // первый элемент, на сколько изменяется каждый следующий, каждый n-й элемент, на сколько он изменяется
    let size_x = 16;
    let size_y = 8;
    
    
    let map = [];
    let contents = [];


    createMap(size_x, size_y, seed);

    function createMap(size_x, size_y, seed){     // создание карты
        let current_tile_number = seed[0];             // изменить, если будет больше 9 плиток
        for (let i = 0; i < size_y; i++){
            map.push([]);
            contents.push([]);
            for (let j = 0; j < size_x; j++){
                let current_tile;
                switch (current_tile_number){
                    case 0:
                        current_tile = new PIXI.Sprite(TGrass_01);
                        break;
                    case 1:
                        current_tile = new PIXI.Sprite(TGrass_02);
                        break;
                    case 2:
                        current_tile = new PIXI.Sprite(TGrass_03);
                        current_tile.alpha = 0.9;
                        break;
                    case 3:
                        current_tile = new PIXI.Sprite(TGrass_04);
                        break;
                    default:
                        console.log('Invalid starting tile number parameter');
                        debugger;
                }
                current_tile_number = (current_tile_number + seed[1]) % 4; // здесь может поломаться, если будет больше плиток
                if (((i + 1) * size_y + j + 1) % seed[2] == 0){
                    current_tile_number = (current_tile_number +seed[3]) % 4; // + разнообразие карты
                }
                if (((i + 1) * size_y + j + 1) % seed[4] == 0){
                    current_tile_number = (current_tile_number +seed[5]) % 4; // + разнообразие карты
                }

                // current_tile.scale.set(0.25, 0.25);     // ахтунг! здесь может всё сломаться, если размер плитки не 512*512
                current_tile.width = tile_size;
                current_tile.height = tile_size;
                current_tile.position.set(j * tile_size, i * tile_size);
                map[i].push(current_tile);
                contents[i].push();
            }
        }
        for (let i = 0; i < size_y; i++){
            for (let j = 0; j < size_x; j++){
                app.stage.addChild(map[i][j]);
                map[i][j].interactive = true;
                map[i][j].on('pointerover', mouseOverTile);
            }
        }
    }


    function mouseOverTile(){
        app.stage.removeChild(this);
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



    function fly_ball_to_point(from_x, from_y, to_x, to_y, speed = 20){

        let delta_x = to_x - from_x,
            delta_y = to_y - from_y,
            path_length = Math.sqrt(delta_x * delta_x + delta_y * delta_y),
            dx = (delta_x / path_length) * speed,
            dy = (delta_y / path_length) * speed;

        delta_x = Math.round(delta_x);
        delta_y = Math.round(delta_y);

        // let n = 0;
        
        let x_sign = delta_x / Math.round(delta_x),
            y_sign = delta_y / Math.round(delta_y);
            
        app.ticker.add(ball_flying_animation);

        function ball_flying_animation(){
            // n++;
            // if (n > 200){
            //     debugger;
            // }
            //ball.rotation += 0.02;
            let next_finish = false;
            if (Math.sqrt((to_x - ball.x)*(to_x - ball.x) + (to_y - ball.y)*(to_y - ball.y)) <= speed){
                next_finish = true;
            }
            if (next_finish){
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