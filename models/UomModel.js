const { model, Schema } = require('mongoose')

const UomSchema = new Schema({
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' }
})

module.exports = model('UOM', UomSchema)