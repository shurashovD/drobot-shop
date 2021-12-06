import React from 'react'
import { Container, Spinner } from 'react-bootstrap'

const Loader = () => {
    return (
        <Container fluid className="position-fixed top-0 left-0 bottom-0 m-0 d-flex" style={{ zIndex: 1060, background: 'rgba(255, 255, 255, 0.8)' }}>
            <Spinner animation="border" variant="secondary" className="m-auto" />
        </Container>
    )
}

export default Loader