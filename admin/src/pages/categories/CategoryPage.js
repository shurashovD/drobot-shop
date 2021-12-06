import React from 'react'
import { Button, Card, Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { setPhoto } from '../../redux/categorySlice'

const CategoryPage = () => {
    const { selectedCategory, form } = useSelector(state => state.categoriesState)
    const dispatch = useDispatch()
    
    const fileHandler = event => {
        dispatch(setPhoto(event.target.files[0]))
    }

    return (
            <Container className="py-4">
                <h3>Добавление раздела в {selectedCategory?.name}</h3>
                <Tabs defaultActiveKey="props">
                    <Tab eventKey="props" title="Свойства">
                        <Row className="border border-top-0 rounded-bottom p-3 m-0">
                            <Col xs="12" md="6">
                                <Form style={{ height: '60vh', overflowY: 'scroll' }} >
                                    <Form.Group className="mb-3">
                                        <Form.Label>Название</Form.Label>
                                        <Form.Control type="text"></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Описание</Form.Label>
                                        <Form.Control as="textarea" rows="6"></Form.Control>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col xs="12" md={{ span: 5, offset: 1 }}>
                                <Card>
                                    <Card.Img variant="top" height="330" className="bg-light" src={form.imgSrc} />
                                    <Card.Body>
                                        <Card.Text>Изображение категории</Card.Text>
                                        <label className="btn btn-primary">
                                            <input
                                                type="file"
                                                style={{ width: 0, height: 0, margin: 0, padding: 0 }}
                                                accept="image/jpeg"
                                                onInput={fileHandler}
                                            />
                                            Имзенить
                                        </label>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Tab>
                    <Tab eventKey="fileds" title="Поля" disabled={true}>
                        Поля
                    </Tab>
                </Tabs>
                <Row className="mt-4 ps-4">
                    <Col>
                        <Button variant="primary">OK</Button>
                    </Col>
                    <Col className="d-flex">
                        <NavLink to="/admin/categories" className="mx-auto text-center">Назад к списку категорий...</NavLink>
                    </Col>
                </Row>          
            </Container>
    )
}

export default CategoryPage