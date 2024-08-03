const Person = require(`./../models/person`)

function addPerson({name, number}) {
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

module.exports = {addPerson, getAllEntries, deletePerson}