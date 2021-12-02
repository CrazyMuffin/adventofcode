const path = require('path')
const fs = require('fs')
const {performance} = require('perf_hooks')
const cliProgress = require('cli-progress');

class NumberStorage {
  constructor() {
    this.numbers = {}
    this.lastSpokenNumber = 0
  }

  sayNumber(number, turn) {
    this.lastSpokenNumber = number
    if (this.numbers[number]) {
      this.numbers[number].turnsAppeared.push(turn)
    } else {
      this.numbers[number] = new NumberObject(number, turn)
    }
  }

  nextNumber() {
    return this.numbers[this.lastSpokenNumber].age
  }
}


class NumberObject {
  constructor(number, turn) {
    this.turnsAppeared = [turn]
  }

  get age() {
    const turnCount = this.turnsAppeared.length;
    return turnCount === 1 ? 0 : this.turnsAppeared[turnCount - 1] - this.turnsAppeared[turnCount - 2]
  }
}

const total = 30000000;

function process(startingNumbers) {
  const storage = new NumberStorage()
  startingNumbers.forEach(function (value, index) {
    storage.sayNumber(value, index + 1)
  })

  const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  bar1.start(total, 0);
  for (let turn = startingNumbers.length + 1; turn <= total; turn++) {
    bar1.increment()
    storage.sayNumber(storage.nextNumber(), turn)
  }
  bar1.stop()
  console.log(`Last spoken number was: ${storage.lastSpokenNumber}`)
}

// const inputData = '0,3,6';
// const inputData = '1,3,2';
// const inputData = '2,1,3';
// const inputData = '1,2,3';
// const inputData = '2,3,1';
// const inputData = '3,2,1';
// const inputData = '3,1,2';
const inputData = '16,1,0,18,12,14,19';

const inputArray = inputData.split(',').map(number => parseInt(number))

const t0 = performance.now()
process(inputArray)
const t1 = performance.now()

console.log(`Processing took: ${t1 - t0} ms`)

