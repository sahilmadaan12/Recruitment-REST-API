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
  resume: String,
  avatar: String, //Profile Image or DP: Provide a link to pic
  score: {
    type: Number,
    default: () => Math.floor((Math.random() * 100) + 1)
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
  chatType: {
    type: String,
    enum: ['outbound', 'inbound'],
    default: 'inbound'
  },
  chatState: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  uid: {
    type: String,
    default: () => Math.floor(1000000 + Math.random() * 9000000)
  },
  response: {
    type: [responseSchema],
    required: true
  }
})

module.exports = mongoose.model('Candidate', candidateSchema)