import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import ContactData from './components/ContactData'
import NumberList from './components/NumberList'
import personService from './services/person'
import Notification from './components/Notification'

import getAddPersonHandler from "./utils"
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

  const addPerson = getAddPersonHandler(
    persons, 
    newName,
    newNumber,
    setPersons,
    setOperationCompletedMessage
  )

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