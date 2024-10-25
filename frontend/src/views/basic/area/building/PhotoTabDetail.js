import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useState, useEffect } from "react"
import { Button, Card, CardBody, CardFooter, CardTitle, Row, Col, CardHeader } from "reactstrap"
import { useParams } from 'react-router-dom'
import Breadcrumbs from '@components/breadcrumbs'
import BuildingBasicInfoCard from "./BuildingBasicInfoCard"
import { useLocation } from 'react-router'
import { API_SPACE_DETAIL_BUILDING, API_SPACE_DETAIL_BUILDING_PHOTO_DETAIL} from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import PhotoTabData from './PhotoTabData'
import PhotoTabUpdate from './PhotoTabUpdate'
import Tab from "./Tab"

const PhotoTabDetail = () => {
	const { type } = useParams()
	const { state } = useLocation()
	const [update, setUpdate] = useState(false)
	const [data, setData] = useState()
	const getHistory = () => {
		axios.get(API_SPACE_DETAIL_BUILDING_PHOTO_DETAIL, {
			params : {id : state.photo_id}
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
						<Tab md='5' id={type} active='photo'></Tab>
					</Row>
					<Row>
						<Card>
							<CardHeader>
								<CardTitle>
									사진
								</CardTitle>
							</CardHeader>
							<div>
								
								{ data && (
									update ? 
										<PhotoTabUpdate data = {data} update ={update} setUpdate ={setUpdate} type={state.photo_id} />
										:
										<PhotoTabData data = {data} update ={update} setUpdate ={setUpdate}/>
									) 
								}
							</div>
						</Card>
					</Row>
				</Col>
			</Row>

		</Fragment>
	)
}

export default PhotoTabDetail