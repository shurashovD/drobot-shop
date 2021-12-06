import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { alertSliceSet } from "../redux/alertSlice"
import { ALERT_VARIANT_ERROR, ALERT_VARIANT_SUCCESS } from "../redux/alertTypes"

export const useAlert = () => {
    const dispatch = useDispatch()

    const successAlert = useCallback(text => {
        dispatch(alertSliceSet({ text, variant: ALERT_VARIANT_SUCCESS }))
    }, [dispatch])

    const errorAlert = useCallback(text => {
        dispatch(alertSliceSet({ text, variant: ALERT_VARIANT_ERROR }))
    }, [dispatch])

    return { successAlert, errorAlert }
}