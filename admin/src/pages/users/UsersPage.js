import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import Loader from '../../components/Loader'
import { useAlert } from '../../hooks/alert.hook'
import { useHttp } from '../../hooks/http.hook'

export const UsersPage = () => {
    const [users, setUsers] = useState()
    const { request, loading } = useHttp()
    const { successAlert } = useAlert()

    const getUsers = useCallback(async () => {
        try {
            const response = await request('/api/users/get-all')
            setUsers(response)
        }
        catch {}
    }, [request])

    const removeHandler = async event => {
        const id = event.target.getAttribute('data-id')
        try {
            const { message } = await request('/api/users/remove', 'POST', { id })
            successAlert(message)
            getUsers()
        }
        catch {}
    }

    useEffect(getUsers, [getUsers])

    return (
        <Container className="py-4">
            { loading && <Loader /> }
            <h3>Пользователи</h3>
            { !users?.length && <p>Список пользователей пуст</p> }
            { users?.length > 0 && <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Имя</th>
                        <th>Логин</th>
                        <th>Изменить</th>
                        <th>Удалить</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(({_id, avatar, name, login}) => (
                            <tr key={_id}>
                                <td>{
                                    avatar && avatar !== '' && <img alt="avatar" src={avatar} width="40" />
                                }</td>
                                <td>{name}</td>
                                <td>{login}</td>
                                <td>
                                    <NavLink className="btn btn-primary" to={`/admin/users/user/${_id}`}>Изменить</NavLink>
                                </td>
                                <td>
                                    <Button
                                        variant="link"
                                        className="text-danger"
                                        onClick={removeHandler}
                                        data-id={_id}
                                    >Удалить</Button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </Table> }
            <Row className="mt-3">
                <Col sm={12} md={4}>
                    <NavLink to="/admin/users/user" className="btn btn-primary">Добавить пользователя</NavLink>
                </Col>
            </Row>
        </Container>
    )
}