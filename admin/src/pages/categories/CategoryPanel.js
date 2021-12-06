import React from 'react'
import { Button, CloseButton, Col, Form, Image, Placeholder, Row, Tab, Tabs } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { setForm, setPhoto, updateCategory } from '../../redux/categorySlice'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'

const CategoryPanel = () => {
    const { loading, selectedCategory, form } = useSelector(state => state.categoriesState)
    const dispatch = useDispatch()

    const formHandler = event => {
        dispatch(setForm({ key: event.target.name, value: event.target.value }))
    }

    const fileHandler = event => {
        dispatch(setPhoto(event.target.files[0]))
    }

    const removePhoto = () => {
        dispatch(setPhoto())
    }

    const updateHandler = () => {
        dispatch(updateCategory())
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
            <p className="text-center mb-3">{selectedCategory?.name ?? 'Раздел не выбран'}</p>
            { selectedCategory && 
                <>
                    <Tabs defaultActiveKey="wrap">
                        <Tab eventKey="wrap" title="Обложка">
                            <Row className="border border-top-0 rounded-bottom p-3 gx-2 m-0 align-items-stretch">
                                <Col sm={12} md={8}>
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
                                <Col sm={12} md={4} className="d-flex">
                                    { form.imgSrc
                                        ? <div className="position-relative">
                                            <Image src={form.imgSrc} fluid />
                                            <CloseButton className="position-absolute top-0 end-0 bg-light m-1" onClick={removePhoto} />
                                        </div>
                                        : <label className="m-auto w-100 d-flex">
                                            <input
                                                type="file"
                                                style={{ width: 0, height: 0, padding: 0, margin: 0 }}
                                                onInput={fileHandler}
                                                accept="image/*"
                                            />
                                            <AddAPhotoOutlinedIcon className="m-auto text-secondary" sx={{ fontSize: 80 }} />
                                        </label>
                                    }
                                </Col>
                            </Row>
                        </Tab>
                        <Tab eventKey="fields" title="Поля"></Tab>
                    </Tabs>
                    <div className="mt-auto ms-auto">
                        <Button variant="primary" onClick={updateHandler}>Сохранить</Button>
                    </div>
                </>
            }
        </div>
    )
}

export default CategoryPanel