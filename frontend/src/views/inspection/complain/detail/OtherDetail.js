import {Fragment} from "react"
import {
    Row,
    Card,
    Button,
    CardBody,
    Col
} from "reactstrap"
import CustomDataTable from "../../../../components/CustomDataTable"
import {useNavigate} from "react-router-dom"
import {API_INSPECTION_COMPLAIN_DETAIL, ROUTE_INSPECTION_COMPLAIN_FIX, ROUTE_INSPECTION_COMPLAIN} from "../../../../constants"
import {useAxiosIntercepter} from "../../../../utility/hooks/useAxiosInterceptor"
import {axiosDeleteParm, checkOnlyView, formatDateTime} from "../../../../utility/Utils"
import { useSelector } from "react-redux"
import { INSPECTION_COMPLAIN_STATUS } from "../../../../constants/CodeList"

const OtherDetails = (props) => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const WorkColumns = [
        {
            name: "작업자",
            cell: row => row.user.name,
            width: '100px'
        }, {
            name: "직급",
            cell: row => row.user.employee_level && row.user.employee_level.code,
			minwidth: '10%'
        }, {
            name: "직종",
            cell: row => row.user.employee_class && row.user.employee_class.code,
			minwidth: '10%'
        }, {
            name: "작업타입",
            cell: row => row.work_type,
            width: '100px'
        }, {
            name: "작업일시",
            cell: row => formatDateTime(row.work_date),
			minWidth: '180px'
        }, {
            name: "작업시간",
            cell: row => row.work_hour,
			minwidth: '15%'
        }, {
            name: "비고",
            cell: row => row.description,
            width: '421px'
        }
    ]
    const ToolColumns = [
        {
            name: "공구비품코드",
            cell: row => row.toolequipment.code,
            width: '150px'
        }, {
            name: "사용일시",
            cell: row => formatDateTime(row.use_date),
            minwidth: "30%"
        }, {
            name: "사용내역",
            cell: row => row.description,
            minwidth: "30%"
        }
    ]
    const MaterialColumns = [
        {
            name: "구분",
            cell: row => (row.is_rest ? "재고" : "잉여"),
            minwidth: "10%"
        }, {
            name: "자재코드",
            cell: row => row.material.code,
            minwidth: "15%"
        }, {
            name: "사용일",
            cell: row => formatDateTime(row.use_date),
            minwidth: "15%"
        }, {
            name: "사용량",
            cell: row => row.qty,
            minwidth: "10%"
        }, {
            name: "발급단위",
            cell: row => row.material.unit,
            minwidth: "10%"
        }, {
            name: "단가",
            cell: row => (
                <Col style={{textAlign: "end"}}>
                    {" "}
                    {
                        row.is_rest ? row.material.price.toLocaleString("ko-KR") : "-"
                    }{" "}
                </Col>
            ),
            minwidth: "10%"
        }, {
            name: "금액",
            cell: row => (
                <Col style={{textAlign: "end"}}>
                    {" "}
                    {
                        row.is_rest ? (row.material.price * row.qty).toLocaleString("ko-KR") : "-"
                    }{" "}
                </Col>
            ),
            minwidth: "10%"
        }, {
            name: "설명",
            cell: row => row.description,
            minwidth: "20%"
        }
    ]
    const {state, data, complain_id} = props
    const navigate = useNavigate()

    const handleDelete = () => {
        axiosDeleteParm('접수사항', API_INSPECTION_COMPLAIN_DETAIL, {data:{complain_id: complain_id}}, ROUTE_INSPECTION_COMPLAIN, navigate)
    }

    let title = ""

    if (state === "worker") {
        title = "작업자"
    } else if (state === "material") {
        title = "자재"
    } else if (state === "toolequipment") {
        title = "공구비품"
    }

    return (
        <Fragment>
            <Card>
                <Col className="custom-card-header">
                    <div className="custom-create-title">{title}</div>
                </Col>
                <CardBody>
                    <Row>
                        {
                            state === "worker" && data && data.work && (
                                <CustomDataTable tableData={data.work} columns={WorkColumns}/>
                            )
                        }
                        {
                            state === "material" && data && data.material && (
                                <CustomDataTable tableData={data.material} columns={MaterialColumns}/>
                            )
                        }
                        {
                            state === "toolequipment" && data && data.tool && (
                                <CustomDataTable tableData={data.tool} columns={ToolColumns}/>
                            )
                        }
                    </Row>
                    <Col
                        className="d-flex justify-content-end mt-3"
                        style={{
                            paddingRight: "3%",
                            borderTop: "1px solid #B9B9C3"
                        }}>
                        <Button
                            hidden={checkOnlyView(loginAuth, INSPECTION_COMPLAIN_STATUS, 'available_delete')}
                            color="danger"
                            style={{
                                marginTop: "1%",
                                marginRight: "1%"
                            }}
                            onClick={handleDelete}>
                            삭제
                        </Button>
                        <Button
                            hidden={checkOnlyView(loginAuth, INSPECTION_COMPLAIN_STATUS, 'available_update')}
                            color="primary"
                            style={{
                                marginTop: "1%",
                                marginRight: "1%"
                            }}
                            onClick={() => {
                                navigate(`${ROUTE_INSPECTION_COMPLAIN_FIX}/${complain_id}`, {state: state})
                            }}>
                            수정
                        </Button>
                        <Button
                            style={{marginTop: "1%"}}
                            onClick={() => navigate(ROUTE_INSPECTION_COMPLAIN)}>
                            목록
                        </Button>
                    </Col>
                </CardBody>
            </Card>
        </Fragment>
    )
}
export default OtherDetails
