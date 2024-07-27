const mongoose = require('mongoose')

// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
// })

function savePersonToTheDataBase(name, number, url) {
  mongoose.connect(url)

  // Schema (interface for the fields) for the Note
  const personSchema = new mongoose.Schema({
    name: String, 
    number: String
  })

  // Models are fancy constructors compiled from Schema definitions.
  // An instance of a model is called a document. 
  // OBS: mongoose.model(...) returns a CLASS, this will be the notes (
  // mongoose automatically converts it to plurarl) collection in the db
  const Person = mongoose.model('Person', personSchema)

  // New document is created based on the info to then save it to the db
  const person = new Person({
    name: name,
    number: number
  })

  person
    .save()
    .then(response => {
      console.log(`Person ${name} was saved to the database with number ${number}`)
      mongoose.connection.close()
    })
}

function displayAllPhonebookEntries(url) {
  mongoose.connect(url)

  const personSchema = new mongoose.Schema({
    name: String,
    number: String
  })

  const Person = mongoose.model('Person', personSchema)

  Person
    .find({})
    .then(response => {
      console.log("Phonebook:")
      response.forEach(person => console.log(`${person.name} ${person.number}`))
      mongoose.connection.close()
    })
}

function main () {
  // argv = [dondeEstaNode, pathArchivoAEjecutar, arg1, arg2, ....]
  if (!(process.argv.length === 3 || process.argv.length === 5)) {
    console.log('Not enough arguments provided, need: password name number')
    process.exit(1)
  }

  const password = process.argv[2]
  const url =
    `mongodb+srv://nehuen:${password}@phonebookdb.525bezx.mongodb.net/phonebook?retryWrites=true&w=majority&appName=PhonebookDB`

  if (process.argv.length === 3) {
    displayAllPhonebookEntries(url)
  }
  else {
    const name = process.argv[3]
    const number = process.argv[4]

    savePersonToTheDataBase(name, number, url)
  }
}

main()