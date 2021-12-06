import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { request, sendFormData } from '../API/http.api'
import { alertSliceSet } from './alertSlice'

export const fetchCategories = createAsyncThunk(
    'categories/get-all',
    async (_, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request('/api/categories/get-all', 'GET', null, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw (e)
        }
    }
)

export const updateCategory = createAsyncThunk(
    'categories/update-category',
    async (_, thunkAPI) => {
        try {
            const { authState, categoriesState } = thunkAPI.getState()
            const data = {
                id: categoriesState.selectedCategory._id,
                description: categoriesState.form.description
            }
            const cover = categoriesState.form.imgSrc && await fetch(categoriesState.form.imgSrc).then(res => res.blob())
            const response = await sendFormData('/api/categories/update', data, [{ cover }], { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw (e)
        }
    }
)

export const moySkladSync = createAsyncThunk(
    'categories/sync',
    async (_, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request('/api/categories/moy-sklad-sync', 'POST', null, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

const initialState = {
    categories: { _id: '0' },
    form: { name: '', description: '', imgSrc: null },
    list: [],
    loading: false,
    photo: null,
    selectedCategory: null
}

const findInTree = (obj, id) => {
    if ( obj._id === id ) return obj
    for ( let i in obj.entries ) {
        const candidate = findInTree(obj.entries[i], id)
        if ( candidate ) return candidate
    }
    return null
}

const categorySlice = createSlice({
    name: 'categorySlice',
    initialState,
    reducers: {
        categoryClickHandler: (state, {payload}) => {
            const selectedCategory = findInTree(state.categories, payload)
            const { name, description, imgSrc } = selectedCategory ?? {}
            return { ...state, selectedCategory, form: { name, description: description ?? '', imgSrc } }
        },
        resetCategoriesState: () => initialState,
        setForm: (state, {payload}) => ({ ...state, form: { ...state.form, [payload.key]: payload.value } }),
        setPhoto: (state, {payload}) => ({ ...state, form: { ...state.form, imgSrc: payload ? URL.createObjectURL(payload) : null } })
    },
    extraReducers: {
        [fetchCategories.pending]: state => ({ ...state, loading: true }),
        [fetchCategories.fulfilled]: (state, {payload}) => ({ ...state, loading: false, categories: { ...state.categories, entries: payload } }),
        [fetchCategories.rejected]: state => ({ ...state, loading: false }),

        [updateCategory.pending]: state => ({ ...state, loading: true }),
        [updateCategory.fulfilled]: (state, {payload}) => ({ ...state, loading: false, categories: { ...state.categories, entries: payload } }),
        [updateCategory.rejected]: state => ({ ...state, loading: false, categories: { _id: '0' } }),

        [moySkladSync.pending]: state => ({ ...state, loading: true }),
        [moySkladSync.fulfilled]: (state, {payload}) => ({ ...state, loading: false, categories: { ...state.categories, entries: payload } }),
        [moySkladSync.rejected]: state => ({ ...state, loading: false })
    }
})

export const { categoryClickHandler, resetCategoriesState, setCategories, setForm, setPhoto } = categorySlice.actions

export default categorySlice.reducer