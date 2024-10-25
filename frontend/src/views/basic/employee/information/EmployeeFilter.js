import { getTableDataModifyFirstIdx, selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import { API_EMPLOYEE_CLASS_LIST, API_EMPLOYEE_LEVEL_LIST } from '../../../../constants'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
const EmployeeFilter = (props) => {
	useAxiosIntercepter()
	const {selectClass, setSelectClass, selectLevel, setSelectLevel, searchParams, setSearchParams, changeSearch, selectStatus, setSelectStatus} = props

	const statusData = [
		{label: '상태 전체', value:''},
		{label: '재직', value:'재직'},
		{label: '퇴직', value:'퇴직'},
		{label: '신청', value:'신청'}
	]

	const [selectClassList, setSelectClassList] = useState([{label: '직종 전체', value:''}])
	const [selectLevelList, setSelectLevelList] = useState([{label: '직급 전체', value:''}])


	const getInit = () => {
		getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, {}, setSelectClassList, '직종 전체')
		getTableDataModifyFirstIdx(API_EMPLOYEE_LEVEL_LIST, {}, setSelectLevelList, '직급 전체')
	}

	useEffect(() => {
		getInit()
	}, [])
	
	return (
		<Fragment>
			<Row className='mb-1'>
				<Col xl={4} lg={12} md ={12} xs='12' className='mb-1'>
					<Select
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectClass}
						options={selectClassList}
						onChange={(e) => setSelectClass(e)}
						isClearable={false}
					/>
				</Col>
				<Col xl={4} lg={12} md ={12} xs='12' className='mb-1'>
					<Select
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectLevel}
						options={selectLevelList}
						onChange={(e) => setSelectLevel(e)}
						isClearable={false}
					/>
				</Col>
				<Col xl={4} lg={12} md ={12} xs='12' className='mb-1'>
					<Select
						styles={{ menu: base => ({ ...base, zIndex: 100 })}}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectStatus}
						options={statusData}
						onChange={(e) => setSelectStatus(e)}
						isClearable={false}
					/>
				</Col>
				<Col xl={12} lg={12} md ={12} xs='12' className='mb-1'>
					<InputGroup>
						<Input 
							value={searchParams}
							onChange={(e) => setSearchParams(e.target.value)}
							placeholder= {'직원이름을 검색해 보세요.'}
							onKeyDown={e => {
								if (e.key === 'Enter') changeSearch()
							}}/>
						<Button style={{zIndex:0}} onClick={() => changeSearch()}>검색</Button>
					</InputGroup>
				</Col>
			</Row>
		</Fragment>
	)
}

export default EmployeeFilter
