const _ = require("dotenv").config()

const express = require('express')
const cors = require('cors')

const utils = require('./utils')
const morgan = require('./middleware/morgan')
const phonebookDbService = require("./services/phonebook")

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan.morgan(morgan.morgan_logging_function))

app.put('/api/persons/:id', (request, response) => {
  let id = request.params.id
  let name = request.body.name
  let number = request.body.number

  phonebookDbService
    .updateNumber(id, name, number)
    .then(newEntry => response.json(newEntry))
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
  phonebookDbService
    .getAllEntries()
    .then(entries => {
      console.log(`Retrived all phonebook entries from the DB`)
      response.json(entries)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', async (request, response, next) => {
  try {
    const id = request.params.id
    const person = await phonebookDbService.findPerson(id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end(`Person id: ${id} does not exist.`)
    }
  }
  catch (error) {
    next(error)
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  let idToRemove = request.params.id

  phonebookDbService
    .deletePerson(idToRemove)
    .then(removedPerson => response.json(removedPerson))
    .catch(error => next(error)) 
})

app.post('/api/persons', async (request, response, next) => {
  try {
  utils.validateRequest(request.body)
  
  const person = {
    name: request.body.name,
    number: request.body.number,
  }

  let personInPhonebook = await phonebookDbService.isPersonInPhonebook(person.name)
  if (personInPhonebook.length !== 0) {
    return response.status(404).send(personInPhonebook)
  }

  let addedPerson = await phonebookDbService.addPerson(person)
  response.json(addedPerson)
  
  } 
  catch (error) {
    next(error)
  }
  
})

app.get('/info', async (request, response, next) => {
  try {
    const amountOfEntriesInPhonebook = await phonebookDbService.amountOfEntries()
    const currentTime = new Date()

    const htmlToRespond = `<p>Phonebook has info for ${amountOfEntriesInPhonebook} persons</p> <p>${currentTime}</p>`
    
    response.send(htmlToRespond)
  }
  catch (error) {
    next(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error)
  
  if (error.name == "CastError") {
    return response.status(400).send({error: `Malformated id, it must be a 24 character hex string, 12 byte Uint8Array, or an integer`})
  }
  if (error.name === "InvalidRequest") {
    return response.status(400).send({error: error.message})
  }

  next(error) //response.status(500).end()
}

app.use(errorHandler)