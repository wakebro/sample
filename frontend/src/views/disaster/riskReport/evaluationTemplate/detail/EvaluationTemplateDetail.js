import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Label, Row } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import { evaluationTypeBadge } from "../data"
import { Link, useNavigate, useParams } from "react-router-dom"
import { axiosDeleteParm, checkOnlyView, getTableDataCallback } from "../../../../../utility/Utils"
import { API_DISASTER_TEMPLATE_DETAIL, ROUTE_CRITICAL_DISASTER_EVALUATION } from "../../../../../constants"
import EvaluationItemDetail from "./EvaluationItemDetail"
import { useAxiosIntercepter } from "../../../../../utility/hooks/useAxiosInterceptor"
import { useSelector } from "react-redux"
import { CRITICAL_EVALUATION_TEMPLATE } from "../../../../../constants/CodeList"

const EvaluationTemplateDetail = () => {
    useAxiosIntercepter()
    const { id } = useParams()
    const navigate = useNavigate()

    const loginAuth = useSelector((state) => state.loginAuth)

    // data
    const [data, setData] = useState(null)
    const [title, setTitle] = useState('')
    const [type, setType] = useState('')
    const [itemList, setItemList] = useState([])
    const [pageType, setPageType] = useState('')

    useEffect(() => {
        getTableDataCallback(`${API_DISASTER_TEMPLATE_DETAIL}/${id}`, {}, (data) => {
            setData(data)
            setTitle(data.title)
            setType(data.type)
            setItemList(data.items)
            setPageType(data.page_type)
        })
    }, [])

    const handleClickDelete = () => { // delete button click event
        axiosDeleteParm('위험성평가양식', `${API_DISASTER_TEMPLATE_DETAIL}/${id}`, {}, `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`, navigate)
    }
    
    const handleClickModify = () => { // modify button click event
        navigate(
            `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template/register`, 
            {state: {
                id: id,
                regModType: 'modify',
                type: {label: '수정', value: type}
            }}
        )
    }

    return (
        <Fragment>
            <Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='위험성평가양식' breadCrumbParent='중대재해관리' breadCrumbParent2='위험성평가' breadCrumbActive='위험성평가양식'/>
				</div>
			</Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <Label className='risk-report title-bold d-flex align-items-center'>
                                {title}&nbsp;
                                {evaluationTypeBadge[type]}
                            </Label>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col>
                                    <EvaluationItemDetail
                                        data={data}
                                        type={pageType}
                                        itemList={itemList}
                                    />
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter className="d-flex justify-content-end">
                            <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_delete')}
                                type="button" color="danger" className="me-1" onClick={handleClickDelete}>
                                삭제
                            </Button>
                            <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_update')}
                                type="button" color="primary" className="me-1" onClick={handleClickModify}>
                                수정
                            </Button>
                            <Button 
                                tag={Link} 
                                to={`${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`}
                            >
                                목록
                            </Button>
                        </CardFooter>
                    </Card>
                </Col>
            </Row>

        </Fragment>
    )
}

export default EvaluationTemplateDetail