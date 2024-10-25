import Breadcrumbs from '@components/breadcrumbs'
import CustomDataFooterTable from '@views/basic/area/property/CustomDataFooterTable'
import { Fragment, useEffect, useState } from "react"
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { API_SPACE_PROPERTY, ROUTE_BASICINFO_AREA_PROPERTY_DETAIL } from '../../../../constants'

import Cookies from 'universal-cookie'
import { getTableData } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { columns } from '../data'

const PropertyIndex = () => {
	useAxiosIntercepter()
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const cookies = new Cookies()

	const getInit = () => {
		const param = {
			property_id :  cookies.get('property')
		}
		getTableData(API_SPACE_PROPERTY, param, setData)
	}
	

	const dataSum = () => {
		let total = 0
		if (data !== undefined) {
			data.map((item) => {
				total += item.prop_group
			})
		}	
		return total 
	}

	const footer = {prop_group: `합계 : ${dataSum().toLocaleString('ko-KR')}`}

	useEffect(() => {
		getInit()
	}, [])
	
	
	useEffect(() => {
	}, [tableSelect])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='사업소정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='사업소정보' />
				</div>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>
								사업소정보
							</CardTitle>
						</CardHeader>
						<CardBody>
							<CustomDataFooterTable 
								columns={columns.property} 
								tableData={data} 
								setTabelData={setData} 
								setTableSelect={setTableSelect}	
								selectType={false}
								customFooter ={footer}
								detailAPI={ROUTE_BASICINFO_AREA_PROPERTY_DETAIL}
							/>
						</CardBody>
					</Card>
					
				</Col>
			</Row>			
		</Fragment>
	)
}

export default PropertyIndex