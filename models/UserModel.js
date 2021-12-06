const { model, Schema } = require('mongoose')

const UserSchema = new Schema({
    avatar: String,
    login: { type: String, required: true, unique: true },
    name: String,
    pass: { type: String, required: true }
})

module.exports = model('User', UserSchema)