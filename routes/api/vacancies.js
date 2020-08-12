const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

const Vacancy = require('../../models/vacancy')

//Get Vacancys
router.get('/', (req, res, next) => {
    Object.keys(req.query).forEach( key => {
        try{
            req.query[key]=JSON.parse(req.query[key])
        }catch(SyntaxError){}
    })
    Vacancy.find(req.query)
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

//Add a Vacancy
router.post('/', (req, res, next) => {
    const vacancy = new Vacancy(req.body)
    vacancy.save()
    .then( result => {
        res.status(201).json({
            createdVacancy: result
        })
    })
    .catch( err => {
        res.status(500).json({
            error: err.message
        })
    })
})

//get a Vacancy

router.get('/:vacancyId', (req, res, next) => {
    const id = req.params.vacancyId
    Vacancy.findById(id)
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

router.patch('/:vacancyId', (req, res) => {
    const id = req.params.vacancyId
    Vacancy.findByIdAndUpdate(id, req.body, { new: true }).exec()
        .then(result => {
            res.status(201).json({ updatedVacancy: result })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })
})

//delete a Vacancy

router.delete('/:vacancyId', (req, res, next) => {
    const id = req.params.vacancyId
    Vacancy.deleteOne({_id: id}).exec()
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