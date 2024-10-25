import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Input, Row } from "reactstrap"
import { useParams } from "react-router-dom"
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT_ADD, ROUTE_BASICINFO_FACILITY_TOOLEQUIPMENT } from "../../../../constants"
import BasicInfoFix from "./BasicinfoFix"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { getTableData } from "../../../../utility/Utils"

const Facility_ToolEquipment_fix = () => {
    useAxiosIntercepter()
    const id = useParams()
    const toolequipment_id = id.id
    const [data, setData] = useState({})

    useEffect(() => {
        getTableData(API_BASICINFO_FACILITY_TOOLEQUIPMENT_DETAIL, {id : toolequipment_id}, setData)
	  }, [])


    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='공구비품정보' breadCrumbParent='기본정보' breadCrumbParent2='설비정보관리' breadCrumbActive='공구비품정보' />
                </div>
            </Row>
            <Card>
                <CardHeader>
                        <CardTitle>공구비품수정</CardTitle>
                </CardHeader>
                <CardBody style={{paddingTop: 0}}>

                {data.toolequipment && (
                    <BasicInfoFix data={data.toolequipment} log={ data.toolequipment_pricelog && data.toolequipment_pricelog} />
                )}
                                    
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default Facility_ToolEquipment_fix