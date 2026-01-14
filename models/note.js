const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.getActiveResourcesInfo.MONGODB_URI

console.log('connecting to...', url)
mongoose.connect(url, {family: 4}).then(result => {
    console.log('connected to MongoDB')
}).catch(error => {
    console.log('unable to connect to MongoDB')
})



