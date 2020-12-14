const path = require('path')
const fs = require('fs')
const {performance} = require('perf_hooks')

class Action {
  constructor(line) {
    const split = line.split(' = ')
    this.value = split[1]
    if (split[0] === 'mask') {
      this.action = 'mask'
    } else {
      this.action = 'mem'
      this.address = parseInt(split[0].match(/mem\[(\d+)]/)[1])
    }
  }

  get binaryValue() {
    return Number(this.value).toString(2)
  }
}

class Stack {
  constructor() {
    this.mask = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
    this.memory = {}
  }

  setMask(mask) {
    this.mask = mask
  }

  setToMemory(address, value) {
    const binaryValue = Number(value).toString(2).padStart(36, '0')

    const resultArray = []
    for (let i = 0; i < 36; i++) {
      resultArray[i] = this.mask[i] === 'X' ? binaryValue[i] : this.mask[i]
    }

    this.memory[address] = parseInt(resultArray.join(''), 2)
  }

  get memorySum() {
    let sum = 0
    for (const address in this.memory) {
      sum += this.memory[address]
    }
    return sum
  }
}

class StackV2 extends Stack {
  decodeAddress(address) {
    let addressArray = ['']
    for (let i = 0; i < 36; i++) {
      if (this.mask[i] === '0') {
        addressArray = addressArray.map(element => element + address[i])
      } else if (this.mask[i] === '1') {
        addressArray = addressArray.map(element => element + '1')
      } else if (this.mask[i] === 'X') {
        const zeroesArray = [...addressArray].map(element => element + '0')
        addressArray = addressArray.map(element => element + '1').concat(zeroesArray)
      }
    }
    return addressArray
  }

  setToMemory(address, value) {
    const binaryAddress = Number(address).toString(2).padStart(36, '0')

    for (const decodedAddress of this.decodeAddress(binaryAddress)) {
      this.memory[parseInt(decodedAddress, 2)] = parseInt(value)
    }
  }
}

function process(actions) {
  const stack = new Stack()
  const stack2 = new StackV2()
  for (const action of actions) {
    if (action.action === 'mask') {
      stack.setMask(action.value)
      stack2.setMask(action.value)
    } else {
      stack.setToMemory(action.address, action.value)
      stack2.setToMemory(action.address, action.value)
    }
  }

  console.log(`Stack 1 sum: ${stack.memorySum}`)
  console.log(`Stack 2 sum: ${stack2.memorySum}`)
}

fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n').map(line => new Action(line))

  const t0 = performance.now()
  process(inputArray)

  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
