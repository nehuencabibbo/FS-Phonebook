const _ = require("dotenv").config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const personDbService = require("./services/person")

const Person = require("./models/person")

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(morgan_logging_function))

function morgan_logging_function(tokens, req, res) {
  let logging_content = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ]

  if (req.method == "POST") {logging_content.push(tokens['user-data'](req, res))}

  return logging_content.join(' ')
}

morgan.token('user-data', function (req, res) { 
  if (req.method != "POST") {
    return null
  }

  return JSON.stringify(req.body)
})

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  personDbService
    .getAllEntries()
    .then(entries => {
      console.log(`Retrived all phonebook entries from the DB`)
      response.json(entries)
    })
    .catch(error => {
      console.log(`Failed to retrive all phonebook entries from the DB, error: ${error.message}`)
      response.status(404).end(`${logError}, error: ${error.message}`)
    })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)  
  } else {
    response.status(404).end(`Person id: ${id} does not exist.`)
  }
})

function removePerson(id, persons) {
  const indexToRemove = persons.findIndex(person => person.id === id);
  if (indexToRemove !== -1) {
    let removedPerson = persons[indexToRemove];
    persons.splice(indexToRemove, 1);

    return removedPerson;
  }

  return null;
}

app.delete('/api/persons/:id', (request, response) => {
  const idToDelete = Number(request.params.id)

  let removedPerson = removePerson(idToDelete, persons)
  
  if (removedPerson) {
    persons = persons.filter(person => person.id !== idToDelete)
    response.json(removedPerson)
  } else {
    response.status(404).end(`Person of id ${idToDelete} doesn't exist`)
  }
})

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getMissingFields(body) {
  const missingFields = [];
  if (!body.name) missingFields.push('name');
  if (!body.number) missingFields.push('number');

  return missingFields;
}

function isNameAlreadyInPhonebook(name) {
  if (!persons.find(person => person.name === name)) return false

  return true
}


function isRequestNotValid(body) {
  // Can this happen at all? 
  if (!body) return {isNotValid: true, error: 'There was no response body'}
  
  let missingFields = getMissingFields(body);
  if (missingFields.length > 0) {
    return {
      isNotValid: true, 
      error: `Missing fields ${missingFields.join(" and ")}`
    }
  }
  
  if (isNameAlreadyInPhonebook(body.name)) {
    return {isNotValid: true, error: `${body.name} is already in the phonebook`}
  }

  return {isNotValid: false, error: ``}
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  let requestAssertion = isRequestNotValid(body)
  if (requestAssertion.isNotValid) {
    return response.status(400).json({error: `${requestAssertion.error}`})
  }
  
  const person = {
    name: body.name,
    number: body.number,
  }

  personDbService.addPerson(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const currentTime = new Date()
  const htmlToRespond = `<p>Phonebook has info for ${persons.length} persons</p> <p>${currentTime}</p>`
  
  response.send(htmlToRespond)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})