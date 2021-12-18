const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const { access, mkdir, readdir, rm } = require('fs/promises')
const LTT = require('list-to-tree')
const multer = require('multer')

const CategoryModel = require('../models/CategoryModel')
const { productFolderSync } = require('../moyskladAPI/synchronization')

const coverStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dirPath = path.join(__dirname, '..', 'static', 'covers', req.body.id)
        try {
            await access(dirPath, fs.constants.W_OK)
            const ls = await readdir(dirPath)
            for ( const file of ls ) {
                await rm(path.join(dirPath, file))
            }
        }
        catch {
            await mkdir(dirPath)
        }
        cb(null, dirPath)
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}.${file.mimetype.split('/')[1]}`
        req.fileName = fileName
        cb(null, fileName)
    }
})

const coverUpload = multer({ storage: coverStorage })

const getCategoriesByTree = list => {
    const normalize = list.map((item, index) => ({
        ...item.toObject(), key_id: index
    })).map((item, _, arr) => ({ ...item, key_parent: arr.find(({_id}) => _id.toString() === item.parent?.toString())?.key_id ?? 0 }))

    return new LTT(normalize, {
        key_id: "key_id",
        key_parent: "key_parent",
        key_child: "entries"
    }).GetTree()
}

router.get('/get-all', async (req, res) => {
    try {
        if ( !req.rights.categories.view ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        const list = await CategoryModel.find()
        const tree = getCategoriesByTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update', coverUpload.single('cover'), async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        const { id, description } = req.body
        const { fileName } = req
        const imgSrc = `/covers/${id}/${fileName}`

        if ( fileName ) {
            await CategoryModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { description, imgSrc })
        }
        else {
            await CategoryModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { description, $unset: { imgSrc: true } })
            const dirPath = path.join(__dirname, '..', 'static', 'covers', req.body.id)
            await access(dirPath, fs.constants.W_OK)
            const ls = await readdir(dirPath)
            for ( const file of ls ) {
                await rm(path.join(dirPath, file))
            }
        }
        const list = await CategoryModel.find()
        const tree = getCategoriesByTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
    
})

router.post('/moy-sklad-sync', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Не достаточно прав...' })
        }

        await productFolderSync()
        const list = await CategoryModel.find()
        const tree = getCategoriesByTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router