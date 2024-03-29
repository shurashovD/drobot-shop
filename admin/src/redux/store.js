import { configureStore } from "@reduxjs/toolkit"
import alertSlice from "./alertSlice"
import authSlice from "./authSlice"
import categorySlice from "./categorySlice"
import fieldsSlice from "./fieldsSlice"
import goodsSlice from "./goodsSlice"
import transferSlice from "./transferSlice"

export default configureStore({
    reducer: {
        authState: authSlice,
        alertState: alertSlice,
        categoriesState: categorySlice,
        fieldsState: fieldsSlice,
        goodsState: goodsSlice,
        transferState: transferSlice
    }
})