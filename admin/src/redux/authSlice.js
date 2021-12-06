import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'authSlice',
    initialState: {
        id: null,
        name: ''
    },
    reducers: {
        authSliceLogin: (state, {payload}) => ({...state, id: payload._id, name: payload.name}),
        authSliceLogout: state => ({...state, id: null})
    }
})

export const { authSliceLogin, authSliceLogout } = authSlice.actions

export default authSlice.reducer