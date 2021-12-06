import React, { useEffect } from 'react'
import { Button, Col, Container, Form, Placeholder, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { addField, addFormHandler, cancelAdd, cancelRemove, getFields, removeField, saveChanges } from '../../redux/fieldsSlice'

const FieldsPage = () => {
    const { addForm, addedFields, fields, removedFields, loading } = useSelector(state => state.fieldsState)
    const dispatch = useDispatch()

    const changeHandler = event => {
        dispatch(addFormHandler({ field: event.target.name, value: event.target.value }))
    }

    const addHandler = () => {
        dispatch(addField())
    }

    const removeHandler = event => {
        dispatch(removeField(event.target.getAttribute('data-id')))
    }

    const cancelRemoveHandler = event => {
        dispatch(cancelRemove(event.target.getAttribute('data-id')))
    }

    const cancelAddHandler = event => {
        dispatch(cancelAdd(event.target.getAttribute('data-id')))
    }

    const saveHandler = () => {
        dispatch(saveChanges())
    }

    useEffect(() => {
        dispatch(getFields())
    }, [dispatch])

    return (
        <Container className="py-4">
            <h3>Поля</h3>
            { loading && <Row xs={1} md={3} className="g-3 mb-3">
                {
                    new Array(9).fill(true).map((_, index) => (
                        <Col key={`ph_${index}`}>
                            <Placeholder as="p" animation="glow" className="m-0 p-0 rounded">
                                <Placeholder xs={12} className="rounded p-4" />
                            </Placeholder>
                        </Col>
                    ))
                }
            </Row> }
            { loading && <Placeholder animation="glow"><Placeholder.Button xs={12} md={2} /></Placeholder> }
            { !loading && <Table className="mb-3">
                <thead>
                    <tr>
                        <th className="text-center">Наименование поля</th>
                        <th className="text-center">Тип данных</th>
                        <th className="text-center">Действие</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        fields.map(({_id, name, type}) => {
                            const removed = removedFields.some(item => item.toString() === _id.toString())
                            return <tr key={_id}>
                                <td className={ removed ? "text-muted" : "" }>{name}</td>
                                <td className={ removed ? "text-muted text-center" : "text-center" }>
                                    {
                                        [
                                            {key: 'number', value: 'Числовой'},
                                            {key: 'text', value: 'Текстовый'}
                                        ].filter(({key}) => key === type).map(item => (<span key={_id + item.key}>{item.value}</span>))
                                    }
                                </td>
                                <td className="text-center">
                                    <Button size="sm" data-id={_id}
                                        variant={removed ? "success" : "danger" }
                                        onClick={removed ? cancelRemoveHandler : removeHandler}
                                    >
                                        { removed ? <>Восстановить</> : <>Удалить</> }
                                    </Button>
                                </td>
                            </tr>
                        })
                    }
                    {
                        addedFields.map(({name, type}, index) => (
                            <tr key={`key_${index}`}>
                                <td>{name}</td>
                                <td className="text-center">
                                    {
                                        [
                                            {key: 'number', value: 'Числовой'},
                                            {key: 'text', value: 'Текстовый'}
                                        ].filter(({key}) => key === type).map(item => (<span key={index + item.key}>{item.value}</span>))
                                    }
                                </td>
                                <td className="text-center">
                                    <Button variant="secondary" size="sm" data-id={index} onClick={cancelAddHandler}>Отменить</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <Form.Control type="text" placeholder="Наименование" value={addForm.name} onChange={changeHandler} name="name" />
                        </td>
                        <td>
                            <Form.Select value={addForm.type} onChange={changeHandler} name="type">
                                <option value="number">Числовой</option>
                                <option value="text">Текстовый</option>
                            </Form.Select>
                        </td>
                        <td className="text-center">
                            <Button variant="primary" size="sm" onClick={addHandler}
                                disabled={ addForm.name === '' }
                            >Добавить поле</Button>
                        </td>
                    </tr>
                </tfoot>
            </Table> }
            { !loading && <div>
                <Button variant="primary" onClick={saveHandler}>Сохранить</Button>
            </div> }
        </Container>
    )
}

export default FieldsPage