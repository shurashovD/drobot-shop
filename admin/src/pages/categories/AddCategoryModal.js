import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addFormNameHandler, createCategory, hideModal } from '../../redux/categorySlice'

const AddCategoryModal = () => {
    const { addForm, selectedCategory, showModal } = useSelector(state => state.categoriesState)
    const dispatch = useDispatch()
    
    const handleClose = () => {
        dispatch(hideModal())
    }

    const inputHandler = event => {
        dispatch(addFormNameHandler(event.target.value))
    }

    const createHandler = () => {
        dispatch(createCategory())
    }

    return (
        <Modal show={showModal} onHide={handleClose} className="w-100">
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>Добавить подраздел в { selectedCategory?.name || "корень сайта" }</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Наименование</Form.Label>
                            <Form.Control value={addForm.name} onChange={inputHandler} />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Отмена</Button>
                    <Button variant="primary" onClick={createHandler}>OK</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    )
}

export default AddCategoryModal