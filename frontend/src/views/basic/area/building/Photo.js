import { Fragment } from "react"
import { Col, Row } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import BuildingBasicInfoCard from "./BuildingBasicInfoCard"
import Tab from "./Tab"
import PhotoTab from "./PhotoTab"
import { useParams } from "react-router-dom"

const Photo = () => {
	// const [active, setActive] = useState('')
	const {type} = useParams()
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
				<Col md='8'>
					<Row>
						<Tab md='5' id={type} active='photo'></Tab>
					</Row>
					<Row>
						<PhotoTab/>
					</Row>
				</Col>
			</Row>
		</Fragment>
	)
}

export default Photo