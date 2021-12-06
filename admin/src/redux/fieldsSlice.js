import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { request } from "../API/http.api"
import { alertSliceSet } from "./alertSlice"

export const getFields = createAsyncThunk(
    'fields/get-all',
    async (_, thunkAPI) => {
        try {
            const { authState } = thunkAPI.getState()
            const response = await request('/api/fields/get-all', 'GET', null, { Authorization: `Base ${authState.id}` })
            return response
        }
        catch (e) {
            const { dispatch } = thunkAPI
            dispatch(alertSliceSet({ variant: 'danger', text: e.message }))
            throw e
        }
    }
)

export const saveChanges = createAsyncThunk(
    'fields/save',
    async (_, thunkAPI) => {
        try {
            const { authState, fieldsState } = thunkAPI.getState()
            const { addedFields, removedFields } = fieldsState
            const response = await request('/api/fields/save', 'POST', { addedFields, removedFields }, { Authorization: `Base ${authState.id}` })
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
    fields: [],
    addForm: {
        name: '', type: 'number'
    },
    addedFields: [],
    removedFields: [],
    loading: false
}

const fieldsSlice = createSlice({
    name: 'fieldsSlice',
    initialState,
    reducers: {
        addFormHandler: (state, {payload}) => ({ ...state, addForm: { ...state.addForm, [payload.field]: payload.value } }),
        addField: state => ({
            ...state, addedFields: state.addedFields.concat({ ...state.addForm }),
            addForm: { name: '', type: 'number' }
        }),
        removeField: (state, {payload}) => ({ ...state, removedFields: state.removedFields.concat(payload) }),
        cancelRemove: (state, {payload}) => ({ ...state, removedFields: state.removedFields.filter(item => item.toString() !== payload.toString()) }),
        cancelAdd: (state, {payload}) => ({ ...state, addedFields: state.addedFields.filter((_, index) => index.toString() !== payload.toString()) })
    },
    extraReducers: {
        [getFields.pending]: state => ({ ...state, loading: true }),
        [getFields.fulfilled]: (state, {payload}) => ({ ...state, fields: payload, loading: false }),
        [getFields.rejected]: state => ({ ...state, loading: false }),

        [saveChanges.pending]: state => ({ ...state, loading: true }),
        [saveChanges.fulfilled]: (state, {payload}) => ({ ...state, fields: payload, loading: false, addedFields: [], removedFields: [] }),
        [saveChanges.rejected]: state => ({ ...state, loading: false })
    }
})

export const { addFormHandler, addField, removeField, cancelRemove, cancelAdd } = fieldsSlice.actions

export default fieldsSlice.reducer