const fs = require('fs')

function findTwo(dataArray) {
    for (const xString of dataArray) {
        const x = parseInt(xString)
        for (const yString of dataArray) {
            const y = parseInt(yString)
            if (x + y === 2020) {
                console.log("Found X:" + x + " and Y:" + y)
                console.log('X * Y = ' + x * y)
                return
            }
        }
    }
}

function findThree(dataArray)
{
    for (const xString of dataArray) {
        const x = parseInt(xString)
        for (const yString of dataArray) {
            const y = parseInt(yString)
            for (const zString of dataArray) {
                const z = parseInt(zString)
                if (x + y + z === 2020) {
                    console.log('X * Y * Z = ' + x * y * z)
                    return
                }
            }
        }
    }
}

fs.readFile('1a.txt', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    const dataArray = data.toString().split('\n');

    findTwo(dataArray)

    findThree(dataArray)
})
