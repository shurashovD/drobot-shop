const { model, Schema, Types } = require('mongoose')

const RightsSchema = new Schema({
    catalogs: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
    },
    categories: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
    },
    goods: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
    },
    user: { type: Types.ObjectId, ref: 'Users', required: true, unique: true },
    users: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
    }
})

module.exports = model('Rights', RightsSchema)