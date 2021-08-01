import {UI} from "./UI.js";
import {Online} from "./online.js";
import {Game} from "./Game.js";

export function genTable(numPeoples, size = 16) {
    let arr = [];
    for (let y = 0; y < size; ++y) {  // Создание пустого поля
        let tempArr = [];
        for (let x = 0; x < size; ++x) {
            tempArr.push({type: "grass"})
        }
        arr.push(tempArr);
    }

    // TODO сделать спавн городов
    let mid = Math.floor(size / 2);

    let len80per = Math.floor(size / 2 * 0.8);

    return arr;
}

const online = new Online();
const game = new Game(online)
const ui = new UI(online, game.setUserName.bind(game), game.enterGameScreen.bind(game));
ui.enterStartScreen();