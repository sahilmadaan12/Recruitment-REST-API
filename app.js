const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3000
const DB = "mongodb+srv://sahilmadaan12:T6MYNng9@cluster0.5rchi.gcp.mongodb.net/restapi_test?retryWrites=true&w=majority"

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .catch(error => console.log(error))

app.use(cors())
app.use(express.json())
app.get('/', (_req, res) => {
    res.send("Api at <br><br> /api/candidates <br> /api/vacancies <br> /api/conversation")
})

app.use('/api/candidates', require('./routes/api/candidates'))
app.use('/api/vacancies', require('./routes/api/vacancies'))
app.use('/api/conversation', require('./routes/api/conversation'))
app.use('/api/chats', require('./routes/api/chats'))
app.use('/api/screening', require('./routes/api/screening'))

app.listen(PORT, () => console.log(`Server Started on port ${PORT}`))
