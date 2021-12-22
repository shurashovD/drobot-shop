const { model, Schema, Types } = require('mongoose')

const CatalogSchema = new Schema({
    description: { type: String, default: '' },
    imgSrc: String,
    name: { type: String, required: true, unique: true },
    parent: { type: Types.ObjectId, ref: 'Catalog' },
    products: { type: Array, of: Types.ObjectId, ref: 'Product', default: [] }
})

module.exports = model('Catalog', CatalogSchema)