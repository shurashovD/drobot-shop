import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingList from './LoadingList'
import { fetchCategories } from '../../redux/categorySlice'
import ListTree from './ListTree'

const CategoriesTree = () => {
    const { loading } = useSelector(state => state.categoriesState)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch])

    return loading ? <LoadingList/> : <ListTree />
}

export default CategoriesTree