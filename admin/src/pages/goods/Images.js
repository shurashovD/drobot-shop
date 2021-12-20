import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Col, Placeholder, Row } from 'react-bootstrap'
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined'
import ProductImage from './ProductImage'
import { addPhotos } from '../../redux/goodsSlice'

const Images = () => {
    const { loading, photos } = useSelector(state => state.goodsState)
    const dispatch = useDispatch()

    const fileHandler = event => {
        const sources = Array.from(event.target.files).map(item => URL.createObjectURL(item))
        dispatch(addPhotos(sources))
    }

    return loading ? 
    (
        <Row md={3} className="border border-top-0 rounded-bottom g-2 m-0 align-items-stretch">
            <Col>
                <div style={{ minHeight: '10vh' }} className="rounded">
                    <Placeholder xs={12} />
                </div>
            </Col>
        </Row>
    )
    : (
        <Row md={3} className="border border-top-0 rounded-bottom g-2 m-0 align-items-stretch p-2">
            {
                photos.map(({variant, src, classList}, index) => 
                    <Col key={`$_image_${index}`} style={{ minHeight: '20vh' }}>
                        <ProductImage
                            classList={classList}
                            variant={variant}
                            src={src}
                            index={index}
                        />
                    </Col>
                )
            }
            <Col>
                <Card className="h-100">
                    <Card.Header>
                        <label className="text-primary">
                            Добавить фото...
                            { !loading && <input
                                type="file"
                                style={{ width: 0, height: 0, padding: 0, margin: 0 }}
                                onInput={fileHandler}
                                accept="image/*"
                                multiple
                            /> }
                        </label>
                    </Card.Header>
                    <Card.Body className="d-flex">
                        <AddAPhotoOutlinedIcon className="m-auto text-secondary" sx={{ fontSize: 80 }} />
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    )
}

export default Images