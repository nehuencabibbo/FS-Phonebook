import personService from "./services/person"

function isPersonInPhonebook(persons, newPerson) {
    return persons.some((person) => 
        person.name == newPerson.name)
}

function showOperationCompletedMessageForSomeTime(message, type, duration, setOperationCompletedMessage) {
    setOperationCompletedMessage(
        {message: message, type: type}
    )
    setTimeout(() => {
        setOperationCompletedMessage(null)
    }, duration)

}

function addPersonAndShowMessage(newPerson, persons, setPersons, setOperationCompletedMessage) {
    personService
        .add(newPerson)
        .then(returnedPerson => { 
            setPersons(persons.concat(returnedPerson))

            showOperationCompletedMessageForSomeTime(
                `Added ${returnedPerson.name}`,
                `success`,
                5000,
                setOperationCompletedMessage
            )
        })
}

function changePersonNumberAndShowMessage(personWithNewNumber, persons, setPersons) {
    let newPersonsList = persons.map(person => 
        (person.id == personWithNewNumber.id) 
        ? personWithNewNumber
        : person
    )
    setPersons(newPersonsList)
    showOperationCompletedMessageForSomeTime(
        `${newPerson.name}'s number was changed to ${newPerson.number}`,
        `success`,
        200000,
        setOperationCompletedMessage
    )
}

function changePersonNumber(newPersonId, newPerson, persons, setPersons, setOperationCompletedMessage) {
    personService
        .change(newPersonId, newPerson)
        .then(personWithNewNumber => {
            changePersonNumberAndShowMessage(personWithNewNumber, persons, setPersons)
        })
        .catch(error => {
            //TODO: Fetchear todo denuevo
            showOperationCompletedMessageForSomeTime(
                `Couldn't change ${newPerson.name}'s phone number, person was previously deleted from the server`,
                `error`,
                5000,
                setOperationCompletedMessage
            )
        })
}

function getAddPersonHandler(persons, newName, newNumber, setPersons, setOperationCompletedMessage) {
    function addPerson(event) {
        event.preventDefault()
    
        const newPerson = {name: newName, number: newNumber}
    
        if (!isPersonInPhonebook(persons, newPerson)) {
            addPersonAndShowMessage(newPerson, persons, setPersons, setOperationCompletedMessage)
        } else {
          const confirmationText = `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
          if (confirm(confirmationText)){
            const newPersonId = persons
              .find(person => 
                person.name == newPerson.name)
              .id
        
            changePersonNumber(
                newPersonId,
                newPerson,
                persons,
                setPersons,
                setOperationCompletedMessage
            )
            // No tengo ni idea que hacia esto aca, parece que no hace nada, pero lo dejo
            // por las dudas
            // setPersons(
            //     persons
            //         .filter(person => 
            //             newPersonId != person.id))         
            }
        }
    }

    return addPerson;
}

export default getAddPersonHandler;