import React from 'react'
import { Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { transfer, unTransfer } from '../../redux/transferSlice'

const ButtonsPanel = () => {
    const { catalogChecked, categoryChecked, catalogLoading, selectedCategory, selectedCatalog } = useSelector(state => state.transferState)
    const dispatch = useDispatch()

    const importHandler = () => {
        dispatch(transfer())
    }

    const cancelHandler = () => {
        dispatch(unTransfer())
    }

    return (
        <>
            <Button
                variant="primary mb-2"
                disabled={catalogLoading || !selectedCategory || !selectedCatalog || categoryChecked.length === 0}
                onClick={importHandler}
            >&gt;&gt;</Button>
            <Button
                variant="success mt-2"
                disabled={catalogLoading || catalogChecked.length === 0}
                onClick={cancelHandler}
            >&lt;&lt;</Button>
        </>
    )
}

export default ButtonsPanel