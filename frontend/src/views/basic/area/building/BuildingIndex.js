import { Fragment, useEffect, useState } from "react"
import { Col, Row, Card, CardHeader, CardTitle } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_SPACE_DETAIL_BUILDING } from '../../../../constants'
import BuildingBasicInfoCard from "./BuildingBasicInfoCard"
import Tab from "./Tab"
import BuildingTabData from "./BuildingTabData"
import BuildingTabUpdate from "./BuildingTabUpdate"
import { useParams } from "react-router-dom"
import axios from "axios"

const BuildingIndex = () => {
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
			console.log(res.data)
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
					<BuildingBasicInfoCard check={update}/>
				</Col>
				<Col>
					<Row>
						<Tab md='5' id={type} active='building-index'></Tab>
					</Row>
					<Row>
						<Fragment>
							<Card >
								<CardHeader>
									<CardTitle>
										건물개요
									</CardTitle>
								</CardHeader>
								{update ? 
									<BuildingTabUpdate data = {data}  update={update} setUpdate={setUpdate} type = {type} />
								:
									<BuildingTabData data = {data} update={update} setUpdate={setUpdate} />
								}
							</Card>		
						</Fragment>
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
}

export default BuildingIndex
