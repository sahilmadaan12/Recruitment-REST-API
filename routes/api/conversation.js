const express = require('express')
const router = express.Router();
const auth_token = process.env.auth_token
const account_sid = process.env.account_sid
const from_number = process.env.from_number

const Conversation = require('../../models/conversation')//the collection used by RASA Bot
const Chat = require('../../models/chat');//the collection used by the frontend

router.get('/:candidateId', (req, res) => {
    Conversation.find({ "slots.candidateId": req.params.candidateId })
        .select('-__v')
        .exec()
        .then(data => {
            let messages = data.map(conversation => conversation.events.reduce((messages, event) => {
                if (event.event === 'user') {
                    messages.push({
                        'sender': 'user',
                        'text': event.text,
                        'createdAt': event.timestamp
                    })
                } else if (event.event === 'bot') {
                    messages.push({
                        'sender': 'bot',
                        'text': event.text,
                        'createdAt': event.timestamp
                    })
                }
                return messages
            }, []))
            messages = messages[0]
            Chat.find({ "candidateId": req.params.candidateId }).exec().then(data => {
                if (data.length > 0) {
                    if(messages){
                        messages = messages.concat(data[0].chat) // array of array is in case we want to expand the channels with same candidateId
                        messages.sort((a, b) => {
                            return a.createdAt - b.createdAt
                        })
                    } else {
                        messages = data[0].chat
                    }
                }
                if(!messages){
                    messages = {}
                }
                res.status(200).json(messages)
            }).catch(err => { res.status(500).json({ error: err.message }) })
        })
        .catch(err => { res.status(500).json({ error: err.message }) })
})

router.post('/:candidateId', async (req, res) => {
    if (req.body.channel === "whatsapp"){
        const client = require('twilio')(account_sid, auth_token)
        if (req.body.text && req.body.to){
            req.body.body = req.body.text
            req.body.from = from_number
            const twilioStatus = await client.messages.create(req.body).catch(error => res.status(500).json(error))
            console.log(twilioStatus)
            if (twilioStatus.errorCode){
                res.status(500).json(twilioStatus)
            }
        } else {
            res.status(500).json({"Message": "Message should contain body and to keys"})
        }
    }
    Chat.findOneAndUpdate({ candidateId: req.params.candidateId }, { $push: { chat: req.body } }, {new: true}).exec()
        .then(result => {
            if (!result) {
                const newChat = new Chat({
                    chat: req.body,
                    candidateId: req.params.candidateId
                })
                newChat.save().then(result => {
                    res.json(result.chat[0])
                }).catch(err => res.json(err))
            } else {
                res.json(result.chat[result.chat.length-1])
            }
        })
        .catch(err => {res.json(err)})
})

module.exports = router