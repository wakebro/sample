import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from "react"
import { 
  Row, Col
} from "reactstrap"
import '@styles/react/libs/flatpickr/flatpickr.scss'

import InspectMonthCheckList from './component/InspectMonthCheckList'
import InspectResultBarChart from './component/InspectResultBarChart'
import InspectRegisterTable from './component/InspectRegisterTable'
import InspectComplainBarChart from './component/InspectComplainBarChart'

const InspectionMain = () => {
    return (
      <Fragment>
        <Row>
          <div className='d-flex justify-content-start'>
            <Breadcrumbs breadCrumbTitle='점검현황' breadCrumbParent='점검관리' breadCrumbActive='점검현황' />
          </div>
        </Row>
        <Row>
          {/* 740 480 */}
          <Col lg={6} xs={12}><InspectMonthCheckList/></Col>
          <Col lg={6} xs={12}><InspectResultBarChart/></Col>
        </Row>
        <Row>
          <Col lg={6} xs={12}><InspectRegisterTable/></Col>
          <Col lg={6} xs={12}><InspectComplainBarChart/></Col>
        </Row>
      </Fragment>
      )
}
export default  InspectionMain