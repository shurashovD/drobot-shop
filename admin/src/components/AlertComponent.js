import React from "react"
import { Alert, Container } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { alertSliceHide } from "../redux/alertSlice"

export const AlertComponent = () => {
    const { show, text, variant }  = useSelector(state => state.alertState)
    const dispatch = useDispatch()

    return (
        <Container fluid className={`position-fixed top-0 left-0 right-0 p-1 m-0`} style={{ zIndex: 1080 }}>
            <Alert show={show} variant={variant} onClose={() => dispatch(alertSliceHide())} dismissible>
                {text}
            </Alert>
        </Container>
    )
}