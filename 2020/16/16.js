const path = require('path')
const fs = require('fs')
const {performance} = require('perf_hooks')
const _ = require('lodash');

const array_column = (array, column) => array.map(row => row[column])

class Rule {
  possibleTicketIndex = []

  constructor(validIds) {
    this.validIds = validIds
  }
}

class Rulebook {
  allRules
  rules = []
  uncheckedRules

  addRule(ruleString) {
    const matches = ruleString.match(/^([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)$/)
    this.rules[matches[1]] = new Rule(_.range(parseInt(matches[2]), parseInt(matches[3]) + 1).concat(_.range(parseInt(matches[4]), parseInt(matches[5]) + 1)))
  }

  getUncheckedRules() {
    if (typeof this.uncheckedRules === 'undefined') {
      this.uncheckedRules = Object.keys(this.rules)
    }
    return this.uncheckedRules
  }

  getAllRules() {
    if (typeof this.allRules === 'undefined') {
      this.allRules = []
      for (const rulesKey in this.rules) {
        this.allRules = this.allRules.concat(this.rules[rulesKey].validIds)
      }
    }
    return this.allRules
  }


  isValueValid(value) {
    return this.getAllRules().includes(parseInt(value))
  }
}

const resolveRules = (possibleRules) => {
  const ruleCount = Object.keys(possibleRules).length

  let resolvedRules = {}

  while (Object.keys(resolvedRules).length !== ruleCount) {
    for (const possibleRulesKey in possibleRules) {
      if (possibleRules[possibleRulesKey].length === 1) {
        const rule = possibleRules[possibleRulesKey][0];

        resolvedRules[possibleRulesKey] = rule
        delete possibleRules[possibleRulesKey]
        for (const possibleRulesKey in possibleRules) {
          _.remove(possibleRules[possibleRulesKey], (innerRule) => rule === innerRule)
        }
        break
      }
    }
  }
  return resolvedRules
}

const getDepartureIndexes = (resolvedRules) => {
  let indexes = []
  for (const [index, value] of Object.entries(resolvedRules)) {
    if (value.includes('departure')) {
      indexes.push(parseInt(index))
    }
  }
  return indexes
}

const process = (rules, myTicket, otherTickets) => {
  const rulebook = new Rulebook()

  rules.forEach((ruleString) => rulebook.addRule(ruleString))

  const isTicketValid = ticket => {
    for (const value of ticket.split(',')) {
      if (!rulebook.isValueValid(value)) {
        return false
      }
    }
    return true
  }

  const filteredTickets = _.remove(otherTickets.concat(myTicket), isTicketValid).map((row) => row.split(',').map(value => parseInt(value)))

  let possibleRules = {}

  for (let i = 0; i < Object.keys(rulebook.rules).length; i++) {
    const ticketValues = array_column(filteredTickets, i)
    possibleRules[i] = []
    rulebook.getUncheckedRules().forEach(
      (uncheckedRule) => {
        if (ticketValues.every((value) => rulebook.rules[uncheckedRule].validIds.includes(value))) {
          rulebook.rules[uncheckedRule].possibleTicketIndex.push(i)
          possibleRules[i].push(uncheckedRule)
        }
      })
  }

  const resolvedRules = resolveRules(possibleRules)
  const departureIndexes = getDepartureIndexes(resolvedRules)

  let finalValue = 1
  myTicket = myTicket.split(',').map(value => parseInt(value))
  for (const departureIndex of departureIndexes) {
    finalValue*=myTicket[departureIndex]
  }
  return finalValue
};

fs.readFile(path.resolve(__dirname, 'input.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().replace(/^\s*[\r\n]/gm, '|').split('|').map((value) => value.trim())

  const rules = inputArray[0].split('\n')
  const myTicket = inputArray[1].split('\n')[1]
  const otherTickets = inputArray[2].split('\n')
  otherTickets.shift()

  const t0 = performance.now()
  const finalValue = process(rules, myTicket, otherTickets)
  console.log(`FinalValue: ${finalValue}`)

  const t1 = performance.now()

  console.log(`Processing took: ${t1 - t0} ms`)
})
