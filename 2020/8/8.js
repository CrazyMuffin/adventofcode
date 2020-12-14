const fs = require('fs')
const {performance} = require('perf_hooks')
const path = require('path')

function run(instructions, alterOperation, changedOperations) {
  changedOperations = changedOperations || []

  let i = 0
  let acc = 0

  const executedInstructions = []

  while (true) {
    if (executedInstructions.includes(i)) {
      console.log(`Loop encountered! Last operation: ${i}, ACC: ${acc}`)
      return 1
    }
    if (typeof instructions[i] === 'undefined') {
      console.log('Out of bounds error.')
      return 1
    }
    executedInstructions.push(i)

    const instruction = instructions[i].split(' ')
    let operation = instruction[0]
    const argument = parseInt(instruction[1])

    if (alterOperation && !changedOperations.includes(i)) {
      if (operation === 'jmp') {
        operation = 'nop'
        changedOperations.push(i)
        alterOperation = false
      } else if (operation === 'nop') {
        operation = 'jmp'
        changedOperations.push(i)
        alterOperation = false
      }
    }

    if (operation === 'acc') {
      acc += argument
    } else if (operation === 'jmp') {
      i += argument
      continue
    } else if (operation === 'nop') {
      // Do nothing, just increase i
    } else if (operation === 'exit') {
      console.log(`Terminated correctly! ACC: ${acc}`)
      return 0
    } else {
      throw Error(`WRONG OPERATION: ${operation}`)
    }
    i++
  }
}

function process (instructions) {
  run(instructions, false)

  let returnValue = 1
  const changedOperations = []
  while (returnValue !== 0) {
    returnValue = run(instructions, true, changedOperations)
  }
}

fs.readFile(path.resolve(__dirname, '8.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n')
  const t0 = performance.now()
  process(inputArray)
  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
