const router = require('express').Router()
const mongoose = require('mongoose')

const FieldModel = require('../models/FieldModel')

router.get('/get-all', async (req, res) => {
    try {
        const fields = await FieldModel.find()
        return res.json(fields)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/save', async (req, res) => {
    try {
        const { addedFields, removedFields } = req.body

        const removedIds = removedFields.map(item => mongoose.Types.ObjectId(item))
        await FieldModel.deleteMany({ _id: { $in: removedIds } })

        await FieldModel.insertMany(addedFields)
        
        const fields = await FieldModel.find()
        return res.json(fields)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router