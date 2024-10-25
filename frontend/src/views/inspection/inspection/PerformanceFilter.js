import { Fragment, useEffect } from "react"
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Select from 'react-select'
import { API_EMPLOYEE_CLASS_LIST } from '../../../constants'
import Cookies from 'universal-cookie'
import { getTableDataModifyFirstIdx, handleKeyPress } from '../../../utility/Utils'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'

const PerformanceFilter = (props) => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const {searchValue, setSearchValue, classSelect, setClassSelect, classList, setClassList, year, setYear, handleSearch, yearList} = props
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
				<Col md={10} >
					<Row>
						<Col className='mb-1'md={3} xs={12}>
							<Row>
								<Col md={3}  xs={3}className="d-flex align-items-center justify-content-center" style={{ padding: 0 }} htmlFor='jobSelect'>직종</Col>
								<Col md={9}  xs={9}>
									<Select
										classNamePrefix={'select'}
										className="react-select"
										options={classList}
										value={classSelect}
										onChange={(e) => setClassSelect(e)}
										styles={{
											container: (provided) => ({
												...provided,
												zIndex: 998 // Select 컴포넌트가 다른 요소들보다 위에 표시되도록 z-index 값 설정
											})
										}}
									/>
								</Col>
							</Row>
						</Col>
						<Col className='mb-1'md={3} xs={12}>
							<Row>
								<Col md={3}  xs={3}className="d-flex align-items-center justify-content-center" style={{ padding: 0 }} htmlFor='jobSelect'>년도</Col>
								<Col  md={9}  xs={9}>
								<Select
									classNamePrefix={'select'}
									className="react-select"
									options={yearList}
									value={year}
									onChange={(e) => setYear(e)}
									styles={{
										container: (provided) => ({
											...provided,
											zIndex: 997 // Select 컴포넌트가 다른 요소들보다 위에 표시되도록 z-index 값 설정
										})
									}}
								/>
											
								</Col>
							</Row>
						</Col>
						<Col className='mb-1'md={4} xs={12}>
							<Row>
								<Col>
									<InputGroup>
										<Input
											maxLength={250}
											value={searchValue}
											placeholder={'점검일지를 검색해 보세요.'}
											onChange={(e) => setSearchValue(e.target.value)}
											onKeyPress = {(e) => handleKeyPress(e, handleClick)}
										/>
										<Button 
											onClick={() => handleClick()}
										>
											검색
										</Button>
									</InputGroup>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
}
export default PerformanceFilter