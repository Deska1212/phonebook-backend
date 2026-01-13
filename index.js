// Install all required depencencies and modules
// Create Phonebook API, Returns hardcoded list at first
// Expressjs
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

// Enable cors for all routes
app.use(cors())

// Enable express json
app.use(express.json())

// Configure Morgan logging service
app.use(morgan('common'))

// Express static content
app.use(express.static('dist'))

// Hardcoded Data
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
console.log('Server Ran')

// Get all persons
app.get('/api/persons', (request, response) => {
    response.json(persons)
    console.log('Server responded with', persons)
})

// Info page
app.get('/info', (request, response) => {
  const now = Date()
  response.send(`
    <div>
      <h2> Phonebook has info for ${persons.length} people </h2>
      <p>${now}</p>
    </div>
    `)
})

// Get single entry
app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)

  if(person)
  {
    response.json(person)
  }
  else
  {
    response.statusMessage = `Not Found: Could not find user with ID ${id}`
    response.status(404).end()
  }
})

// Delete single entry
app.delete(`/api/persons/:id`, (request, response) => {
  const id = request.params.id 
  const personToDelete = persons.find(p => p.id === id);

  if(personToDelete)
  {
    // Delete the person
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  }
  else
  {
    response.statusMessage = `Not Found: Could not find user with ID ${id} to delete from server`
    response.status(404).end()
  }
})

// Add a person
app.post(`/api/persons`, (request, response) => {
  const {name, number} = request.body

  // Name and number should not be null
  if (!name || !number)
  {
    return response.status(400).json({ error: 'Name/Number cannot be empty' })
  }

  // Check if name already exists in phonebook
  if(persons.find(p => p.name === name))
  {
    return response.status(400).json({ error: 'Person already exists in database' })
  }
  

  const person = {
    id: String(Math.floor(Math.random() * 1000000)),
    name, 
    number
  }

  persons = persons.concat(person)

  response.status(201).json(person)
})

// Change an entry
// app.put(`/api/persons/:id`, (request, response) => {
  
//   const id = request.params.id
//   const {name, number} = request.body
  
//   // Validate Inputs
//   if(!name || !number)
//   {
//     return response.status(400).json({error: 'Name and number are required'})
//   }

//   // Check if person exists
//   const exists = persons.find(p => p.id === id);
//   if(!exists)
//   {
//     return response.status(404).json({error: 'Unable to find user on server'})
//   }

//   const updatedPerson = 
//   {
//     id,
//     name,
//     number
//   }

//   // Immutable update with map
//   persons = persons.map(p => p.id === updatedPerson.id ? updatedPerson : p)

//   // Return the updated person with HTTP 200 'OK'
//   response.status(200).json(updatedPerson)

// })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})
