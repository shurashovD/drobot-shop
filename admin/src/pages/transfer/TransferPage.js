import React, { useEffect } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { reset } from '../../redux/transferSlice'
import ButtonsPanel from './ButtonsPanel'
import CatalogWindow from './CatalogWindow'
import CategoryWindow from './CategoryWindow'

const TransferPage = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        return () => dispatch(reset())
    }, [])

    return (
        <Container className="py-4">
            <h3>Трансфер товаров</h3>
            <Row className="border px-2 py-4 bg-light rounded align-items-stretch">
                <Col xs={12} md={5}>
                    <Container style={{ height: '70vh' }} className="bg-white rounded border overflow-scroll py-2">
                        <CategoryWindow />
                    </Container>
                </Col>
                <Col xs={12} md={2} className="d-flex flex-column justify-content-center align-items-center">
                    <ButtonsPanel />
                </Col>
                <Col xs={12} md={5}>
                    <Container className="bg-white rounded border py-2 h-100 pe-2 overflow-scroll" style={{ overflowY: 'scroll', maxHeight: '70vh' }}>
                        <CatalogWindow />
                    </Container>
                </Col>
            </Row>         
        </Container>
    )
}

export default TransferPage