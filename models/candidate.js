const mongoose = require('mongoose')

const responseSchema = mongoose.Schema({
  response: String,
  score: String
})

const candidateSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  dob: Date,
  currentPosition: String,
  currentCompany: String,
  currentLocation: String,
  cvLink: {
    type: String
  },
  avatar: String, //Profile Image or DP: Provide a link to pic
  score: {
    type: Number,
    default: () => Math.floor((Math.random() * 100) + 1)
  },
  active: {
    type: Boolean,
    default: true
  },
  notes: String,
  jobId: {
    type: [mongoose.Types.ObjectId],
    ref: 'Vacancy',
    required: true,
    // validate: v => v == null || v.length > 0
  },
  date:String,
  time:String,
  designation: String,
  organisation: String,
  department:String,
  experience:String,
  sessionid: String,
  uid: {
    type: String,
    unique: true
  },
  response: {
    type: [responseSchema],
    required: true
  }
})

module.exports = mongoose.model('Candidate', candidateSchema)