import Select from 'react-select'
import { Button, Col, Input, InputGroup, Row } from "reactstrap"

const ModalSearchLow = (props) => {
	const { selectTableList, selectedEmployeeClass, setSelectedEmployeeClass, searchValue, setSearchValue, getListInit } = props

	return (
		<Row style={{justifyContent:'space-between'}}>
			<Col className='mb-1' lg='3' sm='12' xs='12'>
				<Row>
					<Col xs={3} className="d-flex align-items-center justify-content-center" style={{ paddingRight: 0 }}>직종</Col>
					<Col xs={9}>
						<Select
							classNamePrefix={'select'}
							className="react-select"
							options={selectTableList}
							value={selectedEmployeeClass}
							onChange={(e) => {
								setSelectedEmployeeClass(e)
							}}
						/>
					</Col>
				</Row>
			</Col>
			<Col className='mb-1' lg='5' sm='12' xs='12'>
				<InputGroup>
					<Input 
						value={searchValue} 
						onChange={(e) => setSearchValue(e.target.value)}
						placeholder= '사용자명 혹은 아이디를 입력해주세요'
						onKeyDown={e => {
							if (e.key === 'Enter') {
								getListInit()
							}
						}}
					/>
					<Button onClick={() => { getListInit() }}>
						검색
					</Button>
				</InputGroup>
			</Col>
		</Row>
	)
}

export default ModalSearchLow