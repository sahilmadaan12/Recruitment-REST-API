const mongoose = require('mongoose')

const conversationSchema = mongoose.Schema({
  events: Array,
  slots: {
    // jobId: {
    //   type:mongoose.Types.ObjectId,
    //   ref: 'Vacancy',
    // },
    candidateId: String
  }
})

module.exports = mongoose.model('Conversation', conversationSchema)