import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { authSliceLogin, authSliceLogout } from "../redux/authSlice"

export const useAuth = () => {
    const dispatch = useDispatch()

    const itemName = 'drobot-shop-admin'

    const login = useCallback(({_id, name, role}) => {
        dispatch(authSliceLogin({_id, name, role}))
        localStorage.setItem(itemName,  JSON.stringify({ _id, name, role }))
    }, [dispatch])

    const logout = useCallback(() => {
        dispatch(authSliceLogout())
        localStorage.removeItem(itemName)
    }, [dispatch])

    useEffect(() => {
        try {
            const { _id, name, role } = JSON.parse(localStorage.getItem(itemName))
            if ( _id ) {
                login({_id, name, role})
            }
        }
        catch {}
    }, [login])

    return { login, logout }
}