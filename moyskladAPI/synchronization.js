const fetch = require('node-fetch')
const config = require('config')
const moyskladCredentails = config.get('moysklad')
const Moysklad = require('moysklad')

const CategoryModel = require('../models/CategoryModel')
const CurrencyModel = require('../models/CurrencyModel')
const ProductModel = require('../models/ProductModel')
const UomModel = require('../models/UomModel')

const ms = Moysklad({ fetch, ...moyskladCredentails })

const paths = {
    assortiment: 'entity/assortment',
    currency: 'entity/currency',
    product: 'entity/product',
    productFolder: 'entity/productfolder',
    uom: 'entity/uom'
}

const currencySync = async () => {
    try {
        const currency = await ms.GET(paths.currency)
        for ( let i in currency.rows ) {
            const { id, name, fullName, isoCode } = currency.rows[i]
            await CurrencyModel({ identifier: id, name, fullName, isoCode }).save()
        }
    }
    catch (e) {
        console.log(e)
    }
}

const productSync = async () => {
    try {
        const goods = await ms.GET(paths.product)
        const normalize = goods.rows.map(({ id, archived, name, productFolder, salePrices, uom, weight }) => ({ 
            id, archived, name, price: salePrices[0].value, weight,
            parentId: productFolder?.meta.href.split('/').pop(),
            currency: salePrices[0].currency.meta.href.split('/').pop(),
            uom: uom?.meta.href.split('/').pop()
         }))

        const products = await ProductModel.find()
        const categories = await CategoryModel.find()
        const currencies = await CurrencyModel.find()
        const uoms = await UomModel.find()

        // удаление продуктов, не содержащихся в "Мой склад";
        const deletedIdentifier = products.map(({identifier}) => identifier).filter(item => normalize.every(({id}) => id !== item))
        await ProductModel.deleteMany({ identifier: { $in: deletedIdentifier } })

        // добавление продуктов, не содержащихся в БД;
        const addedRows = normalize.filter(({id}) => products.every(({identifier}) => identifier !== id))
        for (let i in addedRows) {
            const item = addedRows[i]
            const { archived, id, name, parentId, price, weight } = item
            const currency = currencies.find(({identifier}) => identifier === item.currency)
            const parent = categories.find(({identifier}) => identifier === parentId)?._id
            const uom = uoms.find(({identifier}) => identifier === item.uom)
            if ( parent ) {
                await ProductModel({
                    archived, currency, identifier: id, name, parent, price, uom, weight
                }).save()
            }
            else {
                await ProductModel({
                    archived, currency, identifier: id, name, price, uom, weight
                }).save()
            }
        }

        // обновление измененных продуктов;
        for (let i in normalize) {
            const item = normalize[i]
            const { archived, id, name, parentId, price, weight } = item
            const currency = currencies.find(({identifier}) => identifier === item.currency)
            const parent = categories.find(({identifier}) => identifier === parentId)?._id
            const uom = uoms.find(({identifier}) => identifier === item.uom)
            if ( parent ) {
                await ProductModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { archived, currency, name, parent, price, uom, weight }
                )
            }
            else {
                await ProductModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { archived, currency, name, price, uom, weight }
                )
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}

const productFolderSync = async () => {
    const getLevel = (arr, item, level = 0) => {
        if ( !item.parentId ) return level
        return getLevel(
            arr,
            arr.find(el => el.id === item.parentId),
            ++level
        )
    }
    try {
        const folders = await ms.GET(paths.productFolder)
        const rows = folders.rows.map(({ id, archived, name, productFolder }) => ({ id, archived, name, parentId: productFolder?.meta.href.split('/').pop() }))
        const sortRows = rows.sort((a, b) => getLevel(rows, b) - getLevel(rows, a))
        
        const categories = await CategoryModel.find()

        // удаление категорий, не содержащихся в "Мой склад";
        const deletedIdentifier = categories.map(({ identifier }) => identifier).filter(item => sortRows.every(({ id }) => id !== item))
        await CategoryModel.deleteMany({ identifier: { $in: deletedIdentifier } })

        // добавление категорий, не содержащихся в БД;
        const identifierInDB = categories.map(({identifier}) => identifier)
        const addedRows = sortRows.filter(({id}) => identifierInDB.every(item => item !== id))
        for ( let i in addedRows ) {
            const { id, archived, name, parentId } = addedRows[i]
            const parent = await CategoryModel.findOne({ identifier: { $eq: parentId } })
            if ( parent ) {
                await CategoryModel({ identifier: id, archived, name, parent: parent._id }).save()
            }
            else {
                await CategoryModel({ identifier: id, archived, name }).save()
            }
        }

        // обновление данных из "Мой склад";
        for ( let i in sortRows ) {
            const { id, archived, name, parentId } = sortRows[i]
            const parent = await CategoryModel.findOne({ identifier: { $eq: parentId } })
            if ( parent ) {
                await CategoryModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { archived, name, parent: parent._id }
                )
            }
            else {
                await CategoryModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { archived, name }
                )
                await CategoryModel.findOneAndUpdate(
                    { identifier: { $eq: id } },
                    { $unset: { parent: true } }
                )
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}

const uomSync = async () => {
    try {
        const uom = await ms.GET(paths.uom)
        for ( let i in uom.rows ) {
            const { id, name, description } = uom.rows[i]
            await UomModel({ identifier: id, name, description }).save()
        }
    }
    catch (e) {
        console.log(e)
    }
}

module.exports = { currencySync, productSync, productFolderSync, uomSync }