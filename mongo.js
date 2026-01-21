const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('Give password as an arguement')
    process.exit(1)
}

// This test app assumes we will be passing in credentials as a command line param. 
const password = encodeURIComponent(process.argv[2])

const collection = 'phonebook'

const url = `mongodb+srv://fullstack:${password}@cluster0.taublwt.mongodb.net/${collection}?appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect (url, {family: 4}) // Family is specifying that we are using IPv4

// Defining schema for the note, how the notes will be stored in the DB


// 'Note' is the name of the model, 
// Mongo is schemaless so it doesn't enforce it on the DB side
// Can be enforced on backend though
// Ideally we validate it on front end, validate it on the backend and enforce it before its recorded into the DB
// The idea with mongoose is that the data stored in the DB is given a schema at the level of the application
const Person = mongoose.model('Person', personSchema)


// All above is setup


if (process.argv.length > 3) {
    
    // Get person params from command line args
    const name = process.argv[3]
    const number = process.argv[4]
    
    // We create a new note here with the help of our model
    // The model is just a constructor function that creates new objects based on the parameters we pass in from our schema
    const person = new Person({
        name, 
        number
    })
    
    person.save().then(results => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        console.log(results)
        mongoose.connection.close() // If the connection is not closed here it remains open until the program terminates
    })
}
else {
    console.log(`Listing all members in phonebook DB`)

    Person.find({}).then(result => {
        result.forEach(person => console.log(`${person.name} ${person.number}`))
        mongoose.connection.close()
    })
}

