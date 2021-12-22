import React from "react"
import { Switch, Route, Redirect } from 'react-router-dom'
import { LoginPage } from "./pages/LoginPage"
import { useSelector } from 'react-redux'
import { UsersPage } from "./pages/users/UsersPage"
import { CategoriesPage } from "./pages/categories/CategoriesPage"
import { GoodsPage } from "./pages/goods/GoodsPage"
import { UserPage } from "./pages/users/UserPage"
import CategoryPage from "./pages/categories/CategoryPage"
import MainPage from "./pages/mainPage/MainPage"
import FieldsPage from "./pages/fields/FieldsPage"
import TransferPage from "./pages/transfer/TransferPage"

export const BrowserRoutes = () => {
    const {id} = useSelector(state => state.authState)

    if (id) {
        return (
            <Switch>
                <Route path="/admin/main">
                    <MainPage />
                </Route>

                <Route path="/admin/users" exact>
                    <UsersPage />
                </Route>
                <Route path="/admin/users/user" exact>
                    <UserPage />
                </Route>
                <Route path="/admin/users/user/:id">
                    <UserPage />
                </Route>

                <Route path="/admin/fields">
                    <FieldsPage />
                </Route>

                <Route path="/admin/categories" exact>
                    <CategoriesPage />
                </Route>
                <Route path="/admin/categories/category/:obj">
                    <CategoryPage />
                </Route>

                <Route path="/admin/goods">
                    <GoodsPage />
                </Route>

                <Route path="/admin/transfer">
                    <TransferPage />
                </Route>

                <Redirect to="/admin/main" />
            </Switch>
        )
    }

    return (
        <Switch>
            <Route path="/admin/login">
                <LoginPage />
            </Route>
            <Redirect to="/admin/login" />
        </Switch>
    )
}