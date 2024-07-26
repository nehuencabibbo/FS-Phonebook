import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import ContactData from './components/ContactData'
import NumberList from './components/NumberList'
import personService from './services/person'
import Notification from './components/Notification'
import './index.css'

const Title = ({text}) => (<h1>{text}</h1>)

const SubTitle = ({text}) => (<h2>{text}</h2>)

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('Martin Fowler')
  const [newNumber, setNewNumber] = useState('15-4112-3807')
  const [filter, setFilter] = useState('')
  const [operationCompletedMessage, setOperationCompletedMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(returnedPersons => {
        setPersons(returnedPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const newPerson = {name: newName, number: newNumber}

    const isPersonInPhonebook = (persons, newPerson) => {
      return persons.some(
        (person) => 
          person.name == newPerson.name)
    }

    if (!isPersonInPhonebook(persons, newPerson)) {
      personService
        .add(newPerson)
        .then(returnedPerson => { 
          setPersons(persons.concat(returnedPerson))

          setOperationCompletedMessage(
            {
              message: `Added ${returnedPerson.name}`,
              type: 'success',
            }
          )
          setTimeout(() => {
            setOperationCompletedMessage(null)
          }, 5000)
        })
    } else {
      const confirmationText = `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
      if (confirm(confirmationText)){
        const newPersonId = persons
          .find(person => 
            person.name == newPerson.name)
          .id
        
        personService
          .change(newPersonId, newPerson)
          .then(personWithNewNumber => {
            setPersons(persons.map(
              person =>
                (person.id == personWithNewNumber.id) 
                ? personWithNewNumber
                : person
              )
            )
            setOperationCompletedMessage(
              {
                message: `${newPerson.name}'s number was changed to ${newPerson.number}`, 
                type: 'success',
              })
            setTimeout(() => {
              setOperationCompletedMessage(null)
              }, 20000)
            }
          )
          .catch(error => {
            //TODO: Fetchear todo denuevo
            setOperationCompletedMessage(
              {
              message: `Couldn't change ${newPerson.name}'s phone number, person was previously deleted from the server`,
              type: 'error'
              }
            )
            setTimeout(() => {
              setOperationCompletedMessage(null)
            }, 5000)
          })

          setPersons(
              persons
                  .filter(person => 
                      newPersonId != person.id))  
                  
      }
      }
    }

  return (
    <div>
      <Title text={"Phonebook"}/>
      <Notification 
        message={
          operationCompletedMessage != null ? operationCompletedMessage.message : null
        } 
        type={
          operationCompletedMessage != null ? operationCompletedMessage.type : null
        }
      />

      <SubTitle text={"Filter"}/>
      <Filter 
        filterValue={filter} 
        handleFilterChange={
          (event) => setFilter(event.target.value)}/>
      
      <SubTitle text={"Contact data"}/>
      <ContactData 
        addPerson={addPerson} 
        newName={newName} 
        newNumber={newNumber}
        handleNewName={
          (event) => {
            setNewName(event.target.value)
        }}
        handleNewNumber={
          (event) => {
            setNewNumber(event.target.value)
          }
        }/>

      <SubTitle text={"Numbers"}/>
      <NumberList 
        persons={persons} 
        filter={filter}
        setPersons={setPersons}/>
    </div>
  )
}

export default App