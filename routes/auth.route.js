const router = require('express').Router()
const bodyParser = require('body-parser')
const md5 = require('md5')

const UserModel = require('../models/UserModel')

router.post('/login', bodyParser.json(), async (req, res) => {
    try {
        const { login, pass } = req.body
        
        const candidate = await UserModel.findOne({ login, pass: md5(pass) })

        if ( candidate ) {
            return res.json(candidate)
        }

        return res.status(500).json({ message: 'Неверная пара логин/пароль' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router