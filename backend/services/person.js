const Person = require(`./../models/person`)

function addPerson({name, number}) {
    // This is a new person document 
    const person = new Person({
        name: name, 
        number: number
    })

    return person.save()
}

function getAllEntries() {
    return Person.find({})
}

module.exports = {addPerson, getAllEntries}