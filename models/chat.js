const mongoose = require('mongoose')

const chatFormat = mongoose.Schema({
    sender: String,
    text: String,
    createdAt: Number,
    updatedAt: Number
}, {timestamps: { currentTime: () => Math.floor(Date.now() / 1000) }})

const chatSchema = mongoose.Schema({
    candidateId: {
        type: mongoose.Types.ObjectId,
        ref: 'Candidate',
        required: true
    },
    chat: {
        type: [chatFormat],
        required: true
    }
})

module.exports = mongoose.model('Chat', chatSchema)