const express = require('express')
const router = express.Router();
const auth_token = process.env.auth_token
const account_sid = process.env.account_sid
const from_number = process.env.from_number

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

router.post('/:type', (req, res) => {
    if (req.params.type === "whatsapp"){
        const client = require('twilio')(account_sid, auth_token);
        if (req.body.body && req.body.to){
            req.body.from = from_number
            client.messages
                .create(req.body)
                .then(message => {
                    console.log(message)
                    res.status(200).json(message)
                }).catch( error => res.status(200).json(error))
        } else {
            res.status(500).json({"Message": "Message should contain body and to keys"})
        }
    } 
    if (req.params.type === "rest"){
        res.status(200).json(req.body)
    }
    else {
        res.status(500).json({"Message": "Invalid type, use whatsapp"})
    }
})

module.exports = router