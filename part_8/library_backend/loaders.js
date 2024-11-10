const DataLoader = require('dataloader')
const Book = require('./models/book')

const bookLoader = new DataLoader(bookIds => {
  console.log(bookIds)
  return 0
})

module.exports = bookLoader