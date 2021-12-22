const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose')
const { access, mkdir, readdir, rm, rmdir } = require('fs/promises')
const LTT = require('list-to-tree')
const multer = require('multer')

const CatalogModel = require('../models/CatalogModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')

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

const buildTree = list => {
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
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const list = await CatalogModel.find()
        const tree = buildTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/create', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { name, parent } = req.body
        if (parent) {
            await CatalogModel({ name, parent }).save()
        }
        else {
            await CatalogModel({ name }).save()
        }
        
        const list = await CatalogModel.find()
        const tree = buildTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        if (11000 === e.code || 11001 === e.code) {
            return res.status(500).json({ message: 'Раздел с таким именем уже существует' })
        }
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/delete', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { id } = req.body
        const catalog = await CatalogModel.findById(mongoose.Types.ObjectId(id))
        if ( catalog.products.length > 0 ) {
            return res.status(500).json({ message: 'Нельзя удалить каталог, содержащий продукты' })
        }

        const children = await CatalogModel.findOne({ parent: catalog._id })
        if ( children ) {
            return res.status(500).json({ message: 'Нельзя удалить каталог, содержащий каталоги' })
        }

        await CatalogModel.findByIdAndDelete(mongoose.Types.ObjectId(id))

        const dirPath = path.join(__dirname, '..', 'static', 'covers', req.body.id)
        try {
            await access(dirPath, fs.constants.W_OK)
            const ls = await readdir(dirPath)
            for ( const file of ls ) {
                await rm(path.join(dirPath, file))
            }
            await rmdir(dirPath)
        }
        catch {}

        const list = await CatalogModel.find()
        const tree = buildTree(list)
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
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { id, description } = req.body
        const { fileName } = req
        const imgSrc = `/covers/${id}/${fileName}`

        if ( fileName ) {
            await CatalogModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { description, imgSrc })
        }
        else {
            await CatalogModel.findByIdAndUpdate(mongoose.Types.ObjectId(id), { description, $unset: { imgSrc: true } })
            const dirPath = path.join(__dirname, '..', 'static', 'covers', req.body.id)
            try {
                await access(dirPath, fs.constants.W_OK)
                const ls = await readdir(dirPath)
                for ( const file of ls ) {
                    await rm(path.join(dirPath, file))
                }
            }
            catch {}
        }
        const list = await CatalogModel.find()
        const tree = buildTree(list)
        return res.json(tree ?? [])
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/transfer', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { categoryId, products } = req.body
        const catalog = await CatalogModel.findById(categoryId)
        catalog.products = catalog.products.concat(JSON.parse(products))
        await catalog.save()

        const cataloges = categoryId
            ? await CatalogModel.find({ parent: mongoose.Types.ObjectId(categoryId) })
            : await CatalogModel.find({ parent: { $exists: false } })
        const entries = await ProductModel.find({ _id: { $in: catalog?.products?.map(id => mongoose.Types.ObjectId(id)) ?? [] } })
        return res.json(cataloges.concat(entries))
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/transfer-cancel', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { categoryId, products } = req.body
        const catalog = await CatalogModel.findById(categoryId)
        const productsArr = JSON.parse(products)
        catalog.products = catalog.products.filter(id => productsArr.every(item => item.toString() !== id.toString()))
        await catalog.save()

        const cataloges = categoryId
            ? await CatalogModel.find({ parent: mongoose.Types.ObjectId(categoryId) })
            : await CatalogModel.find({ parent: { $exists: false } })
        const entries = await ProductModel.find({ _id: { $in: catalog?.products?.map(id => mongoose.Types.ObjectId(id)) ?? [] } })
        return res.json(cataloges.concat(entries))
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/category-by-id', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { id } = req.body
        const categories = id
            ? await CategoryModel.find({ parent: mongoose.Types.ObjectId(id) })
            : await CategoryModel.find({ parent: { $exists: false } })
        const products = await ProductModel.find({ parent: mongoose.Types.ObjectId(id) })
        return res.json(categories.concat(products))
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/catalog-by-id', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { id } = req.body
        const catalog = await CatalogModel.findById(id)
        const cataloges = id
            ? await CatalogModel.find({ parent: mongoose.Types.ObjectId(id) })
            : await CatalogModel.find({ parent: { $exists: false } })
        const products = await ProductModel.find({ _id: { $in: catalog?.products?.map(id => mongoose.Types.ObjectId(id)) ?? [] } })
        return res.json(cataloges.concat(products))
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/parent-category', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { id } = req.body
        const category = await CategoryModel.findById(id)
        const categories = category?.parent
            ? await CategoryModel.find({ parent: mongoose.Types.ObjectId(category.parent) })
            : await CategoryModel.find({ parent: { $exists: false } })
        const products = await ProductModel.find({ parent: mongoose.Types.ObjectId(category.parent) })
        return res.json(categories.concat(products))
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

router.post('/parent-catalog', async (req, res) => {
    try {
        if ( !req.rights.categories.edit ) {
            return res.status(403).json({ message: 'Недостаточно прав...' })
        }

        const { id } = req.body
        const catalog = await CatalogModel.findById(id)
        const cataloges = catalog?.parent
            ? await CatalogModel.find({ parent: mongoose.Types.ObjectId(catalog.parent) })
            : await CatalogModel.find({ parent: { $exists: false } })
        const products = await ProductModel.find({ parent: mongoose.Types.ObjectId(catalog.parent) })
        return res.json(cataloges.concat(products))
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({ message: 'Что-то пошло не так...' })
    }
})

module.exports = router