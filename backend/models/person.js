require('dotenv').config()

const custom_validators = require('./custom_person_validators')

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => console.log('Connected to the DB'))
  .catch(error => console.log(`Failed to connect to the DB with error: ${error.message}`))

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name should be at least 3 characters long'],
    required: true,
  },
  number: {
    type: String,
    validate: custom_validators.number_validators,
    required: true,
  },
})

// Setting the toJson property of the schema, every document that has the schema
// will have it. Whenever doing response.json(person) .json() calls stringify()
// that underneath calls toJson is defined
personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person