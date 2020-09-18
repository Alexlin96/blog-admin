var fs = require('fs')

const newArr = []
const files = fs.readdirSync('../svg')
files.forEach(el => {
  if (el.indexOf('svg') > -1) {
    newArr.push(`${el.split('.')[0]}`)
  }
})

console.log('newArr', newArr)
