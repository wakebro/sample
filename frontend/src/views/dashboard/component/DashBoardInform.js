import { Card, Col, Row} from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import Cookies from 'universal-cookie'
import { useEffect, useState } from "react"
import { API_DASHBOARD_ANNOUNCE_LATEST } from "@src/constants"
import  DashBoardRollingDiv from './DashBoardRollingDiv'
import { getTableData } from "../../../utility/Utils"

// 대시 보드 공지사항 component
// 공지사항은 롤링 됨.
const DashBoardInform = () => {
    //axios csrf
    useAxiosIntercepter()

    // property 받아오기 위한 쿠키
    const cookies = new Cookies()

    // 공지사항 객체 state
    const [informRows, setInformRows] = useState([])

    // effect
    useEffect(() => {
        const param = {
            property : cookies.get('property').value
        }
        getTableData(API_DASHBOARD_ANNOUNCE_LATEST, param, setInformRows)
	}, [])

    return (
        <Col md={12} xs={12}>
            <Card>
                <Row className="mx-1 my-1">
                    <Col lg={1}>
                        <span className="dashboard-custom-title ">공지사항</span>
                    </Col>
                    <Col lg={9} style={{paddingTop: '4px'}}>
                        <DashBoardRollingDiv 
                            informRows={informRows}
                        />
                    </Col>
                </Row>
            </Card>
        </Col>
    )
}
export default DashBoardInform
