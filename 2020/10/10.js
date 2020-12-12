const fs = require('fs')
const {performance} = require('perf_hooks')
const path = require('path');

function processSingleCount (ratings) {
  const differences = {
    1: 0,
    2: 0,
    3: 1
  }

  differences[ratings[0]] = 1

  for (let i = 1; i < ratings.length; i++) {
    const difference = ratings[i] - ratings[i - 1]
    differences[difference]++
  }

  console.log(differences)

  console.log(`${differences['1']} of 1 jolts times ${differences['3']} of 3 jolts = ${differences['1'] * differences['3']}`)
}

const cacheTable = {}

function seekNext (previousJolt, i, ratings) {
  const cacheKey = previousJolt + '-' + i
  if (cacheTable[cacheKey]) {
    return cacheTable[cacheKey]
  }
  let currentJolt
  if (i === ratings.length - 1) {
    return (ratings[i] - previousJolt > 3) ? 0 : 1
  } else if (i > ratings.length - 1) {
    return 0
  } else {
    currentJolt = ratings[i]
  }
  if (currentJolt - previousJolt > 3) {
    return 0
  }
  const sum = seekNext(currentJolt, i + 1, ratings) + seekNext(currentJolt, i + 2, ratings) + seekNext(currentJolt, i + 3, ratings)
  cacheTable[cacheKey] = sum
  return sum
}

function processAllCount (ratings) {
  const returnValue = seekNext(0, 0, ratings) + seekNext(0, 1, ratings) + seekNext(0, 2, ratings)
  console.log(`All possible combinations: ${returnValue}`)
}

fs.readFile(path.resolve(__dirname, '10.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n').map(value => parseInt(value)).sort((a, b) => a - b)

  const t0 = performance.now()
  processSingleCount(inputArray)
  processAllCount(inputArray)
  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
