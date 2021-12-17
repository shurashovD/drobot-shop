import React, { useCallback } from 'react'
import { Button, Col, Form, Placeholder, Row, Tab, Tabs } from 'react-bootstrap'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useDispatch, useSelector } from 'react-redux'
import { setForm, tabChange, updateGood } from '../../redux/goodsSlice'
import Images from './Images'

const GoodsPanel = () => {
    const { activeTab, form, loading, selectedProduct } = useSelector(state => state.goodsState)
    const dispatch = useDispatch()

    const formHandler = event => {
        dispatch(setForm({ name: event.target.name, value: event.target.value }))
    }

    const updateHandler = () => {
        dispatch(updateGood())
    }

    const tabHandler = data => {
        dispatch(tabChange(data))
    }

    return loading ? (
        <>
            <Placeholder as="p" animation="glow" xs={12}>
                <Placeholder xs={12} className="rounded h-100 mx-auto" />
            </Placeholder>
            <Placeholder animation="glow" xs={12}>
                <Placeholder.Button xs={12} className="mb-2" />
            </Placeholder>
            <Placeholder animation="glow" xs={12}>
                <Placeholder.Button xs={12} className="mb-2" />
            </Placeholder>
            <Placeholder animation="glow" xs={12} className="w-100 mt-auto">
                <Placeholder.Button variant="warning" xs={12} className="mb-2" />
            </Placeholder>
        </>
    ) :
    (
        <div className="d-flex flex-column h-100">
            <p className="text-center mb-3">{selectedProduct?.name ?? 'Товар не выбран'}</p>
            { selectedProduct && 
                <>
                    <Tabs activeKey={activeTab} onSelect={tabHandler}>
                        <Tab eventKey="wrap" title="Обложка" className="mb-3">
                            <Row className="border border-top-0 rounded-bottom p-3 gx-2 m-0 align-items-stretch">
                                <Col sm={12}>
                                    <Form>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Название</Form.Label>
                                            <Form.Control type="text" readOnly placeholder={form.name} />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Описание</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={form.description}
                                                name="description"
                                                onChange={formHandler}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="photos" title="Изображения" className="mb-3" onSelect={tabHandler}>
                            <DndProvider backend={HTML5Backend}>
                                <Images />
                            </DndProvider>
                        </Tab>
                        <Tab eventKey="fields" title="Поля" className="mb-3" onSelect={tabHandler}></Tab>
                    </Tabs>
                    <div className="mt-auto ms-auto">
                        <Button variant="primary" onClick={updateHandler} disabled={!selectedProduct || loading}>Сохранить</Button>
                    </div>
                </>
            }
        </div>
    )
}

export default GoodsPanel