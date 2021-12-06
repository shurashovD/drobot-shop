import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Container, Form, ListGroup, Placeholder, Row, Spinner } from "react-bootstrap"
import { NavLink, useParams } from "react-router-dom"
import { useAlert } from "../../hooks/alert.hook"
import { useHttp } from "../../hooks/http.hook"

export const UserPage = () => {
    const [form, setForm] = useState({ avatar: '', name: '', login: '', pass: '' })
    const [rights, setRights] = useState([
        { name: 'users', view: false, edit: false, title: 'Пользователи' },
        { name: 'categories', view: false, edit: false, title: 'Категории' },
        { name: 'goods', view: false, edit: false, title: 'Товары' }
    ])
    const [isLoading, setIsLoading] = useState(false)
    const {request, loading} = useHttp()
    const { successAlert } = useAlert()
    const params = useParams()

    const getUserById = useCallback(async id => {
        setIsLoading(true)
        try {
            const { user, rights } = await request('/api/users/get-by-id', 'POST', { id })
            const { avatar, name, login } = user
            setForm(state => ({ ...state, avatar, name, login }))
            setRights(state => state.map(item => {
                const { view, edit } = rights[item.name] ?? { view: false, edit: false }
                return { ...item, view, edit }
            }))
            setIsLoading(false)
        }
        catch {
            setIsLoading(false)
        }
    }, [request])

    const checkboxHandler = event => {
        const name = event.target.getAttribute('data-name')
        const value = event.target.getAttribute('data-value')
        const checked = event.target.checked

        setRights(state => state.map(item => {
            if (item.name === name) {
                return { ...item, [value]: checked }
            }
            return item
        }))
    }

    const createHandler = async () => {
        try {
            const { message } = await request('/api/users/create', 'POST', {form, rights})
            successAlert(message)
            setForm({ avatar: '', name: '', login: '', pass: '' })
            setRights([
                { name: 'users', view: false, edit: false, title: 'Пользователи' },
                { name: 'categories', view: false, edit: false, title: 'Категории' },
                { name: 'goods', view: false, edit: false, title: 'Товары' }
            ])
        }
        catch {}
    }

    const updateHandler = async id => {
        try {
            const { message } = await request('/api/users/update', 'POST', {id, form, rights})
            successAlert(message)
            getUserById(id)
        }
        catch {}
    }

    const submitHandler = () => {
        params.id ? updateHandler(params.id) : createHandler()
    }

    useEffect(() => {
        if ( 'id' in params ) {
            getUserById(params.id)
        }
    }, [params, getUserById])

    return (
        <Container className="pt-4">
            {
                params.id ? 
                <h3>Изменение пользователя</h3> :
                <h3>Создание пользователя</h3>
            }
            <Row className="my-3">
                <Col sm={12} md={5}>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя пользователя</Form.Label>
                            {
                                isLoading ?
                                <Placeholder as="p" animation="wave">
                                    <Placeholder xs={12} className="p-3 rounded" bg="secondary" />
                                </Placeholder> :
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}
                                />
                            }
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Логин</Form.Label>
                            {
                                isLoading ?
                                <Placeholder as="p" animation="wave">
                                    <Placeholder xs={12} className="p-3 rounded" bg="secondary" />
                                </Placeholder> :
                                <Form.Control
                                    type="text"
                                    name="login"
                                    value={form.login}
                                    onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}
                                />
                            }
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            {
                                isLoading ?
                                <Placeholder as="p" animation="wave">
                                    <Placeholder xs={12} className="p-3 rounded" bg="secondary" />
                                </Placeholder> :
                                <Form.Control
                                    type="text"
                                    name="pass"
                                    value={form.pass}
                                    onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}
                                />
                            }
                        </Form.Group>
                    </Form>
                </Col>
                <Col sm={12} md={{ span: 5, offset: 1 }}>
                    <p className="mb-2">Права</p>
                    <ListGroup>
                            {
                                rights.map(({ name, title, view, edit }) => (
                                    <ListGroup.Item key={`key_${name}`}>
                                        <p className="mb-1 fw-bold">{title}</p>
                                        <Form>
                                            {
                                                isLoading ?
                                                <Placeholder as="p" animation="wave">
                                                    <Placeholder xs={12} md={6} className="p-3 rounded" bg="secondary" />
                                                </Placeholder> :
                                                <div>
                                                    <Form.Check
                                                        inline
                                                        type="checkbox"
                                                        label="Просмотр"
                                                        checked={view}
                                                        className="me-4"
                                                        data-name={name}
                                                        data-value="view"
                                                        onChange={checkboxHandler}
                                                        disabled={edit}
                                                    />
                                                    <Form.Check
                                                        inline
                                                        type="checkbox"
                                                        label="Изменение"
                                                        checked={edit}
                                                        data-name={name}
                                                        data-value="edit"
                                                        onChange={checkboxHandler}
                                                        disabled={!view}
                                                    />
                                                </div>
                                            }
                                        </Form>
                                    </ListGroup.Item>
                                ))
                            }
                    </ListGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    {
                        isLoading ?
                        <Placeholder.Button variant="primary" xs={2} /> :
                        <Button variant="primary" type="button" onClick={ loading ? null : submitHandler }>
                            { loading ? <Spinner animation="border" variant="primary" size="sm" /> : 'OK' }
                        </Button>
                    }
                </Col>
                <Col>
                    <NavLink to="/admin/users">Назад к списку пользователей</NavLink>
                </Col>
            </Row>
        </Container>
    )
}