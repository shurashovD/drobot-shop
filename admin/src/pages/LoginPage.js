import React, { useState } from "react";
import { Container, Form, Button, Spinner } from 'react-bootstrap'
import { useHttp } from '../hooks/http.hook'
import { useAuth } from '../hooks/auth.hook'

export const LoginPage = () => {
    const [form, setForm] = useState({login: '', pass: ''})
    const { request, loading } = useHttp()
    const { login } = useAuth()

    const submitHandler = async event => {
        event.preventDefault()
        try {
            const {_id, name, role} = await request('/api/auth/login', 'POST', form)
            login({ _id, name, role })
        }
        catch {}
    }

    return (
        <Container className="min-vh-100 d-flex">
            <Form className="m-auto col-12 col-md-3" onSubmit={submitHandler}>
                <Form.Group className="mb-2">
                    <Form.Label>Логин</Form.Label>
                    <Form.Control
                        type="text"
                        name="login"
                        value={form.login}
                        onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Пароль</Form.Label>
                    <Form.Control
                        type="text"
                        name="pass"
                        value={form.pass}
                        onChange={event => setForm(state => ({...state, [event.target.name]: event.target.value}))}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" disabled={loading}>
                    { loading ? <Spinner animation="border" variant="primary" size="sm" /> : 'OK' }
                </Button>
            </Form>
        </Container>
    )
}