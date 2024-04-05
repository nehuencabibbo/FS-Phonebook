const express = require('express')
const app = express()

// app.use(express.json())

const notes = [
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
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = notes.find(person => person.id == id)

  if (person) {
    response.json(person)  
  } else {
    response.status(404).end(`Person id: ${id} does not exist.`)
  }
})

app.get('/info', (request, response) => {
  const currentTime = new Date()
  const htmlToRespond = `<p>Phonebook has info for ${notes.length} persons</p> <p>${currentTime}</p>`
  
  response.send(htmlToRespond)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})