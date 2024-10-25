import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from "react"
import { Row } from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'

import DashBoardInform from './component/DashBoardInform'
import DashBoardHistogram from './component/DashBoardHistogram'
import DashBoardTable from './component/DashBoardTable'
import DashBoardLinechart from './component/DashBoardLinechart'
import EmergencyAlarm from '../disaster/emergencyAlarm'

const Dashboard = () => {
	useAxiosIntercepter()
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='Home'/>
					<EmergencyAlarm/>
				</div>
			</Row>
			<Row>
				<DashBoardInform/>
			</Row>
			<Row>
				<DashBoardHistogram/>
			</Row>
			<Row>
				<DashBoardTable/>
			</Row>
			<Row>
				<DashBoardLinechart/>
			</Row>
		</Fragment>
	)

}
export default Dashboard