import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { request } from "../API/http.api"
import { alertSliceSet } from "./alertSlice"

export const getCategory = createAsyncThunk(
    '/transfer/getCategory',
    async (payload, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request(
                '/api/categories/category-by-id',
                'POST', payload ? { id: payload } : null, { Authorization: `Base ${authState.id}` }
            )
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
        
    }
)

export const getParentCategory = createAsyncThunk(
    '/transfer/getParentCategory',
    async (payload, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request(
                '/api/categories/parent-category',
                'POST', { id: payload }, { Authorization: `Base ${authState.id}` }
            )
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
        
    }
)

export const getCatalog = createAsyncThunk(
    '/transfer/getCatalog',
    async (payload, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request(
                '/api/categories/catalog-by-id',
                'POST', payload ? { id: payload } : null, { Authorization: `Base ${authState.id}` }
            )
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
        
    }
)

export const getParentCatalog = createAsyncThunk(
    '/transfer/getParentCatalog',
    async (payload, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request(
                '/api/categories/parent-catalog',
                'POST', { id: payload }, { Authorization: `Base ${authState.id}` }
            )
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

export const transfer = createAsyncThunk(
    '/transfer/update',
    async (_, thunkAPI) => {
        try {
            const { authState, transferState } = thunkAPI.getState()
            const data = { products: JSON.stringify(transferState.categoryChecked), categoryId: transferState.selectedCatalog }
            const response = await request('/api/categories/transfer', 'POST', data, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

export const unTransfer = createAsyncThunk(
    '/transfer/update',
    async (_, thunkAPI) => {
        try {
            const { authState, transferState } = thunkAPI.getState()
            const data = { products: JSON.stringify(transferState.catalogChecked), categoryId: transferState.selectedCatalog }
            const response = await request('/api/categories/transfer-cancel', 'POST', data, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            console.log(e)
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

const initialState = {
    catalog: [],
    category: [],
    categoryFilter: [],
    catalogChecked: [],
    categoryChecked: [],
    catalogLoading: false,
    categoryLoading: false,
    selectedCatalog: null,
    selectedCategory: null,
}

const transferSlice = createSlice({
    name: 'transferSlice',
    initialState,
    reducers: {
        catalogCheck: (state, {payload}) => {
            const catalogChecked = state.catalogChecked.map(item => item)
            const index = catalogChecked.findIndex(item => item === payload)
            if ( index === -1 ) catalogChecked.push(payload)
            else catalogChecked.splice(index, 1)
            return ({ ...state, catalogChecked })
        },
        categoryCheck: (state, {payload}) => {
            const categoryChecked = state.categoryChecked.map(item => item)
            const index = categoryChecked.findIndex(item => item === payload)
            if ( index === -1 ) categoryChecked.push(payload)
            else categoryChecked.splice(index, 1)
            return ({ ...state, categoryChecked })
        },
        reset: () => initialState,
        selectCatalog: (state, {payload}) => ({ ...state, selectedCatalog: payload, catalogChecked: initialState.catalogChecked }),
        selectCategory: (state, {payload}) => ({ ...state, selectedCategory: payload, categoryChecked: initialState.categoryChecked }),
    },
    extraReducers: {
        [getCatalog.pending]: state => ({ ...state, catalogLoading: true }),
        [getCatalog.fulfilled]: (state, {payload}) => ({
            ...state, catalog: payload, catalogLoading: false,
            categoryFilter: state.category.filter(({_id}) => payload.every(item => item._id.toString() !== _id.toString()))
        }),
        [getCatalog.rejected]: state => ({ ...state, catalogLoading: false }),

        [getCategory.pending]: state => ({ ...state, categoryLoading: true }),
        [getCategory.fulfilled]: (state, {payload}) => ({
            ...state, category: payload, categoryLoading: false,
            categoryFilter: payload.filter(({_id}) => state.catalog.every(item => item._id.toString() !== _id.toString()))
        }),
        [getCategory.rejected]: state => ({ ...state, categoryLoading: false }),

        [getParentCatalog.pending]: state => ({ ...state, catalogLoading: true }),
        [getParentCatalog.fulfilled]: (state, {payload}) => ({
            ...state, catalog: payload, catalogLoading: false,
            selectedCatalog: payload[0]?.parent,
            categoryFilter: state.category.filter(({_id}) => payload.every(item => item._id.toString() !== _id.toString()))
        }),
        [getParentCatalog.rejected]: state => ({ ...state, catalogLoading: false }),
        
        [getParentCategory.pending]: state => ({ ...state, categoryLoading: true }),
        [getParentCategory.fulfilled]: (state, {payload}) => ({
            ...state, category: payload, categoryLoading: false,
            selectedCategory: payload[0]?.parent,
            categoryFilter: payload.filter(({_id}) => state.catalog.every(item => item._id.toString() !== _id.toString()))
        }),
        [getParentCategory.rejected]: state => ({ ...state, categoryLoading: false }),

        [transfer.pending]: state => ({ ...state, catalogLoading: true }),
        [transfer.fulfilled]: (state, {payload}) => ({
            ...state, catalog: payload, catalogLoading: false, categoryChecked: [],
            categoryFilter: state.category.filter(({_id}) => payload.every(item => item._id.toString() !== _id.toString()))
        }),
        [transfer.rejected]: state => ({ ...state, catalogLoading: false }),

        [unTransfer.pending]: state => ({ ...state, catalogLoading: true }),
        [unTransfer.fulfilled]: (state, {payload}) => ({
            ...state, catalog: payload, catalogLoading: false, catalogChecked: [],
            categoryFilter: state.category.filter(({_id}) => payload.every(item => item._id.toString() !== _id.toString()))
        }),
        [unTransfer.rejected]: state => ({ ...state, catalogLoading: false }),
    }
})

export const { catalogCheck, categoryCheck, reset, selectCatalog, selectCategory } = transferSlice.actions

export default transferSlice.reducer