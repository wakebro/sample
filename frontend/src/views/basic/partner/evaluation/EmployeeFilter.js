import { selectThemeColors } from '@utils'
import { Fragment, useEffect, useState } from "react"
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import { API_BASICINFO_GET_DURATION } from '../../../../constants'
import axios from '../../../../utility/AxiosConfig'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { durationList } from '../data'

const EmployeeFilter = (props) => {
	useAxiosIntercepter()
	const {selectYear, setSelectYear, selectDuration, setSelectDuration, searchParams, setSearchParams, changeSearch } = props
	const [selectYearList, setSelectYearList] = useState([{label: '년도', value:''}])
	const [selectDurationList] = useState(durationList)


	const getInit = () => {
		axios.get(API_BASICINFO_GET_DURATION, {})
		.then(res => setSelectYearList(res.data))
	}

	useEffect(() => {
		getInit()
	}, [])


	return (
		<Fragment>
			<Row>

				<Col xs='12' md='2' lg='2' className='mb-2'>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectYear}
						options={selectYearList}
						onChange={(e) => setSelectYear(e)}
						isClearable={false}
						menuPortalTarget={document.body} 
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					/>
				</Col>
				<Col xs='12' md='2' lg='2' className='mb-2'>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={selectDuration}
						options={selectDurationList}
						onChange={(e) => setSelectDuration(e)}
						isClearable={false}
						menuPortalTarget={document.body} 
						styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
					/>
				</Col>
				
				<Col md ='4' lg='4' className='mb-2'>
					<InputGroup>
						<Input 
							value={searchParams}
							onChange={(e) => setSearchParams(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') changeSearch()
							}}
							placeholder= {'업체명을 검색해 보세요.'}/>
						<Button onClick={() => changeSearch()}> 검색 </Button>
					</InputGroup>
				</Col>
			</Row>
		</Fragment>
	)
}

export default EmployeeFilter
