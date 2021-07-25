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