const { model, Schema, Types } = require('mongoose')

const CategorySchema = new Schema({
    archived: { type: Boolean, default: false },
    description: String,
    identifier: { type: String, required: true },
    imgSrc: String,
    name: { type: String, required: true },
    parent: { type: Types.ObjectId, ref: 'Category' }
})

module.exports = model('Category', CategorySchema)