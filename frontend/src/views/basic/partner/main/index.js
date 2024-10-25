import { Fragment, useEffect, useState } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_BASICINFO_PARTNER_LIST, ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL, ROUTE_BASICINFO_PARTNER_MANAGEMENT_REGISTER } from "../../../../constants"
import { Link } from "react-router-dom"
import Select from "react-select"
import CustomDataTable from "./CustomDataTable"
import { getTableData
    //  makeSelectList 
    } from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import EmployeeFilter from "./EmployeeFilter"
import TotalLabel from "../../../../components/TotalLabel"

const Partner_Management = () => {
		useAxiosIntercepter()
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const property_id = cookies.get('property').value
		const [bigOption, setBigOption] = useState({label: '대분류', value:''}) 
		const [midOption, setMidOption] = useState({label: '중분류', value:''})
		const [smallOption, setSmallOption] = useState({label: '소분류', value:''})
		const [searchcompanyParams, setSearchCompanyParams] = useState('')
		const [searchitemParams, setSearchItemParams] = useState('')
		const [category, setCategory] = useState('000000')

		const setCategories = (bigOption, midOption, smallOption) => {
			if (bigOption.value !== '' && midOption.value === '' && smallOption.value === '') {
				setCategory(bigOption.value)
			} else if (midOption.value !== '' && smallOption.value === '') {
				setCategory(midOption.value)
			} else if (smallOption.value !== '') {
				setCategory(smallOption.value)
			} else {
				setCategory('000000')
			}
		}

		const basicColumns = [
			{
				name: '회사명',
				cell: row => row.name
			},
			{
				name: '취급품목',
				selector: row => row.item
			},
			{
				name: '담당자명',
				selector: row => row.contact_name
            },
			{
				name: '연락처',
				selector: row => row.contact_mobile // 핸드폰, 전화번호 중에 뭘 넣어야
			},
			{
				name: '팩스번호',
				selector: row => row.fax
			},
			{
				name: '이메일',
				selector: row => row.email
			},
			{
				name: '비고',
				cell: row => row.description
			}
		]

		const getInit = () => {
			const param = {
				property_id : property_id,
				category: category,
				searchCompany : searchcompanyParams,
				searchitem: searchitemParams
			}
			getTableData(API_BASICINFO_PARTNER_LIST, param, setData)
		}

		const changeSearch = () => {
			getInit()
		}

		useEffect(() => {
			getInit()
		}, [])

		useEffect(() => {
			setCategories(bigOption, midOption, smallOption)
		}, [bigOption, midOption, smallOption])

		useEffect(() => {
			getInit()
		}, [category])

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='협력업체' breadCrumbParent='기본정보' breadCrumbParent2='협력업체관리' breadCrumbActive='협력업체' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
							협력업체
						</CardTitle>
						<Button color='primary' tag={Link}
							to={ROUTE_BASICINFO_PARTNER_MANAGEMENT_REGISTER}
						>등록</Button>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<EmployeeFilter 
							bigOption={bigOption} 
							setBigOption={setBigOption} 
							midOption={midOption} 
							setMidOption={setMidOption}
							smallOption={smallOption}
							setSmallOption = {setSmallOption}
							searchcompanyParams={searchcompanyParams}
							setSearchCompanyParams={setSearchCompanyParams}
							searchitemParams ={searchitemParams}
							setSearchItemParams = {setSearchItemParams}
							changeSearch={changeSearch}
						/>
						<TotalLabel 
							num={3}
							data={data.length}
						/>
						<Row>
							<CustomDataTable
								tableData={data}
								columns={basicColumns}
								detailAPI={ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default Partner_Management