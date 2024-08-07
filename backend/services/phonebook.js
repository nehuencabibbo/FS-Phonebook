const Person = require('../models/person')

function addPerson({ name, number }) {
  const person = new Person({
    name: name,
    number: number
  })

  return person.save()
}

function getAllEntries() {
  return Person.find({})
}

function deletePerson(id) {
  return Person.findByIdAndDelete(id)
}

function findPerson(id) {
  return Person.findById(id)
}

function isPersonInPhonebook(name) {
  return Person.find({ name: name })
}

function amountOfEntries() {
  return Person.countDocuments({})
}

function updateNumber(id, name, number) {
  const person = {
    name: name,
    number: number,
  }

  return Person.findByIdAndUpdate(
    id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
}

module.exports = {
  addPerson,
  getAllEntries,
  deletePerson,
  findPerson,
  isPersonInPhonebook,
  amountOfEntries,
  updateNumber
}