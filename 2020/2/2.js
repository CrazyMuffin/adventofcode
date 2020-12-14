const fs = require('fs')
const path = require('path')

function firstRule (dataArray) {
  let matchCount = 0

  for (const line of dataArray) {
    // 3-9 w: dwwhwbwwwwwzwtwxw
    const parts = line.split(': ')
    const password = parts[1].trim()
    const policy = parts[0].split(' ')
    const letter = policy[1]
    const policyPart = policy[0].split('-')
    const min = policyPart[0]
    const max = policyPart[1]

    const numberOfChars = (password.match(new RegExp(letter, 'g')) || []).length
    console.log(line + ' ---- ' + numberOfChars)

    if (numberOfChars >= min && numberOfChars <= max) {
      matchCount++
    }
  }

  console.log(dataArray.length)
  console.log(matchCount)
}

function secondRule (dataArray) {
  let matchCount = 0

  for (const line of dataArray) {
    // 3-9 w: dwwhwbwwwwwzwtwxw
    const parts = line.split(': ')
    const password = parts[1].trim()
    const policy = parts[0].split(' ')
    const letter = policy[1]
    const policyPart = policy[0].split('-')
    const first = policyPart[0]
    const second = policyPart[1]

    const firstMatching = password.charAt(first - 1) === letter
    const secondMatching = password.charAt(second - 1) === letter

    if ((firstMatching || secondMatching) && !(firstMatching && secondMatching)) {
      matchCount++
    }

    console.log(`${line} :: ${firstMatching ? 'Y' : 'N'} / ${secondMatching ? 'Y' : 'N'}`)
  }

  console.log(dataArray.length)
  console.log(matchCount)
}

fs.readFile(path.resolve(__dirname, '2.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const dataArray = data.toString().split('\n')

  firstRule(dataArray)

  secondRule(dataArray)
})
