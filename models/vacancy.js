const mongoose = require('mongoose')

const vacancySchema = mongoose.Schema({
  jobTitle: {
    type: String,
    required: true
  },
  available: {
    type: Boolean,
    default: true,
  },
  applicationReceived: {
    type: Number,
    default: 0
  },
  salary: Number,
  minXp: Number,
  maxXp: Number,
  location: String,
  jobDesc: String,
  screening: {
    type: [mongoose.Types.ObjectId],
    ref: 'Screening',
    required: true,
  }
})

module.exports = mongoose.model('Vacancy', vacancySchema)