import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { request, sendFormData } from "../API/http.api"
import { alertSliceSet } from "./alertSlice"
import { CARD_PRIMARY, CARD_SECONDARY, CARD_SUCCESS } from './types'

export const getGoods = createAsyncThunk(
    'goods/get-all',
    async (_, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request('/api/goods/get-all', 'GET', null, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

export const updateGood = createAsyncThunk(
    'goods/update-good',
    async (_, thunkAPI) => {
        try {
            const { authState, goodsState } = thunkAPI.getState()
            const data = {
                id: goodsState.selectedProduct._id,
                deleted: JSON.stringify(goodsState.deletedPhotos),
                description: goodsState.form.description,
                photos: JSON.stringify(goodsState.photos)
            }
            const files = []
            for (let i in goodsState.addedPhotos) {
                files.push({
                    img: await fetch(goodsState.addedPhotos[i]).then(async res => {
                        const blob = await res.blob()
                        const file = new File([blob], goodsState.addedPhotos[i], { type: blob.type })
                        return file
                    })
                })
            }
            const response = await sendFormData('/api/goods/update', data, files, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw (e)
        }
    }
)

export const moySkladSync = createAsyncThunk(
    'goods/sync',
    async (_, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request('/api/goods/moy-sklad-sync', 'POST', null, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

export const rmPhoto = createAsyncThunk(
    '/goods/removePhoto',
    async payload => {
        await new Promise(resolve => setTimeout(resolve, 400))
        return payload
    }
)

export const rcPhoto = createAsyncThunk(
    '/goods/recoverPhoto',
    async payload => {
        await new Promise(resolve => setTimeout(resolve, 400))
        return payload
    }
)

const findInTree = (obj, id) => {
    if ( obj._id?.toString() === id?.toString() ) return obj
    for ( let i in obj.entries ) {
        const candidate = findInTree(obj.entries[i], id)
        if ( candidate ) return candidate
    }
    return null
}

const initialState = {
    activeTab: 'wrap',
    addedPhotos: [],
    deletedPhotos: [],
    form: { name: '', description: '' },
    goods: { _id: '0' },
    loadedPhotos: [],
    loading: false,
    photos: [],
    selectedProduct: null,
}

const goodsSlice = createSlice({
    name: 'goodsSlice',
    initialState,
    reducers: {
        addPhotos: (state, {payload}) => {
            const photos = payload.map(src => ({ variant: CARD_SUCCESS, src, added: true }))
            return {
                ...state, addedPhotos: state.addedPhotos.concat(payload),
                photos: state.photos.concat(photos)
            }
        },
        moveImg: (state, {payload}) => {
            const { hoverIndex, moveIndex } = payload
            const photos = state.photos.map(item => item)
            const moveImg = photos.splice(moveIndex, 1)
            photos.splice(hoverIndex, 0, moveImg[0])
            return { ...state, photos }
        },
        productClickHandler: (state, {payload}) => {
            const selectedProduct = findInTree(state.goods, payload)
            const { name, description, images, isGood } = selectedProduct
            return isGood
            ? {
                ...state, selectedProduct,
                form: { ...state.form, name, description: description ?? '' },
                loadedPhotos: images,
                photos: images.map(src => ({ variant: CARD_PRIMARY, src })),
                deletedPhotos: [],
                activeTab: initialState.activeTab
            }
            : { ...state, selectedProduct: null, form: initialState.form, loadedPhotos: [], photos: [], activeTab: initialState.activeTab }
        },
        setForm: (state, {payload}) => ({ ...state, form: { ...state.form, [payload.name]: payload.value } }),
        tabChange: (state, {payload}) => ({ ...state, activeTab: payload }),
        resetGoods: () => initialState
    },
    extraReducers: {
        [getGoods.pending]: state => ({ ...state, loading: true }),
        [getGoods.fulfilled]: (state, {payload}) => ({ ...state, goods: { ...state.goods, entries: payload }, loading: false }),
        [getGoods.rejected]: state => ({ ...state, loading: false }),

        [moySkladSync.pending]: state => ({ ...state, loading: true }),
        [moySkladSync.fulfilled]: (state, {payload}) => ({ ...state, goods: { ...state.goods, entries: payload }, loading: false }),
        [moySkladSync.rejected]: state => ({ ...state, loading: false }),

        [rcPhoto.pending]: (state, {meta}) => ({
            ...state,
            photos: state.photos.map((item, index) => index === parseInt(meta.arg.idx) ? { ...item, classList: 'opacity-decrease' } : item)
        }),
        [rcPhoto.fulfilled]: (state, {payload}) => ({
            ...state, deletedPhotos: state.deletedPhotos.filter(item => item !== state.photos[payload].src),
            photos: state.photos.map((item, index) => parseInt(payload) === index ? { ...item, variant: CARD_PRIMARY, classList: null } : item)
        }),

        [rmPhoto.pending]: (state, {meta}) => ({
            ...state,
            photos: state.photos.map((item, index) => index === parseInt(meta.arg.idx) ? { ...item, classList: 'opacity-decrease' } : item)
        }),
        [rmPhoto.fulfilled]: (state, {payload}) => {
            const { idx, loaded } = payload
            return loaded === 'true' 
            ? {
                ...state, deletedPhotos: state.deletedPhotos.concat([state.photos[parseInt(idx)].src]),
                photos: state.photos.map((item, index) => parseInt(idx) === index ? { ...item, variant: CARD_SECONDARY, classList: null } : item)
            }
            : {
                ...state, addedPhotos: state.addedPhotos.filter(item => item !== state.photos[parseInt(idx)].src),
                photos: state.photos.filter((_, index) => parseInt(idx) !== index)
            }
        },

        [updateGood.pending]: state => ({ ...state, loading: true }),
        [updateGood.fulfilled]: (state, {payload}) => {
            const { _id } = state.selectedProduct
            const selectedProduct = findInTree({ ...initialState.goods, entries: payload }, _id.toString())
            const { name, description, images } = selectedProduct
            return {
                ...state, selectedProduct,
                goods: { ...initialState.goods, entries: payload },
                form: { ...state.form, name, description: description ?? '' },
                loadedPhotos: images,
                photos: images.map(src => ({ variant: CARD_PRIMARY, src })),
                deletedPhotos: [],
                loading: false
            }
        },
        [updateGood.rejected]: state => ({ ...state, loading: false }),
    }
})

export const { addPhotos, moveImg, productClickHandler, resetGoods, setForm, setPhotoState, tabChange } = goodsSlice.actions

export default goodsSlice.reducer