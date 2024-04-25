const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
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
  response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
  const id_to_delete = Number(request.params.id)

  persons = persons.filter(person => person.id !== id_to_delete)

  response.status(204).end()
})

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function are_missing_fields(body, response) {
  if (!body) {
    response.status(400).json({error: 'Empty response'})

    return true
  }

  if (!body.name && !body.number) {
    response.status(400).json({error: 'Missing name and number'})

    return true
  }

  if (!body.name) {
    response.status(400).json({error: 'Missing name'})

    return true
  }

  if (!body.number) {
    response.status(400).json({error: 'Missing number'})

    return true
  }

  return false
}

function is_name_already_in_phonebook(name) {
  if (!persons.find(person => person.name === name)) return false

  return true
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (are_missing_fields(body, response)) return

  if (is_name_already_in_phonebook(body.name)) {
    return response.status(400).json({error: `${body.name} is already in the phonebook`})
  }
  
  const person = {
    name: body.name,
    number: body.number,
    id: randomIntFromInterval(0, 100000000)
  }
  
  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const currentTime = new Date()
  const htmlToRespond = `<p>Phonebook has info for ${persons.length} persons</p> <p>${currentTime}</p>`
  
  response.send(htmlToRespond)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})