import { selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'

import { API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LEVEL_LIST, API_GET_PROPERTY } from '../../../../constants'
import { getTableData, getTableDataCallback } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'

const EmployeeFilter = (props) => {
	useAxiosIntercepter()
	const {selectClass, setSelectClass, selectLevel, 
		setSelectLevel, searchParams, setSearchParams, 
		changeSearch, selectProperty, setSelectProperty } = props
	const [selectClassList, setSelectClassList] = useState([{label: '직종 전체', value:''}])
	const [selectLevelList, setSelectLevelList] = useState([{label: '직급 전체', value:''}])
	const [selectPropertyList, setSelectPropertyList] = useState([{label: '사업소 전체', value:''}])

	useEffect(() => {
		getTableData(API_GET_PROPERTY, '', setSelectPropertyList)
		getTableDataCallback(API_EMPLOYEE_CLASS_LIST, {}, function(data) {
			data[0].label = `${data[0].label} 전체`
			setSelectClassList(data)
		})
		getTableDataCallback(API_EMPLOYEE_LEVEL_LIST, {}, function(data) {
			data[0].label = `${data[0].label} 전체`
			setSelectLevelList(data)
		})
	}, [])

	return (
		<Fragment>
			<Row className='mb-2'>
				<Col className='mt-1' xs='12' md='12' lg='6'>
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
				<Col className='mt-1' xs='12' md ='12' lg='3'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectLevel}
						options={selectLevelList}
						onChange={(e) => setSelectLevel(e)}
						isClearable={false}
						menuPortalTarget={document.body} 
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					/>
				</Col>
				
				<Col className='mt-1' xs='12' md='12' lg='12'>
					<InputGroup>
						<Input 
							value={searchParams}
							onChange={(e) => setSearchParams(e.target.value)}
							placeholder= {'이름을 검색해 보세요.'}/>
						<Button 
							onClick={() => changeSearch()}>검색</Button>
					</InputGroup>
				</Col>
			</Row>
		</Fragment>
	)
}

export default EmployeeFilter
