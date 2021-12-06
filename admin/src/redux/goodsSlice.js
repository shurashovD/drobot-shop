import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { request } from "../API/http.api"
import { alertSliceSet } from "./alertSlice"

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

const findInTree = (obj, id) => {
    if ( obj._id?.toString() === id?.toString() ) return obj
    for ( let i in obj.entries ) {
        const candidate = findInTree(obj.entries[i])
        if ( candidate ) return candidate
    }
    return null
}

const initialState = {
    form: { name: '', description: '', imgSrc: null },
    loading: false,
    goods: { _id: '0' }
}

const goodsSlice = createSlice({
    name: 'goodsSlice',
    initialState,
    selectedProduct: null,
    reducers: {
        productClickHandler: (state, {payload}) => ({ ...state, selectedProduct: findInTree(state.goods, payload) }),
        rmPhoto: state => ({ ...state, form: { ...state.form, imgSrc: null } }),
        setForm: (state, {payload}) => ({ ...state, form: { ...state.form, [payload.name]: payload.value } }),
        resetGoods: () => initialState
    },
    extraReducers: {
        [getGoods.pending]: state => ({ ...state, loading: true }),
        [getGoods.fulfilled]: (state, {payload}) => ({ ...state, goods: { ...state.goods, entries: payload }, loading: false }),
        [getGoods.rejected]: state => ({ ...state, loading: false })
    }
})

export const { productClickHandler, resetGoods, rmPhoto, setForm } = goodsSlice.actions

export default goodsSlice.reducer