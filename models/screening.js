const mongoose = require('mongoose')

const screeningSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  modelAnswer: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Screening', screeningSchema)