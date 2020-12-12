const fs = require('fs')
const {performance} = require('perf_hooks')

const vectors = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

const OCCUPY_THRESHOLD = 0

const LEAVE_THRESHOLD = 5

function findSeat(grid, x, y, vector) {
  for (let multiplier = 1; multiplier < grid.length; multiplier++) {
    const xCord = x + (vector[0] * multiplier);
    const yCord = y + (vector[1] * multiplier);
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
    const neighbourSeat = findSeat(grid, x, y, vector);
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

function process(seatPlan) {
  let newSeatPlan = seatPlan

  let iterationCount = 0
  do {
    seatPlan = newSeatPlan
    newSeatPlan = evolveGrid(seatPlan)
    iterationCount++
  } while (JSON.stringify(seatPlan) !== JSON.stringify(newSeatPlan))

  let occupiedCount = 0
  for (const row of newSeatPlan) {
    for (const column of row) {
      if (column === '#') {
        occupiedCount++
      }
    }
  }
  console.log(`Finished with ${occupiedCount} occupied seats`)
}

fs.readFile('inputs/11.txt', 'utf8', (err, data) => {
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
