const express = require('express')
const router = express.Router();

const Conversation = require('../../models/conversation')//the collection used by RASA Bot
const Chat = require('../../models/chat');//the collection used by the frontend

router.get('/:uid', (req, res) => {
    Chat.find({ "uid": req.params.uid }).exec().then(data => {
        if (data.length > 0) {
            if (req.query.timestamp) {
                const chats = data[0].chat.filter(msg => {
                    if (msg.createdAt > req.query.timestamp) {
                        return true
                    }
                })
                res.status(200).json(chats)
            } else {
                res.status(200).json(data[0].chat)
            }
        } else {
            res.status(200).json({})
        }
    }).catch(err => { res.status(500).json({ error: err.message }) })
})

router.post('/:uid', async (req, res) => {
    Chat.findOneAndUpdate({ "uid": req.params.uid }, { $push: { chat: req.body } }, {new: true}).exec()
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