const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to...', url)
mongoose.connect(url, {family: 4}).then(result => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('unable to connect to MongoDB')
})

const personSchema = new mongoose.Schema({
    name: String, 
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject._id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)