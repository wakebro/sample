import { Fragment, useEffect } from "react"
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from "react-flatpickr"
import Select from 'react-select'
import { API_EMPLOYEE_CLASS_LIST } from '../../../constants'
import Cookies from 'universal-cookie'
import { getTableDataModifyFirstIdx, handleKeyPress } from '../../../utility/Utils'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { Link } from 'react-router-dom'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const completeStateOptions = [
	{label:'전체', value: ''},
	{label:'완료', value: 1},
	{label:'미완료', value: 0},
	{label:'회수', value: 3}
]

const Filter = (props) => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const {
		searchValue, setSearchValue, picker, setPicker, 
		classSelect, setClassSelect, classList, setClassList, 
		handleSearch, listFlag, listLink,
		selectIsComplete, setSelectIsComplete
	} = props
	const getInit = () => {
		const param = {
			prop_id :  cookies.get('property').value
		}
		getTableDataModifyFirstIdx(API_EMPLOYEE_CLASS_LIST, param, setClassList, '전체')
	}

	// 검색 버튼 클릭으로 데이터 출력
	const handleClick = () => {
		handleSearch() // props 형태로 func 받아옴
	}

	useEffect(() => {
		getInit()
	}, [])
	return (
		<Fragment>
			<Row>
				<Col md={12} >
					<Row className="mx-0">
						{ selectIsComplete &&
							<Col className='mb-1'md={2} xs={12}>
								<Row>
									<Col md={3}  xs={3} className="d-flex align-items-center justify-content-center" style={{ padding: 0 }} htmlFor='jobSelect'>
										점검여부
									</Col>
									<Col md={9}  xs={9}>
										<Select
											classNamePrefix={'select'}
											className="react-select"
											options={completeStateOptions}
											value={selectIsComplete}
											onChange={(e) => setSelectIsComplete(e)}
										/>
									</Col>
								</Row>
							</Col>
						}
						{!listFlag &&
							<Col className='mb-1'md={3} xs={12}>
								<Row>
									<Col md={2}  xs={2} className="d-flex align-items-center justify-content-center" style={{ padding: 0 }} htmlFor='jobSelect'>직종</Col>
									<Col md={10}  xs={10}>
										<Select
											classNamePrefix={'select'}
											className="react-select"
											options={classList}
											value={classSelect}
											onChange={(e) => setClassSelect(e)}
										/>
									</Col>
								</Row>
							</Col>
						}
						<Col className='mb-1'md={4} xs={12}>
							<Row>
								<Col md={2} xs={2}className="d-flex align-items-center justify-content-center" style={{ padding: 0 }} htmlFor='jobSelect'>기간</Col>
								<Col md={10} xs={10}>
										<Flatpickr
											value={picker}
											id='range-picker'
											className='form-control '
											onChange={(data) => setPicker(data)}
											options={{
												mode: 'range', 
												// maxDate: now,
												// ariaDateFormat:'Y-m-d',
												locale: {
													rangeSeparator: ' ~ '
												},
												locale: Korean
											}}
										/>
											
								</Col>
							</Row>
						</Col>
						<Col className='mb-1'md={3} xs={12}>
							<Row>
								<Col>
									<InputGroup>
										<Input
											maxLength={98}
											value={searchValue}
											placeholder={ selectIsComplete ? '일지명 또는 일자번호로 검색해주세요.' : '일지명으로 검색해주세요.'}
											onChange={(e) => setSearchValue(e.target.value)}
											onKeyDown = {(e) => handleKeyPress(e, handleClick)}
										/>
										<Button style={{zIndex:0}} onClick={() => { handleClick() }}>검색</Button>
									</InputGroup>
								</Col>
							</Row>
						</Col>
						{listFlag && (
						<Col className='mb-1'md={2} xs={12}>
							<Button
								tag={Link}
								to={listLink}
							>목록</Button>
						</Col>
						)}
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
}
export default Filter