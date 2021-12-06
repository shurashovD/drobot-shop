const mongoose = require('mongoose')

const RightsModel = require('../models/RightsModel')

const authMiddleware = async (req, res, next) => {
    try {
        const [authType, authId] = req.headers.authorization?.split(' ') ?? []

        if ( authType !== 'Base' ) {
            return res.status(500).json({ message: 'Ошибка авторизации' })
        }

        const rights = await RightsModel.findOne({ user: mongoose.Types.ObjectId(authId) })
        if ( !rights ) {
            return res.status(500).json({ message: 'Ошибка авторизации' })
        }

        req.rights = rights
        next()
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Ошибка авторизации' })
    }
}

module.exports = authMiddleware