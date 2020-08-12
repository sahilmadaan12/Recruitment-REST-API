const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
  events: Array,
  slots: {
    jobId: {
      type:mongoose.Types.ObjectId,
      ref: 'Vacancy',
    },
    candidateId: {
      type: mongoose.Types.ObjectId,
      ref: 'Candidate',
    }
  }
})

module.exports = mongoose.model('Conversation', conversationSchema)