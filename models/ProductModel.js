const { model, Schema, Types } = require('mongoose')

const ProductSchema = new Schema({
    archived: { type: Boolean, default: false },
    available: { type: Number, default: 0 },
    currency: { type: Types.ObjectId, ref: 'Currency' },
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    parent: { type: Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    uom: { type: Types.ObjectId, ref: 'UOM' },
    weight: { type: Number, default: 0 }
})

module.exports = model('Product', ProductSchema)