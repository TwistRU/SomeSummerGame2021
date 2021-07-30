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

function mainGame() {
    let nickname = "";

    const online = new Online();
    const ui = new UI(online);
    ui.enterStartScreen();
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        // transparent: true
    });

}

mainGame();