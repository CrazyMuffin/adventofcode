const fs = require('fs')

function process (passes) {
  let maxSeatID = 1
  let maxPass = ''

  const occupiedSeats = []

  for (const pass of passes) {
    const rowString = pass.substr(0, 7)
    const row = rowString.replace(/B/gi, '0').replace(/F/gi, '1')
    const seatString = pass.substr(7, 11)
    const seat = seatString.replace(/R/gi, '0').replace(/L/gi, '1')
    const seatNumber = 7 - parseInt(seat, 2)
    const rowNumber = 127 - parseInt(row, 2)

    const seatID = rowNumber * 8 + seatNumber

    console.log(`Boarding Pass ${pass} - Row ${rowNumber}, Seat ${seatNumber}, ID: ${seatID}`)

    occupiedSeats.push(seatID)

    if (seatID > maxSeatID) {
      maxSeatID = seatID
      maxPass = pass
    }
  }

  console.log(`MAX SEAT ID FOUND: ${maxSeatID}, Pass: ${maxPass}`)
  occupiedSeats.sort()

  for (let i = 100; i <= maxSeatID; i++) {
    if (!occupiedSeats.includes(i) && occupiedSeats.includes(i + 1) && occupiedSeats.includes(i - 1)) {
      console.log(`Empty seat ID: ${i}`)
    }
  }
}

fs.readFile('inputs/5.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n')

  process(inputArray)
})
