const fs = require('fs')

function makeUnique (str) {
  return String.prototype.concat(...new Set(str))
}

function process (questions) {
  let someYesAnswers = 0
  let allYesAnswers = 0
  for (let question of questions) {
    question = question.trim()
    const trimmedQuestion = question.replace(/\s/gm, '').trim()
    const unique = makeUnique(trimmedQuestion)

    const groupArray = question.split(' ')
    const groupObject = {}
    for (const groupLine of groupArray) {
      for (const groupChar of groupLine) {
        groupObject[groupChar] = groupObject[groupChar] ? groupObject[groupChar] + 1 : 1
      }
    }

    const desiredLength = groupArray.length

    let validAnswers = 0
    for (const groupProperty in groupObject) {
      if (groupObject[groupProperty] === desiredLength) {
        validAnswers++
      }
    }
    someYesAnswers += unique.length
    allYesAnswers += validAnswers

    console.log(`${question} -- ${unique} -- ${unique.length} -- ${validAnswers}`)
  }

  console.log(`Some Yes answers: ${someYesAnswers}`)
  console.log(`All Yes answers: ${allYesAnswers}`)
}

fs.readFile('inputs/6.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().replace(/^\s*[\r\n]/gm, '|').replace(/[\r\n]/gm, ' ').split('|')

  process(inputArray)

  process(['rdc drc sdorc'])
})
