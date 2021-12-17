import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { productClickHandler } from '../../redux/goodsSlice'
import { Placeholder } from 'react-bootstrap'

const GoodsTree = () => {
    const { goods, loading } = useSelector(state => state.goodsState)
    const dispatch = useDispatch()

    const selectHandler = (_, nodeIds) => {
        dispatch(productClickHandler(nodeIds))
    }

    const renderTree = nodes => (
        <TreeItem key={nodes._id} nodeId={nodes._id} label={nodes.name}>
            {
                Array.isArray(nodes.entries)
                ? nodes.entries.map(node => renderTree(node))
                : null
            }
        </TreeItem>
    )

    return loading ? (
        <>
            <Placeholder as="p" animation="glow" xs={12}>
                <Placeholder xs={12} className="rounded w-100 h-100" />
            </Placeholder>
            <Placeholder as="p" animation="glow" xs={12}>
                <Placeholder xs={12} className="rounded w-100 h-100" />
            </Placeholder>
            <Placeholder as="p" animation="glow" xs={12}>
                <Placeholder xs={12} className="rounded w-100 h-100" />
            </Placeholder>
            <Placeholder as="p" animation="glow" xs={12}>
                <Placeholder xs={12} className="rounded w-100 h-100" />
            </Placeholder>
        </>
    ) :
    (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={ <ExpandMoreIcon /> }
            defaultExpanded={ ['0'] }
            defaultExpandIcon={ <ChevronRightIcon /> }
            onNodeSelect={selectHandler}
            sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
        >
            { renderTree(goods) }
        </TreeView>
    )
}

export default GoodsTree