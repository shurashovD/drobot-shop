import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { categoryCheck, getCategory, getParentCategory, selectCategory } from '../../redux/transferSlice'
import Loader from './CategoryLoader'

const CategoryWindow = () => {
    const { categoryFilter, categoryChecked, categoryLoading, selectedCategory } = useSelector(state => state.transferState)
    const dispatch = useDispatch()

    const upHandler = event => {
        dispatch(getParentCategory(event.target.dataset.category))
    }
    
    const goodHandler = event => {
        dispatch(categoryCheck(event.target.dataset.id))
    }

    const categoryHandler = event => {
        dispatch(selectCategory(event.target.dataset.id))
        dispatch(getCategory(event.target.dataset.id))
    }

    useEffect(() => {
        dispatch(getCategory())
    }, [dispatch])

    if ( categoryLoading ) {
        return <Loader />
    }

    if ( !selectedCategory && categoryFilter.length === 0 ) {
        return <p className="text-center">Нет доступных категорий</p>
    }

    return (
        <Table>
            <tbody>
                { selectedCategory &&
                    <tr>
                        <td style={{ width: '12px' }}></td>
                        <td>
                            <span onClick={upHandler} data-category={selectedCategory} className="cursor-pointer">..</span>
                        </td>
                    </tr>
                }
                {
                    categoryFilter.map(({_id, isGood, name}) => (
                        <tr key={_id}>
                            <td className="align-middle p-1" style={{ width: '12px' }}>
                                { !isGood && <span className="text-muted p-1 rounded">+</span> }
                            </td>
                            <td className="p-1">
                                <span
                                    className={`cursor-pointer ${categoryChecked.some(item => item === _id) ? "text-primary" : "text-dark"}`}
                                    data-id={_id}
                                    onClick={ isGood ? goodHandler : categoryHandler }
                                >{name}</span>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

export default CategoryWindow