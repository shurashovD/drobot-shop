import React from 'react'
import { Placeholder } from 'react-bootstrap'

const LoadingList = () => (
    <ul className="w-100">
        <Placeholder as="li" animation="glow" xs={12}>
            <Placeholder xs={12} className="rounded h-100" />
        </Placeholder>
        <Placeholder as="li" animation="glow" xs={12}>
            <Placeholder xs={12} className="rounded h-100" />
        </Placeholder>
        <Placeholder as="li" animation="glow" xs={12}>
            <Placeholder xs={12} className="rounded h-100" />
            <ul className="w-100">
                <Placeholder as="li" animation="glow" xs={12}>
                    <Placeholder xs={12} className="rounded h-100" />
                </Placeholder>
                <Placeholder as="li" animation="glow" xs={12}>
                    <Placeholder xs={12} className="rounded h-100" />
                </Placeholder>
            </ul>
        </Placeholder>
        <Placeholder as="li" animation="glow" xs={12}>
            <Placeholder xs={12} className="rounded h-100" />
        </Placeholder>
    </ul>
)

export default LoadingList