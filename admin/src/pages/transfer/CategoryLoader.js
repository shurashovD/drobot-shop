import React from 'react'
import { Placeholder } from 'react-bootstrap'

const Loader = () => (
    <div>
        <Placeholder as="p" animation="grow">
            <Placeholder xs={12} className="rounded" />
        </Placeholder>
        <Placeholder as="p" animation="grow">
            <Placeholder xs={12} className="rounded" />
        </Placeholder>
        <Placeholder as="p" animation="grow">
            <Placeholder xs={12} className="rounded" />
        </Placeholder>
    </div>
)

export default Loader