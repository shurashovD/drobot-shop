const { model, Schema } = require('mongoose')

const CurrencySchema = new Schema({
    identifier: { type: String, required: true },
    name: { type: String, required: true },
    fullName: { type: String, required: true },
    isoCode: { type: String, required: true }
})

module.exports = model('Currency', CurrencySchema)