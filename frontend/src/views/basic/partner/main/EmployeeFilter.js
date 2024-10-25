import { Fragment, useEffect, useState } from "react"
import { Button, InputGroup, Input, Row, Col } from 'reactstrap'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { API_BASICINFO_GET_OPTIONS } from '../../../../constants'

import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import axios from '../../../../utility/AxiosConfig'

const EmployeeFilter = (props) => {
	useAxiosIntercepter()
	const {bigOption, setBigOption, midOption, setMidOption, smallOption, setSmallOption, searchcompanyParams, setSearchCompanyParams, changeSearch,
		searchitemParams, setSearchItemParams
	} = props

	const [selectBigOptionList, setselectBigOptionList] = useState([{label: '대분류', value:''}])
	const [selectMidOptionList, setselectMidOptionList] = useState([{label: '중분류', value:''}])
	const [selectSmallOptionList, setselectSmallOptionList] = useState([{label: '소분류', value:''}])

	useEffect(() => {
		axios.get(API_BASICINFO_GET_OPTIONS)
		.then(res => {
			setselectBigOptionList(res.data.big_option)
			setBigOption(selectBigOptionList[0])
			setMidOption(selectMidOptionList[0])
			setSmallOption(selectSmallOptionList[0])
		})
		.catch(() => {
		})
	}, [])

	useEffect(() => {

		axios.get(API_BASICINFO_GET_OPTIONS, { params: {bigOption: bigOption.value}})
		.then(res => {
			setselectMidOptionList(res.data.mid_option)
			setMidOption(selectMidOptionList[0])
			setSmallOption(selectSmallOptionList[0])

		})
		.catch(() => {
		})
	}, [bigOption.value])

	useEffect(() => {
		axios.get(API_BASICINFO_GET_OPTIONS, { params: {midOption: midOption.value}})
		.then(res => {
			setselectSmallOptionList(res.data.small_option)
			setSmallOption(selectSmallOptionList[0])

		})
		.catch(() => {
		})
	}, [midOption.value])

	return (
		<Fragment>
			<Row>
				<Col md='2' className='mb-2'>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={bigOption}
						defaultValue={selectBigOptionList[0]}
						options={selectBigOptionList}
						onChange={(e) => setBigOption(e)}
						isClearable={false}
					/>
				</Col>
				<Col md='2' className='mb-2'>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={midOption}
						defaultValue={selectMidOptionList[0]}
						options={selectMidOptionList}
						onChange={(e) => setMidOption(e)}
						isClearable={false}
					/>
				</Col>
				<Col md='2' className='mb-2'>
					<Select
						// key={selectTableList}
						theme={selectThemeColors}
						className='react-select'
						classNamePrefix='select'
						value={smallOption}
						defaultValue={selectSmallOptionList[0]}
						options={selectSmallOptionList}
						onChange={(e) => setSmallOption(e)}
						isClearable={false}
					/>
				</Col>
				<Col md ='3' className='mb-2'>
					<InputGroup>
						<Input 
							value={searchcompanyParams}
							onChange={(e) => setSearchCompanyParams(e.target.value)}
							placeholder= {'회사명을 검색해 보세요.'}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									changeSearch()
								}
							}}/>						
						<Button 
							style={{zIndex:0}}
							onClick={() => {
								changeSearch()
								}}
						> 검색
						</Button>
					</InputGroup>
				</Col>

				<Col md ='3' className='mb-2'>
					<InputGroup>
						<Input 
							value={searchitemParams}
							onChange={(e) => setSearchItemParams(e.target.value)}
							placeholder= {'취급품목을 검색해 보세요.'}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									changeSearch()
								}
							}}/>
						<Button 
							style={{zIndex:0}}
							onClick={() => {
								changeSearch()
								}}
						> 검색
						</Button>
					</InputGroup>
				</Col>
			</Row>
		</Fragment>
	)
}

export default EmployeeFilter

