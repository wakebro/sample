import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import {ROUTE_MANUAL_REGISTER, API_MANUAL_LIST, ROUTE_MANUAL_DETAIL, URL } from "../../../constants"
import { Link } from "react-router-dom"
import CustomDataTable from "../../../components/CustomDataTable"
import { checkOnlyView, getTableData, primaryColor } from "../../../utility/Utils"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import axios from '../../../utility/AxiosConfig'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useSelector } from "react-redux"
import { INSPECTION_MANUAL } from "../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../components/TotalLabel"

const Manual = () => {
		useAxiosIntercepter()
        const loginAuth = useSelector((state) => state.loginAuth)
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const property_id = cookies.get('property').value
		const [searchValue, setSearchValue] = useState('')
		const [picker, setPicker] = useState([
			moment().subtract(1, 'months').format('YYYY-MM-DD'),
			moment().format('YYYY-MM-DD')
		]
		)
		const formatDate = (date) => {
			return moment(date).format("YYYY-MM-DD")
		  }

		const handleSearch = (event) => {
			const value = event.target.value
			setSearchValue(value)

		  }

		const basicColumns = [
			{
				name: '제목',
				selector: row => row.subject,
				minWidth: '120px'
			},
			{
				name:'첨부파일',
        		style: {justifyContent: 'left'},
				cell: row => {

					const handleDownload = (num) => {
						const filePath = row.path ? row.path.map(filePath => filePath.replace("static/", "")) : null
						axios({
							url: `${URL}/static_backend/${filePath[num]}`,
							method: 'GET',
							responseType: 'blob'
						  }).then((response) => {
							const url = window.URL.createObjectURL(new Blob([response.data]))
							const link = document.createElement('a')
							link.href = url
							link.setAttribute('download', `${row.files_name[num]}`)
							document.body.appendChild(link)
							link.click()
						  })
					}
						return row.files_name && row.files_name.length > 0 ? (
							
							row.files_name.map((files, i) => (
								<a key={files} href="#" onClick={() => handleDownload(i)} style={{ color: primaryColor, marginRight: '1.4%', textAlign: 'left', display:'contents' }}>
								[{i + 1}] &nbsp;
							  </a>
						 
							))
						  ) : (
							<div></div>
						  )
				}
			},
			{
				name: '등록일',
				selector: row => row.date.split('T')[0],
				width: '150px'
			},
			{
				name: '작성자',
				selector: row => row.writer,
				width: '120px'
			}
		]


		const postSearchData = () => {
			getTableData(API_MANUAL_LIST, {property_id : property_id, picker: picker, searchValue : searchValue }, setData)
		  }

		useEffect(() => {
			getTableData(API_MANUAL_LIST, {property_id : property_id, picker: picker, searchValue : searchValue }, setData)
		}, [])

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='유지관리매뉴얼' breadCrumbParent='점검관리' breadCrumbActive='유지관리매뉴얼' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
						유지관리매뉴얼
						</CardTitle>
						<Button hidden={checkOnlyView(loginAuth, INSPECTION_MANUAL, 'available_create')}
                            color='primary' tag={Link}to={ROUTE_MANUAL_REGISTER}
						>등록</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<Row style={{ display: 'flex', justifyContent:'end'}}>
							<Col className="mb-1" xs='12' md='4'>
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
									<Col xs='1' md='2' className='card_table text facility-center'>기간</Col>
									<Flatpickr
										value={picker}
										id='range-picker'
										className='form-control'
										placeholder='2022/02/09~2023/03/03'
										onChange={(dates) => setPicker(dates.map(formatDate))} // 날짜를 'yyyy-mm-dd' 형식으로 변환
										options={{
										mode: 'range',
										ariaDateFormat:'Y-m-d',
										locale: {
											rangeSeparator: ' ~ '
										},
										locale: Korean,
										defaultValue: picker // 초기값 설정

										}}
									/>								
								</div>
							</Col>
			
							<Col className='mb-1' xs='12' md='3'>
								<InputGroup>
									<Input 
										id='search'
										placeholder='매뉴얼명을 검색해 보세요.'
										value={searchValue}
										maxLength={498}
										onChange={handleSearch}/>
									<Button
										onClick={postSearchData}
									>검색
									</Button>
								</InputGroup>
							</Col>
							<Col />
						</Row>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
						<Row>
							<CustomDataTable
								tableData={data}
								columns={basicColumns}
								detailAPI={ROUTE_MANUAL_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default Manual