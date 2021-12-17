const router = require('express').Router()
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const { access, mkdir, readdir, rm } = require('fs/promises')
const LTT = require('list-to-tree')
const multer = require('multer')

const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')

const { productSync, productFolderSync } = require('../moyskladAPI/synchronization')

const imagesStorage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dirPath = path.join(__dirname, '..', 'static', 'productImages', req.body.id)
        try {
            await access(dirPath, fs.constants.W_OK)
        }
        catch {
            await mkdir(dirPath)
        }
        cb(null, dirPath)
    },
    filename: async (req, file, cb) => {
        await new Promise(resolve => setTimeout(resolve, 1))
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
})

const imgLoader = multer({ storage: imagesStorage }).fields([{ name: 'img', maxCount: 10 }])

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
        const categories = await CategoryModel.find()
        const products = await ProductModel.find()
        const list = categories.concat(products)
        const tree = getCategoriesByTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/update', imgLoader, async (req, res) => {
    try {
        const { deleted, description, id, photos } = req.body
        const dirPath = `/static/productImages/${req.body.id}/`
        const deletedPhotos = JSON.parse(deleted)
        const images = JSON.parse(photos).filter(({src}) => deletedPhotos.every(item => src !== item)).map(({added, src}) => {
            return added
                ? dirPath + req.files.img.find(({originalname}) => originalname.toString() === path.basename(src)).filename
                : src
        })
        await ProductModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { description, images })

        for ( const i in deletedPhotos ) {
            const fileName = path.basename(deletedPhotos[i])
            try {
                await rm(path.join(__dirname, '..', 'static', 'productImages', req.body.id, fileName))
            }
            catch (e) {}
        }

        const categories = await CategoryModel.find()
        const products = await ProductModel.find()
        const list = categories.concat(products)
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
        await productFolderSync()
        await productSync()
        const categories = await CategoryModel.find()
        const products = await ProductModel.find()
        const list = categories.concat(products)
        const tree = getCategoriesByTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router