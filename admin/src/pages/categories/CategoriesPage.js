import React, { useEffect } from 'react'
import { Button, Col, Container, Row} from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { resetCategoriesState, showModal } from '../../redux/categorySlice'
import AddCategoryModal from './AddCategoryModal'
import CategoriesTree from './CategoriesTree'
import CategoryPanel from './CategoryPanel'

export const CategoriesPage = () => {
    const dispatch = useDispatch()

    const addHandler = () => {
        dispatch(showModal())
    }

    useEffect(() => {
        return () => dispatch(resetCategoriesState())
    }, [dispatch])

    return (
        <Container fluid>
            <AddCategoryModal />
            <Container className="py-4">
                <Row className="mb-3">
                    <Col>
                        <span className="fs-3">Разделы и категории</span>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button variant="success" onClick={addHandler}>Добавить раздел</Button>
                    </Col>
                </Row>
                <Row className="border px-2 py-4 bg-light rounded align-items-stretch">
                    <Col xs={12} md={5}>
                        <Container style={{ height: '70vh' }} className="bg-white rounded border overflow-scroll py-2">
                            <CategoriesTree />
                        </Container>
                    </Col>
                    <Col xs={12} md={7}>
                        <Container className="bg-white rounded border py-2 h-100 pe-2" style={{ overflowY: 'scroll' }}>
                            <CategoryPanel />
                        </Container>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}