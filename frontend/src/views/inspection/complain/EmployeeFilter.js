import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import axios from '@utility/AxiosConfig'
import { makeSelectList, selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, API_GET_PROBELM_TYPE_LIST } from '../../../constants'

const EmployeeFilter = (props) => {
	useAxiosIntercepter()
	const {Causetype, setCauseType, Problemtype, setProblemType, Status, setStatus, changeSearch,
		searchitemParams, setSearchItemParams, emp_class, setEmpClass, prop_id
	} = props

	const [CauetypeList, setCauseTypeList] = useState([{label: '원인유형 전체', value:''}])
	const [ProblemtypeList, setProblemTypeList] = useState([{label: '문제유형 전체', value:''}])
	const [StatusList, setStatusList] = useState([{label: '작업상태 전체', value:''}])
	const [EmpClassList, setEmpClassList] = useState([{label: '직종 전체', value:''}])

	useEffect(() => {
		axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: prop_id} })
		.then(
			resEmployeeClass => {
			makeSelectList(true, '', resEmployeeClass.data, EmpClassList, setEmpClassList, ['name'], 'id')
		
		})
		axios.get(API_GET_PROBELM_TYPE_LIST, {params: {prop_id: prop_id}})
		.then(res => {
			makeSelectList(true, '', res.data.problem_type_list, ProblemtypeList, setProblemTypeList, ['label'], 'value')
			makeSelectList(true, '', res.data.cause_type_list, CauetypeList, setCauseTypeList, ['label'], 'value')
		})
		setStatusList([{label:'전체', value:''}, {label:'접수', value:'접수'}, {label:'진행', value:'진행중'}, {label:'완료', value:'완료'}])
	}, [])

	return (
		<Fragment>
			<Row>
				<Col xs='6' md='2' className='mb-2'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={Problemtype}
						options={ProblemtypeList}
						onChange={(e) => setProblemType(e)}
						isClearable={false}
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
					/>
				</Col>
				<Col xs='6' md='2' className='mb-2'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={Causetype}
						options={CauetypeList}
						onChange={(e) => setCauseType(e)}
						isClearable={false}
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
					/>
				</Col>
				<Col xs='6' md='2' className='mb-2'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={Status}
						defaultValue={StatusList[0]}
						options={StatusList}
						onChange={(e) => setStatus(e)}
						isClearable={false}
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
					/>
				</Col>
				<Col xs='6' md='2' className='mb-2'>
					<Select
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={emp_class}
						options={EmpClassList}
						onChange={(e) => setEmpClass(e)}
						isClearable={false}
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
					/>
				</Col>
				<Col xs='12' md ='4' className='mb-2'>
					<InputGroup>
						<Input 
							value={searchitemParams}
							onChange={(e) => setSearchItemParams(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') changeSearch()
							}}
							maxLength={498}
							placeholder= {'접수내용을 검색해 보세요.'}/>
						<Button style={{zIndex: 0}} onClick={() => changeSearch()}>검색</Button>
					</InputGroup>
				</Col>
			</Row>
		</Fragment>
	)
}

export default EmployeeFilter

