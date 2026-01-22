require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const app = express()

// TODO: Move error handling of the application into a new error handler middleware

// Models
const Person = require('./models/person')

// Setup DB Connection
const url = process.env.MONGODB_URI

console.log('connecting to...', url)
mongoose.connect(url, {family: 4}).then(result => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('unable to connect to MongoDB')
})
mongoose.set('strictQuery', false)

// Enable express json
app.use(express.json())

// Configure Morgan logging service
app.use(morgan('common'))

// Express static content
app.use(express.static('dist'))




console.log('Server completed setup')

// Get all persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(result => {
      console.log('Results: ', result)
      console.log('Server responded with data from DB')
      response.json(result)
    })
})

// Info 
app.get('/info', (request, response) => {
  const now = Date()
  let personCount = 0
  Person.find({}).then(result => {
    personCount = result.length
    console.log(result[0]._id)
    response.send(`
    <div>
      <h2> Phonebook has info for ${personCount} people </h2>
      <p>${now}</p>
    </div>
    `)
  })

  
})

// Get single entry by id.
app.get(`/api/persons/:id`, (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(result => {
    const person = result

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
  .catch(error => next(error))
})

// Delete single entry
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  console.log(`Attempting to delete user with ID: ${id}`);
  // Check for valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'Invalid ID format' });
  }
  Person.findByIdAndDelete(id)
    .then(deletedPerson => {
      if (!deletedPerson) {
        console.log(`No person found with ID: ${id}`);
        return response.status(404).json({ error: `No person found with ID ${id}` });
      }
      console.log(`Deleted person: ${deletedPerson.name} (ID: ${id})`);
      response.status(204).end();
    })
    .catch(error => {
      console.error('Error deleting person:', error);
      response.status(500).json({ error: 'Server error while deleting user' });
    });
});

// Add a person
app.post(`/api/persons`, (request, response) => {
  const {name, number} = request.body

  // Validate the request inputs
  if (!name || !number)
  {
    console.log('Name and number must be filled')
    return response.status(400).json({ error: 'Name/Number cannot be empty' })
  }

  // Check if person exists in the DB and return Bad Request if so
  Person.exists({name: name}).then(exists => {
    console.log(`Exists object`, exists)
    if (exists)
    {
      return response.status(400).json({ error: 'Person already exists in database' })
    }

    const personToSave = new Person({
    name, 
    number
  })

    personToSave.save().then(results => {
      console.log(`added person to server ${personToSave.name} : ${personToSave.number}`)
      response.status(201).json(personToSave)
    })
  })
})

app.put(`/api/persons/:id`, (request, response) => {
  
})



// Handle any errors
const errorHandler = (error, request, response, next) => {
  console.log(`Error: `, error.message)

  if(error.name === 'CastError')
  {
    return response.status(400).send({error: `Malformatted ID`})
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log('Server running on port', PORT)
})
