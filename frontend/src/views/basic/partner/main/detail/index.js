import { Fragment, useEffect, useState } from "react"
import { Col, Row, Button, CardTitle, Card, CardHeader, CardBody, Label, CardFooter } from "reactstrap"
import { useParams, useNavigate } from "react-router-dom"
import { ROUTE_BASICINFO_PARTNER_MANAGEMENT, API_BASICINFO_PARTNER_REGISTER, API_BASICINFO_PARTNER_DETAIL, ROUTE_BASICINFO_PARTNER_MANAGEMENT_FIX } from "../../../../../constants"
import axios from '../../../../../utility/AxiosConfig'
import Swal from 'sweetalert2'
import { axiosSweetAlert, primaryColor, sweetAlert } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'

const Partner_Management_Detail = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const params = useParams()
	const company_id = params.id
    const [data, setData] = useState()
    const [submitResult, setSubmitResult] = useState(false)

    const handleDelete = () => {
        Swal.fire({
			icon: "warning",
            html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			heightAuto: false,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then(res => {
            if (res.isConfirmed) {
                axios.delete(API_BASICINFO_PARTNER_DETAIL, { data: {company_id : company_id } })
                  .then((res) => {
                    if (res.status === 200) {
                        axiosSweetAlert(`협력업체 삭제`, `협력업체 삭제가 완료되었습니다.`, 'success', 'center', setSubmitResult)

                    } else {
                        sweetAlert(`협력업체 삭제 실패`, `협력업체 삭제가 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning')
                    }
                })
                .catch(() => {
                    sweetAlert(`협력업체 삭제 실패`, `협력업체 삭제가 실패했습니다.<br/>다시한번 확인 해주세요.`, 'warning')
                })
            } else {
                Swal.fire({
                    icon: "info",
                    html: "취소하였습니다.",
                    showCancelButton: true,
                    showConfirmButton: false,
                    heightAuto: false,
                    cancelButtonText: "확인",
                    cancelButtonColor : primaryColor,
                    reverseButtons :true,
                    customClass: {
                        actions: 'sweet-alert-custom right'
                    }
                })
            }
        })
    }
    
    useEffect(() => {
		axios.get(API_BASICINFO_PARTNER_DETAIL, { params: {company_id: company_id} })
		.then(res => setData(res.data))
	}, [])

    useEffect(() => {
        if (submitResult) navigate(ROUTE_BASICINFO_PARTNER_MANAGEMENT)
    }, [submitResult])
    

return (
    <Fragment>
        <Card>
            <CardHeader>  
                <CardTitle className="mb-1">협력업체</CardTitle>
            </CardHeader>
        <CardBody style={{ paddingTop: 0}}>
        <Row>
            <div>
            <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                <Col  xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col md='2' xs='4'  className='card_table col col_color text center '>
                        회사코드
                        </Col>
                        <Col md='10' xs='8' className='card_table col text start '>
                            
                            <Row style={{width:'100%'}}>
                                <div>
                                    {data && data.tableData.code}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>보기설정</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                    {data && data.use_property_group}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>
                        주요취급품목
                        </Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                    {data && data.tableData.item}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>
                        회사명
                        </Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                    {data && data.tableData.name}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>사업자번호</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                    {data && data.tableData.company_number}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>사업자명</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.business_person_name}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>주민등록번호</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.personal_number}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>법인번호</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.coporate_number}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>종목</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.business_item}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>대표자</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.ceo}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>전화번호</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.phone}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>                    
            </Row>
            
            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>업태</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.business_type}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>팩스번호</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.fax}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>주소</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.tableData.address}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>
                <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                    <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center' style={{textAlign:'center'}}>협력업체 구분</Col>
                        <Col xs='8' className='card_table col text start '>
                            <Row style={{width:'100%'}}>
                                <div>
                                {data && data.cooperate_type}
                                </div>
                            </Row>
                        </Col>
                    </Row>
                </Col>                    
            </Row>

            <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>담당자</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.tableData.contact_name}
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>핸드폰</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.tableData.contact_mobile}
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>e-mail</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.tableData.email}
                                    </div>
                                </Row>
 
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>비고</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Row style={{width:'100%'}}>
                                    <div>
                                    {data && data.tableData.description}
                                    </div>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='12'>
                        <Row className='card_table table_row'>
                            <Col xs='4' md='2'  className='card_table col col_color text center' style={{borderBottom: '1px solid #B9B9C3'}}>업체구분</Col>
                            <Col xs='8' md='10' className='card_table col text start p-0 ' style={{ display: 'flex', flexDirection: 'column', textAlign:'left' }}>
                                <div style={{borderBottom: '1px solid #B9B9C3', width:'100%', height:'100%', display: 'flex', alignItems: 'center'}}>
                                    {
                                        data && data.category.map((category, index) => (
                                            <Fragment key={index}>
                                                &nbsp; {index + 1}. &nbsp; 대분류: {category.main_category ? category.main_category.label : '-'} &nbsp; 중분류: {category.middle_category ? category.middle_category.label : '-'} &nbsp; 소분류: {category.sub_category ? category.sub_category.label : '-'}
                                            </Fragment>
                                        ))}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                </div>
            </Row>
        </CardBody>
        <CardFooter className="mt-1">
            <Row>     
                <Col className='d-flex justify-content-end' style={{paddingRight: '3%'}}>
                    <Button color='danger' onClick={handleDelete}>삭제</Button>
                    <Button className='ms-1' color='primary' onClick={() => navigate(`${ROUTE_BASICINFO_PARTNER_MANAGEMENT_FIX}/${company_id}`)}>수정</Button>
                    <Button className='ms-1' onClick={() => navigate(ROUTE_BASICINFO_PARTNER_MANAGEMENT)}>목록</Button>
                </Col>
            </Row>
        </CardFooter>
    </Card>
</Fragment>
	)
}

export default Partner_Management_Detail