import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { productClickHandler } from '../../redux/goodsSlice'

const GoodsTree = () => {
    const { goods } = useSelector(state => state.goodsState)
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

    return (
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