import { Fragment, useEffect, useState } from "react"
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader } from "reactstrap"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ROUTE_ENERGY_GAUGE_GROUP_FIX, ROUTE_ENERGY_GAUGE_GROUP, API_GAUGE_GROUP_DETAIL } from "../../../constants"
import axios from '../../../utility/AxiosConfig'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { axiosDeleteParm, checkOnlyView } from "../../../utility/Utils"
import { useSelector } from "react-redux"
import { ENERGY_GAUGE_GROUP } from "../../../constants/CodeList"


const Gauge_Detail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const navigate = useNavigate()
    const params = useParams()
    const gauge_id = params.id
    const [data, setData] = useState()

    useEffect(() => {
        axios.get(API_GAUGE_GROUP_DETAIL, { params: {gauge_id: gauge_id} })
        .then((response) => {
            setData(response.data)
          })
          .catch((error) => {
            console.error(error)
          })
	}, [])

    const DeleteData = () => {
        axiosDeleteParm('계량기', API_GAUGE_GROUP_DETAIL, {data:{gauge_id : gauge_id}}, ROUTE_ENERGY_GAUGE_GROUP, navigate)
	}

	return (
    <Fragment>
        <Card>
            <CardHeader>
                <CardTitle className="mb-1">계량기정보</CardTitle>
            </CardHeader>

            <CardBody>
                <Row className="card_table mx-0 border-right" style={{borderTop: '1px solid #B9B9C3'}}>
                    <Col md={6} xs={12} className="border-b">
                        <Row className='card_table table_row'>
                            <Col xs='4' md='4' className='card_table col col_color text center '>직종</Col>
                            <Col xs='8' md='8'className='card_table col'>
                                {data && data.employee_class.code}
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6} xs={12} className="border-b">
                        <Row className='card_table table_row'>
                            <Col xs='4' md='4'  className='card_table col col_color text center '>계량기명</Col>
                            <Col xs='8' md='8' className='card_table col text start '>
                                <Row style={{width:'100%'}}>
                                    <div>{data && data.code}</div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="card_table mid">
                    <Col>
                        <Row className='card_table table_row'>
                            <Col xs='4' md='2'   className='card_table col col_color text center '>비고</Col>
                            <Col xs='8' md='10'  className='card_table col text start '>
                                <Row style={{width:'100%'}}>
                                    <div>{data && data.description}</div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <div className="d-flex justify-content-end mb-2 mt-3" >
                        <Button hidden={checkOnlyView(loginAuth, ENERGY_GAUGE_GROUP, 'available_delete')}
                            style={{ marginRight: '5px'}} color="danger" onClick={DeleteData}>
                            삭제
                        </Button>
                        <Button hidden={checkOnlyView(loginAuth, ENERGY_GAUGE_GROUP, 'available_update')}
                            style={{marginRight: '5px'}} color="primary" tag={Link}
                                to={`${ROUTE_ENERGY_GAUGE_GROUP_FIX}/${gauge_id}`} 
                                                >
                            수정
                        </Button>
                        <Button style={{ marginRight: '20px'}} tag={Link} to={ROUTE_ENERGY_GAUGE_GROUP}>
                            목록
                        </Button>
                    </div>
                </Row>
            </CardBody>
        </Card>
    </Fragment>
	)
}

export default Gauge_Detail