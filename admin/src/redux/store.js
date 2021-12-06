import { configureStore } from "@reduxjs/toolkit"
import alertSlice from "./alertSlice"
import authSlice from "./authSlice"
import categorySlice from "./categorySlice"
import fieldsSlice from "./fieldsSlice"
import goodsSlice from "./goodsSlice"

export default configureStore({
    middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ['categorySlice/setPhoto']
        }
    }),
    reducer: {
        authState: authSlice,
        alertState: alertSlice,
        categoriesState: categorySlice,
        fieldsState: fieldsSlice,
        goodsState: goodsSlice
    }
})