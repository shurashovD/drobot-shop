import React, { useEffect } from 'react'
import { Button, Col, Container, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { getGoods, moySkladSync, resetGoods } from '../../redux/goodsSlice'
import GoodsPanel from './GoodsPanel'
import GoodsTree from './GoodsTree'

export const GoodsPage = () => {
    const { loading } = useSelector(state => state.goodsState)
    const dispatch = useDispatch()

    const syncHandler = () => {
        dispatch(moySkladSync())
    }

    useEffect(() => {
        dispatch(getGoods())
        return () => dispatch(resetGoods())
    }, [dispatch])

    return (
        <Container className="py-4">
            <Row className="mb-3">
                <Col>
                    <span className="fs-3">Товары</span>
                </Col>
                <Col className="d-flex justify-content-end">
                    <OverlayTrigger
                        placement="bottom"
                        delay={{ show: 200, hide: 200 }}
                        overlay={
                            <Tooltip>
                                Получение актуальной информации из ПТК "Мой склад".
                                Синхронизируются названия и цены товаров.
                            </Tooltip>
                        }
                    >
                        <Button variant="success" onClick={syncHandler} disabled={loading}>Синхронизировать с "Мой склад"</Button>
                    </OverlayTrigger>
                    
                </Col>
            </Row>
            <Row className="border px-2 py-4 bg-light rounded align-items-stretch">
                <Col xs={12} md={5}>
                    <Container style={{ height: '70vh' }} className="bg-white rounded border overflow-scroll py-2">
                        <GoodsTree />
                    </Container>
                </Col>
                <Col xs={12} md={7}>
                    <Container className="bg-white rounded border py-2 h-100 pe-2" style={{ overflowY: 'scroll' }}>
                        <GoodsPanel />
                    </Container>
                </Col>
            </Row>
        </Container>
    )
}