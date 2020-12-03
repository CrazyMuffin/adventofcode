const fs = require('fs')

function countTrees(dataArray, xVector, yVector) {
    const xLength = dataArray[0].length
    const yLength = dataArray.length

    let x = 0;
    let y = 0;
    let treeCount = 0;
    while (true) {
        x = x + xVector
        y = y + yVector

        if (y >= yLength) {
            break;
        }

        let thing
        thing = dataArray[y][x % xLength]
        if (thing === '#') {
            treeCount++
        }
    }

    console.log(treeCount);

    return treeCount
}

fs.readFile('inputs/3.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    const inputArray = data.toString().split('\n')

    const dataArray = inputArray.map(function (line) {
        return line.split('')
    })

    const vectors =
        [
            [1, 1],
            [3, 1],
            [5, 1],
            [7, 1],
            [1, 2]
        ]
    let total = 1;
    vectors.forEach(function (value) {
        total *= countTrees(dataArray, value[0], value[1])
    })

    console.log(total)
})
