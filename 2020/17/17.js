const fs = require('fs')
const {performance} = require('perf_hooks')
const path = require('path')

const vectors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
]

const OCCUPY_THRESHOLD = 0

const LEAVE_THRESHOLD = 5

function findSeat(grid, x, y, vector) {
  for (let multiplier = 1; multiplier < grid.length; multiplier++) {
    const xCord = x + (vector[0] * multiplier)
    const yCord = y + (vector[1] * multiplier)
    if (typeof grid[xCord] !== 'undefined' && typeof grid[xCord][yCord] !== 'undefined') {
      if (grid[xCord][yCord] === '.') {
        continue
      }
      return grid[xCord][yCord]
    }
  }
  return '.'
}

function evolveCell(x, y, grid) {
  let occupiedCount = 0
  const currentCell = grid[x][y]
  if (currentCell === '.') {
    return '.'
  }
  for (const vector of vectors) {
    const neighbourSeat = findSeat(grid, x, y, vector)
    if (neighbourSeat === '#') {
      occupiedCount++
    }
  }
  if (currentCell === 'L' && occupiedCount === OCCUPY_THRESHOLD) {
    return '#'
  }
  if (currentCell === '#' && occupiedCount >= LEAVE_THRESHOLD) {
    return 'L'
  }

  return currentCell
}

function evolveGrid(grid) {
  const rows = grid.length
  const columns = grid[0].length

  const newGrid = []

  for (let x = 0; x < rows; x++) {
    newGrid.push([])
    for (let y = 0; y < columns; y++) {
      newGrid[x][y] = evolveCell(x, y, grid)
    }
  }

  return newGrid
}

const createEmptyCube = size => {
  return Array(size).fill(Array(size).fill(Array(size).fill('.')))
}

const evolveCube = currentState => {
  const newCube = createEmptyCube(currentState.length+2)

  for (const emptyCubeKey in createEmptyCube) {

  }

  return newCube
}

function process(initialState) {
  console.log(initialState)
  let cubeSize = initialState.length
  const presuffix = Array(Math.floor(initialState.length / 2)).fill(Array(initialState.length).fill(Array(initialState.length).fill('.')))
  let state = []
  state.push(...presuffix, initialState, ...presuffix)

  console.log(JSON.stringify(state, null, 2))
  console.table(state[0])

  for (let cycle = 0; cycle < 6; cycle++) {
    const cubeSize = state.length
    state = evolveCube(state)
  }

  let activeCount = 0

  console.log(`Finished with ${activeCount} active cells`)
}

fs.readFile(path.resolve(__dirname, 'example.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n').map((line) => line.split(''))

  const t0 = performance.now()
  process(inputArray)
  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
