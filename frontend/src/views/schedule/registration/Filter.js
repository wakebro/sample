import '@styles/react/libs/flatpickr/flatpickr.scss'
import { Fragment, useEffect } from "react"
import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from 'reactstrap'
import { API_EMPLOYEE_CLASS_LIST } from '../../../constants'
import { getTableData, handleKeyPress } from '../../../utility/Utils'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'

const Filter = (props) => {
	useAxiosIntercepter()
	const {searchValue, setSearchValue, classSelect, setClassSelect, classList, setClassList, getDataInit} = props
	
	const getInit = () => {
		getTableData(API_EMPLOYEE_CLASS_LIST, {}, setClassList)
	}

	const searchInput = () => {
		getDataInit()
	}
	useEffect(() => {
		getInit()
	}, [])
	// certificate
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
									/>
								</Col>
							</Row>
						</Col>
						<Col className='mb-1'md={4} xs={12}>
							<Row>
								<Col>
									<InputGroup>
										<Input
											value={searchValue}
											placeholder={'점검일지를 검색해 보세요.'}
											onChange={(e) => setSearchValue(e.target.value)}
											onKeyDown = {(e) => handleKeyPress(e, searchInput)}
											maxLength={250}
										/>
										<Button style={{zIndex:0}} onClick={() => getDataInit()}>검색</Button>
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
export default Filter