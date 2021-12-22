import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { categoryClickHandler } from '../../redux/categorySlice'
import TreeView from '@mui/lab/TreeView'
import TreeItem from '@mui/lab/TreeItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

const ListTree = () => {
    const { categories } = useSelector(state => state.categoriesState)
    const dispatch = useDispatch()

    const selectHandler = (_, nodeIds) => {
        dispatch(categoryClickHandler(nodeIds))
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

    return (categories.entries?.length > 0) ? (
        <TreeView
            aria-label="rich object"
            defaultCollapseIcon={ <ExpandMoreIcon /> }
            defaultExpanded={ ['0'] }
            defaultExpandIcon={ <ChevronRightIcon /> }
            onNodeSelect={selectHandler}
            sx={{ height: '100%', flexGrow: 1, maxWidth: '100%', overflowY: 'auto' }}
        >
            { renderTree(categories) }
        </TreeView>
    )
    : (
        <p className="text-center">Карта сайта пуста</p>
    )
}

export default ListTree