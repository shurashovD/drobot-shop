const router = require('express').Router()
const md5 = require('md5')
const mongoose = require('mongoose')

const RightsModel = require('../models/RightsModel')
const UserModel = require('../models/UserModel')

router.get('/get-all', async (req, res) => {
    try {
        if ( !req.rights.users.view ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        const users = await UserModel.find({ login: { $ne: 'Administrator' } })
        return res.json(users)
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/create', async (req, res) => {
    try {
        if ( !req.rights.users.edit ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        const { name, login, pass } = req.body.form
        if ( name === '', login === '', pass == '' ) {
            return res.status(500).json({ message: 'Заполните все поля' })
        }

        const cursor = await UserModel.findOne({ login })
        if ( cursor ) {
            return res.status(500).json({ message: 'Логин занят' })
        }

        const createdUser = await UserModel({ name, login, pass: md5(pass) }).save()
        const rights = req.body.rights.reduce((res, {name, view, edit}) => ({ ...res, [name]: { view, edit } }), { user: createdUser._id })
        await RightsModel(rights).save()

        return res.json({ message: 'Пользователь создан' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update', async (req, res) => {
    try {
        if ( !req.rights.users.edit ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        const { id } = req.body
        const { name, login, pass } = req.body.form
        if ( name === '', login === '' ) {
            return res.status(500).json({ message: 'Заполните все поля' })
        }

        const cursor = await UserModel.findOne({ login, _id: {$ne: mongoose.Types.ObjectId(id)} })
        if ( cursor ) {
            return res.status(500).json({ message: 'Логин занят' })
        }

        const user = await UserModel.findById(id)
        if ( !user ) {
            return res.status(500).json({ message: 'Пользователь не найден' })
        }

        user.name = name
        user.login = login
        if ( pass && pass !== '' ) {
            user.pass = pass
        }
        await user.save()

        await RightsModel.findOneAndDelete({ user: mongoose.Types.ObjectId(id) })
        const rights = req.body.rights.reduce((res, {name, view, edit}) => ({ ...res, [name]: { view, edit } }), { user: mongoose.Types.ObjectId(id) })
        await RightsModel(rights).save()

        return res.json({ message: 'Пользователь обновлен' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/get-by-id', async (req, res) => {
    try {
        if ( !req.rights.users.view ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        const { id } = req.body

        const user = await UserModel.findById(id)
        const rights = await RightsModel.findOne({ user: mongoose.Types.ObjectId(id) })
        return res.json({ user, rights })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/remove', async (req, res) => {
    try {
        if ( !req.rights.users.edit ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        await UserModel.findByIdAndDelete(req.body.id)
        return res.json({ message: 'Пользователь удалён' })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router