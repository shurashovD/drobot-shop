import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'react-bootstrap'
import { catalogCheck, getCatalog, getParentCatalog, selectCatalog } from '../../redux/transferSlice'
import Loader from './CategoryLoader'

const CatalogWindow = () => {
    const { catalog, catalogChecked, catalogLoading, selectedCatalog } = useSelector(state => state.transferState)
    const dispatch = useDispatch()

    const upHandler = event => {
        dispatch(getParentCatalog(event.target.dataset.catalog))
    }

    const goodHandler = event => {
        dispatch(catalogCheck(event.target.dataset.id))
    }

    const catalogHandler = event => {
        dispatch(selectCatalog(event.target.dataset.id))
        dispatch(getCatalog(event.target.dataset.id))
    }

    useEffect(() => {
        dispatch(getCatalog())
    }, [dispatch])

    if ( catalogLoading ) {
        return <Loader />
    }

    if ( !selectedCatalog && catalog.length === 0 ) {
        return <p className="text-center">Нет доступных категорий</p>
    }

    return (
        <Table>
            <tbody>
                { selectedCatalog &&
                    <tr>
                        <td style={{ width: '12px' }}></td>
                        <td>
                            <span onClick={upHandler} data-catalog={selectedCatalog} className="cursor-pointer">..</span>
                        </td>
                    </tr>
                }
                {
                    catalog.map(({_id, isGood, name}) => (
                        <tr key={_id}>
                            <td className="align-middle p-1" style={{ width: '12px' }}>
                                { !isGood && <span className="text-muted p-1 rounded">+</span> }
                            </td>
                            <td className="p-1">
                                <span
                                    className={`cursor-pointer ${catalogChecked.some(item => item === _id) ? "text-success" : "text-dark"}`}
                                    data-id={_id}
                                    onClick={ isGood ? goodHandler : catalogHandler }
                                >{name}</span>
                            </td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    )
}

export default CatalogWindow