import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const MainPageCard = ({header, body, link}) => (
    <Col>
        <Card border="success">
            <Card.Header>{header}</Card.Header>
            <Card.Body>{body}</Card.Body>
            <Card.Footer>
                <NavLink to={link}>Детали...</NavLink>
            </Card.Footer>
        </Card>
    </Col>
)

export default MainPageCard