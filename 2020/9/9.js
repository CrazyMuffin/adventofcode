const fs = require('fs')
const {performance} = require('perf_hooks')
const path = require('path')

function isValid(currentNumber, preamble) {
  for (let i = 0; i < preamble.length; i++) {
    for (let j = i + 1; j < preamble.length; j++) {
      if (preamble[i] + preamble[j] === currentNumber) {
        return true
      }
    }
  }
  return false
}

function findInvalidNumber (rows, preambleLength) {
  let i = preambleLength
  while (true) {
    const preamble = rows.slice(i - preambleLength, i)

    const currentNumber = rows[i]

    if (!isValid(currentNumber, preamble)) {
      console.log(`Invalid number found: ${currentNumber}`)
      return currentNumber
    }
    i++
  }
}

function findSumForNumber (inputArray, invalidNumber) {
  let i = 0
  let sum = inputArray[i]
  let minIndex = i
  while (i < inputArray.length) {
    while (sum + inputArray[i + 1] <= invalidNumber) {
      i++
      sum += inputArray[i]
    }
    if (sum === invalidNumber) {
      console.log(`FOUND! minAt: ${minIndex}, max:${i}`)
      const resultSet = inputArray.slice(minIndex, i + 1)
      console.log(`Sum of max and min: ${Math.min(...resultSet) + Math.max(...resultSet)}`)
      return
    }
    sum -= inputArray[minIndex]
    minIndex++
  }
  console.error('No such set')
}

fs.readFile(path.resolve(__dirname, '9.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n').map(value => parseInt(value))

  const t0 = performance.now()
  const invalidNumber = findInvalidNumber(inputArray, 25)
  findSumForNumber(inputArray, invalidNumber)
  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
