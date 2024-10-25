import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import axios from "@utility/AxiosConfig"
import { getTableData, selectThemeColors } from '@utils'

import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import Cookies from "universal-cookie"

import { API_DOC_RECEIVER_GROUP_LIST, API_EMPLOYEE_CLASS_LIST, API_GET_PROPERTY } from '../../../../../constants'


const EmployeeFilter = (props) => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const {selectClass, setSelectClass, searchParams, setSearchParams, changeSearch, setReceiverGroupId, groupReceiverId } = props
	const [selectPropertyList, setSelectPropertyList] = useState([])
	const [selectProperty, setSelectProperty] = useState({label:`${cookies.get('property').label}`, value:`${cookies.get('property').value}`})
	const [selectClassList, setSelectClassList] = useState([{label: '직종 전체', value:''}])
	const [receiverGroupList, setReceiverGroupList] = useState([{label: '수신자 그룹', value:''}])

	const getInit = () => {
		const param = {
			prop_id : selectProperty.value
		}
		getTableData(API_EMPLOYEE_CLASS_LIST, param, setSelectClassList)
	}

	useEffect(() => {
		getTableData(API_GET_PROPERTY, '', setSelectPropertyList)
		axios.get(API_DOC_RECEIVER_GROUP_LIST,  {params :{userId: cookies.get('userId')}})
		.then(response => {
			const receiver = response.data
			const receiverList = receiver.map((group) => ({
				value: group.id,
				label: group.name
			}))
			setReceiverGroupList(receiverList)
		}).catch(error => {
			console.error(error)
		})
	}, [])

	useEffect(() => {
		setSelectClass({label: '직종 전체', value:''})
		if (selectProperty.value === '') setSelectClassList([{label: '직종 전체', value:''}])
		else getInit()
	}, [selectProperty])

	return (
		<Fragment>
			<Row className='mb-2'>
				<Col className='mt-1' xs='12' md='12' lg='4'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectProperty}
						options={selectPropertyList}
						onChange={(e) => setSelectProperty(e)}
						isClearable={false}
						menuPortalTarget={document.body} 
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					/>
				</Col>
				<Col className='mt-1' xs='12' md='12' lg='3'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectClass}
						options={selectClassList}
						onChange={(e) => setSelectClass(e)}
						isClearable={false}
						menuPortalTarget={document.body} 
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					/>
				</Col>
				
				<Col className='mt-1' xs='12' md ='12' lg='5'>
					<InputGroup>
						<Input 
							value={searchParams}
							onChange={(e) => setSearchParams(e.target.value)}
							placeholder= {'이름을 검색해 보세요.'}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									changeSearch(selectProperty.value)
								}
							}}/>
						<Button onClick={() => changeSearch(selectProperty.value)}>검색</Button>
					</InputGroup>
				</Col>
				
				<Col className='mt-1' xs='12' md='12' lg='12'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={groupReceiverId}
						options={receiverGroupList}
						onChange={(e) => setReceiverGroupId(e)}
						isClearable={false}
						menuPortalTarget={document.body} 
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					/>
				</Col>
			</Row>
		</Fragment>
	)
}

export default EmployeeFilter
