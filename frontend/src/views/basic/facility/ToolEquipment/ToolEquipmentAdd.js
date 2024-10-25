import { Fragment } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Card, CardBody, CardHeader, CardTitle, Row } from "reactstrap"
import BasicInfoAdd from "./BasicInfoAdd"

const Facility_ToolEquipment_Add = () => {

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='공구비품정보' breadCrumbParent='기본정보' breadCrumbParent2='설비정보관리' breadCrumbActive='공구비품정보' />
                </div>
            </Row>
            <Card>
                <CardHeader>
                        <CardTitle>공구비품등록</CardTitle>
                </CardHeader>
                <CardBody style={{paddingTop: 0}}>
                    <BasicInfoAdd />
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Facility_ToolEquipment_Add