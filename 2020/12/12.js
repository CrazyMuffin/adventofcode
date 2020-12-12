const path = require('path');
const fs = require('fs')
const {performance} = require('perf_hooks')

const moveVectors =
  [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ]

const rotateVectors = [
  //[XX, XY, YX, YY]
  [1, 0, 0, 1],
  [0, -1, 1, 0],
  [-1, 0, 0, -1],
  [0, 1, -1, 0]
]


class Ship {
  constructor(x, y, wayX, wayY) {
    this.x = x || 0 //NORTH + / SOUTH -
    this.y = y || 0 //EAST + / WEST -

    this.wayX = wayX || 0 //NORTH + / SOUTH -
    this.wayY = wayY || 0 //EAST + / WEST -

    this.orientation = 100001 // 0 North, 1 East, 2 South, 3 West
  }

  getOrientation() {
    return this.orientation % 4
  }

  order(order) {
    const matches = order.match(/([NSEWLRF])(\d+)/)
    this.executeOrder(matches[1], parseInt(matches[2]))
  }

  orderWithWaypoint(order) {
    const matches = order.match(/([NSEWLRF])(\d+)/)
    this.executeWaypointOrder(matches[1], parseInt(matches[2]))
  }

  executeOrder(direction, distance) {
    if (direction === 'R') {
      this.turn(distance / 90)
    } else if (direction === 'L') {
      this.turn((distance / 90) * -1)
    } else if (direction === 'F') {
      this.moveForward(distance)
    } else {
      this.moveCardinal(direction, distance)
    }
  }

  executeWaypointOrder(direction, distance) {
    if (direction === 'R') {
      this.turnWaypoint(distance / 90)
    } else if (direction === 'L') {
      this.turnWaypoint((360 - distance) / 90)
    } else if (direction === 'F') {
      this.moveToWaypoint(distance)
    } else {
      this.moveWaypointCardinal(direction, distance)
    }
  }

  turn(offset) {
    this.orientation += offset
  }

  turnWaypoint(offset) {
    const vector = rotateVectors[offset % 4]
    const newX = (this.wayX * vector[0] + this.wayY * vector[1])
    const newY = (this.wayX * vector[2] + this.wayY * vector[3])

    this.wayX = newX
    this.wayY = newY
  }

  moveCardinal(direction, distance) {
    if (direction === 'N') {
      this.x += distance
    } else if (direction === 'S') {
      this.x -= distance
    } else if (direction === 'E') {
      this.y += distance
    } else if (direction === 'W') {
      this.y -= distance
    } else {
      throw "Incorrect direction"
    }
  }

  moveWaypointCardinal(direction, distance) {
    if (direction === 'N') {
      this.wayX += distance
    } else if (direction === 'S') {
      this.wayX -= distance
    } else if (direction === 'E') {
      this.wayY += distance
    } else if (direction === 'W') {
      this.wayY -= distance
    } else {
      throw "Incorrect direction"
    }
  }

  moveForward(distance) {
    const vector = moveVectors[this.getOrientation()]
    this.x += distance * vector[0]
    this.y += distance * vector[1]
  }

  moveToWaypoint(distance) {
    this.x += distance * this.wayX
    this.y += distance * this.wayY
  }

  get manhattanDistance() {
    return Math.abs(this.x) + Math.abs(this.y)
  }
}

function rideShip(orders) {
  let ship = new Ship()
  let wayShip = new Ship(0, 0, 1, 10)

  for (const order of orders) {
    ship.order(order)
    wayShip.orderWithWaypoint(order)
  }

  console.log(`First ship is ${ship.manhattanDistance} units away`)
  console.log(`Waypoint ship is ${wayShip.manhattanDistance} units away`)
}

fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n')

  const t0 = performance.now()
  rideShip(inputArray)
  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
