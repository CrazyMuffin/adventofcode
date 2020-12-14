const fs = require('fs')
const path = require('path')

function process (passports) {
  const totalPassports = passports.length
  let partiallyValidPassports = 0
  let validPassports = 0

  const requiredFields =
    [
      'byr',
      'iyr',
      'eyr',
      'hgt',
      'hcl',
      'ecl',
      'pid'
      // 'cid',
    ]
  const allowedEyeColors =
    [
      'amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'
    ]

  for (const passport of passports) {
    let partiallyValid = true

    for (const requiredField of requiredFields) {
      if (!passport[requiredField]) {
        partiallyValid = false
        break
      }
    }

    if (partiallyValid) {
      partiallyValidPassports++

      const height = passport.hgt
      // if (!height.match(/^59in$|^6[0-9]in$|^7[0-6]in$|^1[5-8][0-9]cm$|^19[0-3]cm$/g)) {
      if (!height.match(/^(59|6[0-9]|7[0-6])in$|^(1[5-8][0-9]|19[0-3])cm$/g)) {
        console.log(height)
        continue
      }

      if (passport.byr < 1920 || passport.byr > 2002) {
        continue
      }

      if (passport.iyr < 2010 || passport.iyr > 2020) {
        continue
      }

      if (passport.eyr < 2020 || passport.eyr > 2030) {
        continue
      }

      if (!passport.hcl.match(/^#[a-f0-9]{6}$/)) {
        continue
      }

      if (!allowedEyeColors.includes(passport.ecl)) {
        continue
      }

      if (!passport.pid.match(/^[0-9]{9}$/)) {
        continue
      }

      validPassports++
    }
  }

  console.log(`${partiallyValidPassports} of ${totalPassports} are partially valid.`)
  console.log(`${validPassports} of ${totalPassports} are actually valid.`)
}

fs.readFile(path.resolve(__dirname, '4.txt'), 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const inputArray = data.toString().replace(/^\s*[\r\n]/gm, '|').replace(/[\r\n]/gm, ' ').split('|')

  const dataArray = inputArray.map(function (line) {
    const jsonFields = line.trim().split(' ').map(function (actualField) {
      const entry = actualField.split(':')
      return `"${entry[0]}":"${entry[1]}"`
    }).join(',')
    const json = '{' + jsonFields + '}'

    return JSON.parse(json)
  })

  process(dataArray)
})
