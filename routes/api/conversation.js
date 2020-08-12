const express = require('express')
const router = express.Router();

const Conversation = require('../../models/conversation')

router.get('/', (req, res) => {
    if (!req.query.candidate) {
        res.status(500).json({
            'Message': 'Invalid Parameters'
        })
    } else {
        Conversation.find({ "slots.candidateId": req.query.candidate })
            .select('-__v')
            .exec()
            .then(data => {
                var messages = data.map(conversation => conversation.events.reduce((messages, event) => {
                    if (event.event === 'user') {
                        messages.push({
                            'sender': 'user',
                            'text': event.text
                        })
                    } else if (event.event === 'bot') {
                        messages.push({
                            'sender': 'bot',
                            'text': event.text
                        })
                    }
                    return messages
                }, []))
                res.status(200).json(messages)
            })
            .catch(err => { res.status(500).json({ error: err.message }) })
    }
})

module.exports = router