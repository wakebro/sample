import { Fragment, useEffect, useState } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import {API_BASICINFO_PARTNER_EVALUATION_LIST, ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_DETAIL, ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_REGISTER } from "../../../../constants"
import CustomDataTable from "../main/IndexDataTable"
import { 
    getTableData
} from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import Cookies from 'universal-cookie'
import EmployeeFilter from "./EmployeeFilter"
import CustomHelpCircle from "../../../apps/CustomHelpCircle"
import moment from "moment"
import { FIRST_HALF, SECOND_HALF, durationList } from "../data"
import { isEmptyObject } from "jquery"
import TotalLabel from "../../../../components/TotalLabel"

const Partner_Management_Evaluation = () => {
		useAxiosIntercepter()
		const [data, setData] = useState([])
		const cookies = new Cookies()
		const currentYear = new Date().getFullYear()
		const property_id = cookies.get('property').value
		const [selectYear, setSelectYear] = useState({label: currentYear.toString(), value:currentYear.toString()})
		const [selectDuration, setSelectDuration] = useState({})
		const [searchParams, setSearchParams] = useState('')

		const basicColumns = [
			{
				name: '주요취급품목',
				cell: row => row.item,
                minWidth: '180px'

			},
            {
				name: '업체명',
				cell: row => row.name
			},
            {
				name: '평가점수',
				cell: row => row.score,
				width: '100px'
			},
		
            {
				name: '평가자의견',
                minWidth: '180px',
				cell: row => row.opinion
			}
		
		]

		const getInit = () => {
			const param = {
				property_id : property_id,
				selectYear: selectYear.value,
				selectDuration: selectDuration.value,
				searchParams: searchParams
			}
			getTableData(API_BASICINFO_PARTNER_EVALUATION_LIST, param, setData)
		}

		const changeSearch = () => getInit()

        /** 상/하반기 설정 */
        const setHalf = () => {
            const today = moment()
            const tempCheck = today.isSameOrBefore(moment(`${today.format('YYYY')}-07`))
            if (tempCheck) setSelectDuration(durationList[FIRST_HALF])
            else setSelectDuration(durationList[SECOND_HALF])
        }

		useEffect(() => {
            setHalf()
			// getInit()
		}, [])
		

		useEffect(() => {
            if (!isEmptyObject(selectDuration) && selectYear.value !== '' && selectDuration.value !== '') getInit()
		}, [selectYear, selectDuration])

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='협력업체평가' breadCrumbParent='기본정보' breadCrumbParent2='협력업체관리' breadCrumbActive='협력업체평가' />
					</div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
							협력업체평가
							<CustomHelpCircle
								id={'partnerEvaluationHelp'}
								content={'협력업체 평가는 상반기, 하반기의 첫달 1일에 자동으로 생성 됩니다.'}
							/>
						</CardTitle>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
						<EmployeeFilter 
							selectYear={selectYear} 
							setSelectYear={setSelectYear} 
							selectDuration={selectDuration} 
							setSelectDuration={setSelectDuration}
							searchParams={searchParams}
							setSearchParams={setSearchParams}
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
								registerAPI={ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_REGISTER}
								detailAPI = {ROUTE_BASICINFO_PARTNER_MANAGEMENT_EVALUATION_DETAIL}
							/>
						</Row>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default Partner_Management_Evaluation
