import React from 'react'
import { Card, Col } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

const MainPageCard = ({header, body, link, border}) => (
    <Col>
        <Card border={border} className="h-100">
            <Card.Header>{header}</Card.Header>
            <Card.Body>{body}</Card.Body>
            <Card.Footer>
                <NavLink to={link}>Детали...</NavLink>
            </Card.Footer>
        </Card>
    </Col>
)

export default MainPageCard