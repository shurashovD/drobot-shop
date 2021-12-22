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

export const createCategory = createAsyncThunk(
    'categories/create',
    async (_, thunkAPI) => {
        try {
            const { authState, categoriesState } = thunkAPI.getState()
            const data = {
                name: categoriesState.addForm.name,
                parent: categoriesState.selectedCategory?._id
            }
            const response = await request('/api/categories/create', 'POST', data, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            console.log(e);
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

export const deleteCategory = createAsyncThunk(
    'categories/delete-category',
    async (_, thunkAPI) => {
        try {
            const { authState, categoriesState } = thunkAPI.getState()
            const response = await request(
                '/api/categories/delete', 'POST', { id: categoriesState.selectedCategory._id }, { Authorization: `Base ${authState.id}` }
            )
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw (e)
        }
    }
)

const initialState = {
    addForm: { name: '' },
    categories: { _id: '0' },
    form: { name: '', description: '', imgSrc: null },
    list: [],
    loading: false,
    modalShow: false,
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
        addFormNameHandler: (state, {payload}) => ({ ...state, addForm: { ...state.addForm, name: payload } }),
        categoryClickHandler: (state, {payload}) => {
            const selectedCategory = findInTree(state.categories, payload)
            const { name, description, imgSrc } = selectedCategory ?? {}
            return { ...state, selectedCategory, form: { name, description: description ?? '', imgSrc } }
        },
        hideModal: state => ({ ...state, showModal: false, addForm: initialState.addForm }),
        resetCategoriesState: () => initialState,
        setForm: (state, {payload}) => ({ ...state, form: { ...state.form, [payload.key]: payload.value } }),
        setPhoto: (state, {payload}) => ({ ...state, form: { ...state.form, imgSrc: payload ? URL.createObjectURL(payload) : null } }),
        showModal: state => ({ ...state, showModal: true }),
    },
    extraReducers: {
        [createCategory.pending]: state => ({ ...state, showModal: false, loading: true }),
        [createCategory.fulfilled]: (state, {payload}) => {
            return {
            ...state, loading: false, categories: { ...state.categories, entries: payload }, addForm: { ...state.addForm, name: '' }
        }},
        [createCategory.rejected]: state => ({ ...state, loading: false }),

        [deleteCategory.pending]: state => ({ ...state, loading: true }),
        [deleteCategory.fulfilled]: (state, {payload}) => {
            return {
            ...state, loading: false, categories: { ...state.categories, entries: payload }, addForm: { ...state.addForm, name: '' },
            selectedCategory: null, form: initialState.form
        }},
        [deleteCategory.rejected]: state => ({ ...state, loading: false }),

        [fetchCategories.pending]: state => ({ ...state, loading: true }),
        [fetchCategories.fulfilled]: (state, {payload}) => ({ ...state, loading: false, categories: { ...state.categories, entries: payload } }),
        [fetchCategories.rejected]: state => ({ ...state, loading: false }),

        [updateCategory.pending]: state => ({ ...state, loading: true }),
        [updateCategory.fulfilled]: (state, {payload}) => ({ ...state, loading: false, categories: { ...state.categories, entries: payload } }),
        [updateCategory.rejected]: state => ({ ...state, loading: false, categories: { _id: '0' } })
    }
})

export const { addFormNameHandler, categoryClickHandler, hideModal, resetCategoriesState, setCategories, setForm, setPhoto, showModal } = categorySlice.actions

export default categorySlice.reducer