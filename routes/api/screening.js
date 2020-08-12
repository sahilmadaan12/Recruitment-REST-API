const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const Screening = require('../../models/screening')

//Get Screenings
router.get('/', (req, res, next) => {
    Object.keys(req.query).forEach( key => {
        try{
            req.query[key]=JSON.parse(req.query[key])
        }catch(SyntaxError){}
    })
    Screening.find(req.query)
    .select('-__v')
    .exec()
    .then( data => {
        res.status(200).json(data)
    })
    .catch( err => {
        res.status(500).json({
            error: err.message
        })
    })
})

//Add a Screening
router.post('/', (req, res, next) => {
    const screening = new Screening(req.body)
    screening.save()
    .then( result => {
        res.status(201).json({
            createdScreening: result
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err.message
        })
    })
})

//get a Screening

router.get('/:ScreeningId', (req, res, next) => {
    const id = req.params.ScreeningId
    Screening.findById(id)
    .select('-__v')
    .exec()
    .then( data => {
        if (data){
            res.status(200).json(data)
        } else {
            res.status(404).json({
                'Message' : id + ' Not Found'
            })
        }
    })
    .catch(err => {
        res.status(500).json({
            error: 'Malformed Request'
        })
    })
})

router.patch('/:ScreeningId', (req, res) => {
    const id = req.params.ScreeningId
    Screening.findByIdAndUpdate(id, req.body, { new: true }).exec()
        .then(result => {
            res.status(201).json({ updatedScreening: result })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

//delete a Screening

router.delete('/:ScreeningId', (req, res, next) => {
    const id = req.params.ScreeningId
    Screening.deleteOne({_id: id}).exec()
    .then( result => {
        res.status(200).json(result)
    })
    .catch( err => {
        res.status(500).json({
            error: err
        })
    })
})

module.exports = router