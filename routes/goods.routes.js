const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const LTT = require('list-to-tree')

const router = require('express').Router()

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

module.exports = router