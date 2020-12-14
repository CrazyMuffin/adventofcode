const fs = require('fs')
const path = require('path')

class BagStorage {
  constructor () {
    this.bags = {}
  }

  addBag (bag) {
    if (this.bags[bag.bagName]) {
      this.bags[bag.bagName].childBags = bag.childBags
    } else {
      this.bags[bag.bagName] = bag
    }

    for (const childBagName in bag.childBags) {
      if (!this.bags[childBagName]) {
        this.bags[childBagName] = new Bag(childBagName)
      }
      this.bags[childBagName].parentBags[bag.bagName] = 1
    }
  }

  findBagParents (bagName, results) {
    for (const parentBag in this.bags[bagName].parentBags) {
      results = this.findBagParents(parentBag, results)
      results[parentBag] = true
    }
    return results
  }

  countChildBags (bagName, bagQuantity) {
    let count = 0
    for (const [childBagName, childBagsCount] of Object.entries(this.bags[bagName].childBags)) {
      count += childBagsCount
      count += this.countChildBags(childBagName, childBagsCount)
    }
    return count * bagQuantity
  }
}

class Bag {
  constructor (bagName) {
    this.bagName = bagName
    this.childBags = {}
    this.parentBags = {}
  }
}

function process (rules) {
  const storage = new BagStorage()

  for (const ruleLine of rules) {
    const rule = ruleLine.replace('.', '').split(' bags contain ')
    const bagName = rule[0]

    const bag = new Bag(bagName)

    if (rule[1] !== 'no other bags') {
      for (const contains of rule[1].split(', ')) {
        const matches = contains.match(/(\d+) (\w+ \w+) bags?/)
        const innerBagcount = matches[1]
        const innerBagName = matches[2]
        bag.childBags[innerBagName] = parseInt(innerBagcount)
      }
    }
    storage.addBag(bag)
  }

  const bagParents = storage.findBagParents('shiny gold', {})

  console.log(`Parents of shiny gold bag: ${Object.keys(bagParents).length}`)

  const bagChildren = storage.countChildBags('shiny gold', 1)

  console.log(`Children of shiny gold bag: ${bagChildren}`)
}

fs.readFile(path.resolve(__dirname, '7.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().split('\n')

  process(inputArray)
})
