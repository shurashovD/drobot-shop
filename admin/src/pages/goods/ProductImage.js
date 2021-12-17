import React, { useRef } from 'react'
import { Card, CloseButton, Image } from 'react-bootstrap'
import { useDrag, useDrop } from 'react-dnd'
import { useDispatch } from 'react-redux'
import { moveImg, rcPhoto, rmPhoto } from '../../redux/goodsSlice'
import { CARD_PRIMARY, CARD_SECONDARY, CARD_SUCCESS } from '../../redux/types'

const ProductImage = ({ variant, src, index, classList }) => {
    const dispatch = useDispatch()
    const ref = useRef(null)

    const removePhoto = event => {
        dispatch(rmPhoto({
            idx: event.target.dataset.index,
            loaded: event.target.dataset.loaded
        }))
    }

    const recoverPhoto = event => {
        dispatch(rcPhoto(event.target.dataset.index))
    }

    const [_, drop] = useDrop({
        accept: 'card',
        hover: item => {
            if ( !ref.current ) return

            const moveIndex = item.index
            const hoverIndex = index

            if (moveIndex === hoverIndex) return
            dispatch(moveImg({ moveIndex, hoverIndex }))
            item.index = hoverIndex
        }
    })

    const [a, drag] = useDrag({
        type: 'card',
        item: { index }
    })

    drag(drop(ref))

    return (
        <Card bg={variant} text="white" className={`h-100 border-0 ${classList || ""}`} ref={ref}>
            { variant === CARD_SUCCESS && <Card.Header>Не сохранено</Card.Header> }
            { variant === CARD_PRIMARY && <Card.Header>Загружено</Card.Header> }
            { variant === CARD_SECONDARY && <Card.Header>Исключено</Card.Header> }
            <Card.Body className="position-relative d-flex product-image p-0 border-none">
                <Image src={src} fluid className="rounded-bottom" />
                { variant === CARD_SECONDARY ?
                <button
                    className="btn position-absolute center bg-white p-0 m-2 px-1 opacity-0"
                    data-index={index}
                    onClick={recoverPhoto}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16" data-index={index}>
                        <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                    </svg>
                </button>
                :
                <CloseButton
                    className="position-absolute center bg-light m-2 opacity-0"
                    data-index={index}
                    onClick={removePhoto}
                    data-loaded={ variant === 'primary' }
                /> }
            </Card.Body>
        </Card>
    )
}

export default ProductImage