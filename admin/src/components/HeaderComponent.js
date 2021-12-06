import React from "react"
import { Button, Navbar } from "react-bootstrap"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"
import { useAuth } from "../hooks/auth.hook"

export const HeaderComponent = () => {
    const { id, name } = useSelector(state => state.authState)
    const { logout } = useAuth()
    
    if ( !id ) {
        return null
    }

    return (
        <Navbar bg="light" expand="lg" className="px-1">
            <span className="text-secondary me-3">{name}</span>
            <NavLink to="/admin/main" className="mx-3">Главная</NavLink>
            <Button variant="link" className="ms-auto" onClick={logout}>Выход</Button>
        </Navbar>
    )
}