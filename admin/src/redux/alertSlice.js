import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
    name: 'alertSlice',
    initialState: {
        text: '',
        show: false,
        vatiant: 'success'
    },
    reducers: {
        alertSliceHide: state => ({...state, text: '', show: false}),
        alertSliceSet: (state, {payload}) => ({...state, text: payload.text, show: true, variant: payload.variant})
    }
})

export const { alertSliceHide, alertSliceSet } = alertSlice.actions

export default alertSlice.reducer