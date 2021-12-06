const { model, Schema } = require('mongoose')

const FieldSchema = new Schema({
    name: { type: String, required: true, unique: true },
    type: { type: String, required: true }
})

module.exports = model('Field', FieldSchema)