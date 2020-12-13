const path = require('path');
const fs = require('fs')
const {performance} = require('perf_hooks')

function isDivisible(number, divider) {
  return number % divider === 0
}

function findEarliest(startTime, timetable) {
  const busIds = timetable.filter(value => value !== 'x')

  for (let i = startTime; i < startTime + Math.max(...busIds); i++) {
    for (const busId of busIds) {
      if (isDivisible(i, busId)) {
        console.log(`Found BUS ID: ${busId} at ${i}. You have to wait ${i - startTime} minutes`)
        console.log(`Checksum ${busId * (i - startTime)}`)
        return
      }
    }
  }
}

function findSequence(timetable) {
  const length = timetable.length
  let timestamp = 0
  let success = 0
  let successTable = {0: 1}

  while (success !== length) {
    const busId = timetable[success];

    if (busId !== 'x') {
      if (isDivisible(timestamp, busId)) {
        success++
        successTable[success] = busId * successTable[success - 1]
        timestamp++
      } else {
        timestamp += successTable[success]
      }
    } else {
      success++
      successTable[success] = successTable[success - 1]
      timestamp++
    }
  }

  timestamp -= length
  console.log(`Found sequence at timestamp ${timestamp}`)
}

fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n')
  const startTime = parseInt(inputArray[0])
  const timetable = inputArray[1].split(',').map(value => value !== 'x' ? parseInt(value) : 'x')

  const t0 = performance.now()
  findEarliest(startTime, timetable)

  findSequence(timetable)

  // for (let i = 1; i < inputArray.length; i++) {
  //   console.log(inputArray[i])
  //   findSequence(inputArray[i].split(',').map(value => value !== 'x' ? parseInt(value) : 'x'))
  // }

  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
