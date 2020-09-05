const express = require('express')
const router = express.Router();
const auth_token = process.env.auth_token
const account_sid = process.env.account_sid
const from_number = process.env.from_number

const Conversation = require('../../models/conversation')//the collection used by RASA Bot
const Chat = require('../../models/chat');//the collection used by the frontend

async function convo(candidateId) {
    try{
        const conversation = await Conversation.find({ "slots.candidateId": candidateId })
        let messages = conversation.map(conversation => conversation.events.reduce((messages, event) => {
            if (event.event === 'user') {
                if (event.text.startsWith("/")) {
                    event.text = event.text.split("/")[1]
                    if (event.text.split("\"").length > 1) {
                        event.text = event.text.split("\"")[3]
                    }
                }
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
        let chat = await Chat.find({ "candidateId": candidateId })
        if (chat.length > 0) {
            if (messages) {
                messages = messages.concat(chat[0].chat) // array of array is in case we want to expand the channels with same candidateId
                messages.sort((a, b) => {
                    return a.createdAt - b.createdAt
                })
            } else {
                messages = chat[0].chat
            }
        }
        if (!messages) {
            messages = {}
        }
        return messages
    } catch(error){
        throw new Error(error)
    }
}

router.get('/:candidateId', async (req, res) => {
    let response = {}
    try{
        response = await convo(req.params.candidateId)
    } catch(error){
        console.log(error)
        res.status(500).json({"msg": "Server Error"})
    }
    if (req.query.size) {
        let decay = 1000
        while (response.length <= req.query.size || response.length === undefined) {
            if(decay>1500){
                break
            }
            try {
                await new Promise(r => setTimeout(r, decay));
                decay+=25
                response = await convo(req.params.candidateId)
            } catch (error) {
                console.log(error)
                res.status(500).json({ "msg": "Server Error" })
            }
        }
        res.status(200).json(response)
    } else {
        res.status(200).json(response)
    }
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
                    uid: req.body.uid,
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