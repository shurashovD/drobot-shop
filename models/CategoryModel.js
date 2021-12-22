const { model, Schema, Types } = require('mongoose')

const CategorySchema = new Schema({
    archived: { type: Boolean, default: false },
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    parent: { type: Types.ObjectId, ref: 'Category' }
})

module.exports = model('Category', CategorySchema)