import { Fragment, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import BuildingBasicInfoCard from "./BuildingBasicInfoCard"
import Tab from "./Tab"
import { useParams } from "react-router-dom"
import axios from "axios"
import EtcTabUpdate from "./EtcTabUpdate"
import EtcTabData from "./EtcTabData"
import { API_SPACE_DETAIL_BUILDING } from "../../../../constants"

const BuildingInfoIndex = () => {
	// const [active, setActive] = useState('')
	const {type} = useParams()
	const [update, setUpdate] = useState(false)
	const [data, setData] = useState({})
	const getHistory = () => {
		axios.get(API_SPACE_DETAIL_BUILDING, {
			params : {id : type}
		})
		.then(res => {
			setData(res.data)
		})
		.catch(() => {

		})
	}
	useEffect(() => {
		getHistory()
	}, [update])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='건물정보' />
				</div>
			</Row>
			<Row style={{height : '100%'}}>
				<Col md='4'>
					<BuildingBasicInfoCard />
				</Col>
				<Col>
					<Row>
						<Tab md='5' id={type} active='etc'></Tab>
					</Row>
					<Row>
                        <Fragment>
                            <Card >
                                <CardHeader>
                                    <CardTitle>
                                        기타정보
                                    </CardTitle>
                                </CardHeader>
                                {update ? 
                                    <EtcTabUpdate data = {data}  update={update} setUpdate={setUpdate} type = {type} />
                                :
                                    <EtcTabData data = {data} update={update} setUpdate={setUpdate} />
                                }
                            </Card>		
                        </Fragment>
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
}

export default BuildingInfoIndex