/*eslint-disable */
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { setDataTableList, setIsOpen, setModalPageType, setMainClass, setMainClassList, setMidClass, setMidClassList, setSubClass } from '@store/module/businessEevaluationItems'
import React, { Fragment, useEffect, useState } from "react"
import { ChevronDown, ChevronUp, Edit2, PlusCircle } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'

import TreeItem from '@mui/lab/TreeItem'
import TreeView from '@mui/lab/TreeView'
import Typography from '@mui/material/Typography'
import clsx from 'clsx'
import PropTypes from 'prop-types'

import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row } from "reactstrap"
import ModalItem from './ModalItem'
import { defaultValues, validationSchemaObj } from '../../data'


const ItemsMgmtForm = () => {
	const [items, setItems] = useState([
		// {id:90, code: '공주대|공주교대', parent_id: 0, additional: 0, sort:3, memo:''},
		// {id:91, code: '유용성', parent_id: null, additional: 0.4, sort:2, memo:'afew'},
		// {id:92, code: '안전성 및 내구성', parent_id: null, additional: 0.4, sort:1, memo:''},
		// {id:93, code: '서비스 만족도', parent_id: null, additional: 0.2, sort:3, memo:''},
		// {id:94, code: '실내온도', parent_id: 91, additional: 0.4, sort:1, memo:''},
		// {id:95, code: '조도상태', parent_id: 91, additional: 0.4, sort:2, memo:'ae'},
		// {id:96, code: '수질상태(물탱크 청소)', parent_id: 91, additional: 0.4, sort:3, memo:''},
		// {id:97, code: '청소/위생', parent_id: 91, additional: 0.4, sort:4, memo:''},
		// {id:98, code: '실내 및 옥외시설물 이용상태', parent_id: 91, additional: 0.4, sort:5, memo:''},
		// {id:99, code: '주무관청의 시정요구 이행정도', parent_id: 91, additional: 0.4, sort:6, memo:''},
		// {id:101, code: '방재대책', parent_id: 92, additional: 0.2, sort:2, memo:'afew'},
		// {id:103, code: '기계설비', parent_id: 92, additional: 0.06, sort:4, memo:''},
		// {id:100, code: '안전점검', parent_id: 92, additional: 0.6, sort:1, memo:''},
		// {id:102, code: '건축마감', parent_id: 92, additional: 0.05, sort:3, memo:''},
		// {id:105, code: '소화설비', parent_id: 92, additional: 0.03, sort:6, memo:''},
		// {id:104, code: '전기/통신설비', parent_id: 92, additional: 0.06, sort:5, memo:'aewf'},
		// {id:106, code: '고객만족설문조사', parent_id: 93, additional: 0.4, sort:1, memo:''},
		// {id:107, code: '불평/불만접수 이행여부', parent_id: 93, additional: 0.1, sort:2, memo:''},
		// {id:108, code: '업무보고서 이행평가', parent_id: 93, additional: 0.5, sort:3, memo:''},
		// {id:109, code: '유도표지상태', parent_id: 101, additional: 0.2, sort:1, memo:''},
		// {id:110, code: '피난경로의 조명 상태', parent_id: 101, additional: 0.2, sort:2, memo:''},
		// {id:111, code: '비상통로상의 피난 장애물 유무', parent_id: 101, additional: 0.2, sort:3, memo:''},
	])
	const [maxNum, setMaxNum] = useState()
	const [lines, setLines] = useState({})
	const [parentId, setParentId] = useState()
	const businessEevaluationItems = useSelector((state) => state.businessEevaluationItems)
	const dispatch = useDispatch()
	const [expandedList, setExpandedList] = useState([])
	const [customResolver, setCustomResolver] = useState(validationSchemaObj.addItem)

	const {
		control
		, formState: { errors }
		, handleSubmit
		, setValue
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues.addItem)),
		resolver: yupResolver(customResolver)
	})

	const CustomContent = React.forwardRef(function CustomContent(props, ref) {
		const {
			classes,
			className,
			label,
			nodeId,
			icon: iconProp,
			expansionIcon,
			displayIcon,
		} = props
	
		const {
			disabled,
			expanded,
			selected,
			focused,
			handleExpansion,
			handleSelection,
			preventSelection,
		} = useTreeItem(nodeId)
	
		const icon = iconProp || expansionIcon || displayIcon
	
		const handleMouseDown = (event) => {
			preventSelection(event)
		}
	
		const handleExpansionClick = (event) => {
			if (expandedList.includes(props.nodeId)) {
				setExpandedList(expandedList.filter(id => id !== props.nodeId))
			} else {
				setExpandedList([...expandedList, props.nodeId])
			}
			handleExpansion(event)
		}
	
		const handleSelectionClick = (event) => {
			handleSelection(event)
		}
	
		return (
			// eslint-disable-next-line jsx-a11y/no-static-element-interactions
			<div className={clsx(className, classes.root, {
					[classes.expanded]: expanded,
					[classes.selected]: selected,
					[classes.focused]: focused,
					[classes.disabled]: disabled,
				})}
				onMouseDown={handleMouseDown}
				ref={ref}>
	
				{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
				<div onClick={handleExpansionClick} className={classes.iconContainer} id={'ali!!!!!!!!!!'}>
					{icon}
				</div>
				<Typography
					onClick={handleSelectionClick}
					component="div"
					className={classes.label}>
					{label}
				</Typography>
			</div>
			)
	})
	
	CustomContent.propTypes = {
		/**
		 * Override or extend the styles applied to the component.
		 */
		classes: PropTypes.object.isRequired,
		/**
		 * className applied to the root element.
		 */
		className: PropTypes.string,
		/**
		 * The icon to display next to the tree node's label. Either a parent or end icon.
		 */
		displayIcon: PropTypes.node,
		/**
		 * The icon to display next to the tree node's label. Either an expansion or collapse icon.
		 */
		expansionIcon: PropTypes.node,
		/**
		 * The icon to display next to the tree node's label.
		 */
		icon: PropTypes.node,
		/**
		 * The tree node label.
		 */
		label: PropTypes.node,
		/**
		 * The id of the node.
		 */
		nodeId: PropTypes.string.isRequired,
	}
	
	function CustomTreeItem(props) {
		return <TreeItem ContentComponent={CustomContent} {...props} />
	}

	const openModal = (node, pageType) => {
		if (pageType === 'modify') {
			setValue('id', node.id)
			setValue('code', node.code)
			setValue('memo', node.memo)
			setValue('additional', node.additional)
		}
		dispatch(setModalPageType(pageType))
		setParentId(node !== null ? node.id : null)
	}

	const checkFirstLast = (idx, length, icon) => {
		if (icon === 'up' && idx === 0) return ' first'
		else if (icon === 'down' && idx === length - 1) return ' last'
		else return ''
	}

	const handleSort = (idx, length, icon, id, sort, parentId) => {
		const result = checkFirstLast(idx, length, icon)
		if (result !== '') return false
		let temp = 1
		if (icon === 'up') temp *= -1
		const tempNodes = items.map(node => {
			if (node.parent_id === parentId && node.sort === sort +  temp) return {...node, 'sort': sort}
			else if (node.parent_id === parentId && node.id === id) return {...node, sort: node.sort + temp}
			else return node
		})
		setItems(tempNodes)
	}

	const generateTree = (data, parentId) =>{
		const tempData = data.filter(node => node.parent_id === parentId)
		tempData.sort((a, b) => a.sort - b.sort)
		return tempData.map((node, idx) => (
			<CustomTreeItem key={node.id} nodeId={String(node.id)} 
				label={
					<Row><Col xs={6}><Row className='evaluation-items d-flex'>
							<Col className='code'>{node.code}</Col>
							<Col>
								<PlusCircle className='icon' size={20} onClick={() => openModal(node, 'register')}/>
								<Edit2 className='icon' size={20} onClick={() => openModal(node, 'modify')}/>
								<ChevronUp className={`icon custom-icon${checkFirstLast(idx, tempData.length, 'up')}`} size={20} onClick={() => handleSort(idx, tempData.length, 'up', node.id, node.sort, parentId)}/>
								<ChevronDown className={`icon custom-icon${checkFirstLast(idx, tempData.length, 'down')}`} size={20} onClick={() => handleSort(idx, tempData.length, 'down', node.id, node.sort, parentId)}/>
							</Col>
					</Row></Col></Row>
				}
			>
				{generateTree(data, node.id)}
			</CustomTreeItem>
			))
	}

	const TreeComponent = ({ items }) => {
		const topLevelNodes = items.filter(node => node.parent_id === null)
		topLevelNodes.sort((a, b) => a.sort - b.sort)
		return (
			<TreeView
				aria-label="file system navigator"
				defaultCollapseIcon={<ExpandMoreIcon />}
				defaultExpandIcon={<ChevronRightIcon />}
				defaultExpanded={expandedList}
				sx={{ height: 'auto', flexGrow: 1, maxWidth: 'auto', overflowY: 'auto' }}>
				{topLevelNodes.map((node, idx) => (
					<CustomTreeItem id={String(node.id) + '_ali'} key={node.id} nodeId={String(node.id)}
						label={
							<Row><Col xs={6}><Row className='evaluation-items'>
								<Col id={node.id}>{node.code}</Col>
								<Col>
									<PlusCircle className='icon' size={20} onClick={() => openModal(node, 'register')}/>
									<Edit2 className='icon' size={20} onClick={() => openModal(node, 'modify')}/>
									<ChevronUp className={`icon custom-icon${checkFirstLast(idx, topLevelNodes.length, 'up')}`} size={20} onClick={() => handleSort(idx, topLevelNodes.length, 'up', node.id, node.sort, null)}/>
									<ChevronDown className={`icon custom-icon${checkFirstLast(idx, topLevelNodes.length, 'down')}`} size={20} onClick={() => handleSort(idx, topLevelNodes.length, 'down', node.id, node.sort, null)}/>
								</Col>
							</Row></Col></Row>
						}>
						{generateTree(items, node.id)}
					</CustomTreeItem>
				))}
			</TreeView>
		)
	}

	useEffect(() => {
		if (parentId !== undefined) dispatch(setIsOpen(true))
	}, [parentId])

	useEffect(() => {
		let maxValue = items.reduce((max, obj) => Math.max(max, obj.id), -Infinity);
		if (maxValue === -Infinity) maxValue = 0
		setMaxNum(maxValue)
	}, [items])

	return (
		<Fragment>
			<Card>
				<CardHeader>
					<CardTitle>등록</CardTitle>
				</CardHeader>
				<hr style={{margin:'0px'}}/>
				<CardBody>
					<Input/>
				</CardBody>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>등록</CardTitle>
				</CardHeader>
				<hr style={{margin:'0px'}}/>
				<CardBody>
					<div>@mui/lab_ali</div>
					<ul style={{listStyle: 'none', paddingLeft:'3em', margin:'1em 0 0 0'}}>
						<li className='evaluation-items'>
							<PlusCircle className='icon' size={20} onClick={() => openModal(null, 'register')} style={{margin:'0em 0.3em 3px 0.3em', cursor:'pointer'}}/>
						</li>
					</ul>
					{/* <Button onClick={() => openModal(null, 'register')}>추가</Button> */}
					<TreeComponent items={items}/>
				</CardBody>
			</Card>
			<ModalItem
				items={items}
				setItems={setItems}
				parentId={parentId}
				setParentId={setParentId}
				maxNum={maxNum}
				control={control}
				errors={errors}
				handleSubmit={handleSubmit}
				setValue={setValue}
				resolver={customResolver}
				setResolver={setCustomResolver}
				lines={lines}
				setLines={setLines}
			/>
		</Fragment>
	)
}

export default ItemsMgmtForm