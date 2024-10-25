import Breadcrumbs from '@components/breadcrumbs'
import { Fragment } from "react"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import DataTable from 'react-data-table-component'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from "reactstrap"
import ElectricPowerForm from './ElectricPowerForm'

// 에너지 관리 전력 사용량 등록
const ElectricRegister = () => {
    useAxiosIntercepter()
    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs 
                        breadCrumbTitle='전력 및 발전량 관리' 
                        breadCrumbParent='에너지관리' 
                        breadCrumbParent2='전력사용관리'
                        breadCrumbActive='전력 및 발전량 관리'
                    />
                </div>
			</Row>
			{/* <Row>
				
			</Row> */}
            <Card>
                <ElectricPowerForm
                        // onclick event prop
                />
            </Card>
        </Fragment>
    )
}
export default ElectricRegister
