import { Fragment, useState, useEffect } from "react"
import { Label, Row, Card, Input, CardHeader, Button, CardBody, Col, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { API_CHANGE_STATUS, API_INSPECTION_COMPLAIN_DETAIL, ROUTE_INSPECTION_COMPLAIN, ROUTE_INSPECTION_COMPLAIN_FIX, URL } from "../../../../constants"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import axios from '../../../../utility/AxiosConfig'
import { useNavigate } from "react-router-dom"
import { checkOnlyView, formatDateTime, getTableData, primaryColor, sweetAlert } from "../../../../utility/Utils"
import Swal from "sweetalert2"
import { INSPECTION_COMPLAIN_STATUS } from "../../../../constants/CodeList"
import { useSelector } from "react-redux"

  const ProgressDetail = (props) => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const {data, complain_id, setData} = props
    const navigate = useNavigate()
    const doc_files_path = data.files?.path || null
    const doc_files_url = doc_files_path ? doc_files_path.map(filePath => filePath.replace('static/', '')) : null
    const doc_files_name = data.files?.file_name || null
    const file_extensions = doc_files_path && doc_files_path.map(path => path.split('.').pop())
    const [modal, setModal] = useState(false)
    const defaultStatus = (data && data.complain && data.complain.status) || ''
    const [status, setStatus] = useState('')
    const toggle = () => setModal(!modal)

    const handleDownload = (num) => {
      axios({
          url: `${URL}/static_backend/${(doc_files_url)[num]}`,
          method: 'GET',
          responseType: 'blob'
        }).then((response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${(doc_files_name)[num]}`)
          document.body.appendChild(link)
          link.click()
        })
    }

    const handleDelete = () => {
      if (data.work.length > 0 || data.tool.length > 0 || data.material.length > 0) {
        sweetAlert('', `(작업자:${data.work.length} 자재:${data.material.length} 공구비품:${data.tool.length})<br/> 관련데이터가 존재하여 삭제할 수 없습니다.`, 'warning')
        return false
      }
      
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
      }).then((result) => {
        if (result.isConfirmed) {
          axios.delete(API_INSPECTION_COMPLAIN_DETAIL, { data: { complain_id } })
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: '불편신고 및 작업현황 삭제 완료',
                html: '접수사항이 삭제되었습니다.',
                customClass: {
                  confirmButton: 'btn btn-primary',
                  actions: `sweet-alert-custom center`
                }
              }).then(() => {
                navigate(ROUTE_INSPECTION_COMPLAIN)
              })
            })
            .catch((error) => {
              console.error(error)
              sweetAlert('', '삭제 도중 오류가 발생했습니다.<br/> 다시 시도해주세요.', 'error', 'center')
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          sweetAlert('', '접수사항 삭제가 취소되었습니다.', 'info', 'center')
        }
      })
    }

    const onModalButton = () => {
      toggle()
      const formData = new FormData()
      formData.append('complain_id', complain_id)
      formData.append('status', status)

      axios.put(API_CHANGE_STATUS, formData, {
        headers : {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(() => {
        sweetAlert('', '작업 상태가 변경 되었습니다.', 'success', 'center')
        getTableData(API_INSPECTION_COMPLAIN_DETAIL, {complain_id : complain_id }, setData)

      })
      .catch(error => {
        // 응답 실패 시 처리
        console.error(error) 
      })

    }
    useEffect(() => {
      setStatus(defaultStatus)
    }, [defaultStatus])

    return (
      <Fragment>
        <Card>
          <Row>
            <div className="custom-card-header" style={{fontSize : '22px', color : primaryColor, fontFamily : 'Montserrat,sans-serif', marginRight:'5%'}}>
              접수내용 및 계획
            </div>
          </Row>
          <hr/>
          <Row>
          
            <div className="custom-card-header mb-1" style={{fontSize : '22px', color :'#5E5873', fontWeight:'600', fontFamily : 'Montserrat,sans-serif', marginRight:'5%'}}>
              {data.complain && data.complain.title}
            </div>
          </Row>
          
          <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    업무 구분
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && data.complain.type}
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                      접수 일시
                      </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && formatDateTime(data.complain.request_datetime)}
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    직업직종
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && data.complain.emp_class && data.complain.emp_class.code}

                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    <div></div>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    신청자
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                            {data.complain && data.complain.requester_name}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                      신청자 정보
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    <div style={{width:'100%'}}>
                      {data.complain && data.complain.requester_department && (
                        <Row style={{width:'100%'}}>
                            <div>부서: {data.complain.requester_department}</div>
                        </Row>
                      )}
                      {data.complain && data.complain.requester_mobile && (
                        <Row style={{width:'100%'}}>
                          <div>핸드폰: {data.complain.requester_mobile}</div>
                        </Row>
                      )}
                      {data.complain && data.complain.requester_phone && (
                        <Row style={{width:'100%'}}>
                          <div>연락처: {data.complain.requester_phone}</div>
                        </Row>
                      )}
                    </div>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row' style={{minHeight:'70px'}}>
                    <Col xs='4' md='2'  className='card_table col col_color text center '>
                      접수내용 및 계획
                    </Col>
                    <Col xs='8' md='10' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                        <div style={{whiteSpace:'break-spaces'}}>
                          {data.complain && data.complain.request_description}
                        </div>
                    </Row>

                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0}}>
            <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='12'  className='card_table col col_color text center '>
                      작업대상자
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row' style={{minHeight:'70px'}}>
                    <Col xs='3'  className='card_table col text center ' 
                    style={{borderLeft: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                    {data.complain && data.complain.work_target_user && `${data.complain.work_target_user.name}(${data.complain.work_target_user.username})`}
                    </Col>
                    <Col xs='3'  className='card_table col text center 'style={{borderRight: '1px solid #B9B9C3'}}>
                    {data.complain && data.complain.work_target_user && data.complain.work_target_user.employee_level && data.complain.work_target_user.employee_level.code}
                    </Col>
                    <Col xs='3'  className='card_table col text center 'style={{borderRight: '1px solid #B9B9C3'}}>
                    {data.complain && data.complain.work_target_user && data.complain.work_target_user.employee_class && data.complain.work_target_user.employee_class.code}
                    </Col>
                    <Col xs='3'  className='card_table col text center '>
                    {data.complain && data.complain.work_target_user && data.complain.work_target_user.phone}
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4' md='2'  className='card_table col col_color text center '>
                      첨부파일
                    </Col>
                    <Col xs='8' md='10' className='card_table col text start '>
                    <div style={{ marginTop: '15px', marginBottom:'15px'}}>
                    {doc_files_name && doc_files_name.map((name, index) => {
                    let imagePath
                    try {
                      imagePath = require(`../../../../assets/images/icons/${file_extensions[index]}.png`).default
                    } catch (error) {
                      // 파일을 찾을 수 없는 경우 대체 이미지 경로를 지정
                      imagePath = require('../../../../assets/images/icons/unknown.png').default
                    }
                    return (
                      <div key={index}>
                        <a onClick={() => handleDownload(index)}>
                          <img src={imagePath} width='16' className='me-50' />
                          <span className='text-muted fw-bolder align-text-top'>{name}</span>
                        </a>
                      </div>
                    )
                  })}
                  </div>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4' md='2'  className='card_table col col_color text center '>
                      공사정보
                    </Col>
                    <Col xs='8' md='10' className='card_table col text start' style={{flexDirection:'column'}}>
                        <Col xs='12' className='card_table col text start'>
                            <Col md='2' xs='4'>{data.complain && data.complain.outsourcing_contract && '공사명 :'}</Col>
                            <Col md='10' xs='8'>{data.complain && data.complain.outsourcing_contract && data.complain.outsourcing_contract.name}</Col>
                        </Col>
                        <Col xs='12' className='card_table col text start'>
                            <Col md='2' xs='4'>{data.complain && data.complain.construction_start_date && '예정일자 :'}</Col>
                            <Col md='10' xs='8'>
                                <Col xs='12'>{data.complain && formatDateTime(data.complain.construction_start_date)}</Col>
                                <Col xs='12'>
                                    {data.complain && data.complain.construction_start_date && '~'}
                                    {data.complain && formatDateTime(data.complain.construction_end_date)}
                                </Col>
                            </Col>
                        </Col>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row>
            <div className="custom-card-header mt-2 mb-1" style={{fontSize : '22px', color : primaryColor, fontFamily : 'Montserrat,sans-serif', marginRight:'5%'}}>
              작업 내용
            </div>
          </Row>
  
          <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    작업 상태
                    </Col>
                    <Col xs='8' className='card_table col text start'>
                    {data.complain && data.complain.status &&
                      <div style={{marginRight:'5%'}}>
                        {data.complain && data.complain.status}
                      </div>
                    }
                    <Button hidden={checkOnlyView(loginAuth, INSPECTION_COMPLAIN_STATUS, 'available_update')} color="white" size="sm" style={{borderColor: 'gray', whiteSpace:'nowrap'}} onClick={() => { setModal(!modal) }} >변경 </Button>  
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                      작업 일시
                      </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && formatDateTime(data.complain.working_datetime)}

                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    건물
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    <Row style={{width:'100%'}}>
                        <div>
                          {data.complain && data.complain.building && data.complain.building.name}
                        </div>
                    </Row>

                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                      층/호실
                      </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && data.complain.floor && data.complain.floor.name}
                    {data.complain && data.complain.floor &&  <div>/</div>}
                    {data.complain && data.complain.room && data.complain.room.name}
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4' md='2'  className='card_table col col_color text center '>
                    상세 위치
                    </Col>
                    <Col xs='8' md='10' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                            {data.complain && data.complain.detail_location}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    설비명
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                          {data.complain && data.complain.facility && `${data.complain.facility.name}(${data.complain.facility.code})`}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                      설비 용도
                      </Col>
                    <Col xs='8' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                            {data.complain && data.complain.facility_usage}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4' md='2'  className='card_table col col_color text center '>
                    작업 내용
                    </Col>
                    <Col xs='8' md='10' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div style={{whiteSpace:'break-spaces'}}>
                            {data.complain && data.complain.working_description}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
           
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    문제유형
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                            {data.complain && data.complain.problem_type && data.complain.problem_type.code}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    원인 유형
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                            {data.complain && data.complain.cause_type &&  data.complain.cause_type.code}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4' md='2'  className='card_table col col_color text center '>
                    처리 유형
                    </Col>
                    <Col xs='8' md='10' className='card_table col text start '>
                      <Row style={{width:'100%'}}>
                          <div>
                          {data.complain && data.complain.repair_type &&  data.complain.repair_type.code}
                          </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
           
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    완료타입
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    <Row style={{width:'100%'}}>
                          <div>
                          {data.complain && data.complain.complete_type}
                    </div>
                      </Row>
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    완료일시
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && formatDateTime(data.complain.complete_datetime)}

                    </Col>
                </Row>
            </Col>
          </Row>
          <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    보고일시
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && formatDateTime(data.complain.report_datetime)}

                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    확인자
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && data.complain.confirm_user && `${data.complain.confirm_user.name}(${data.complain.confirm_user.username})`}

                    </Col>
                </Row>
            </Col>
          </Row>
          <Row className="mb-2" style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    안전교육
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                    {data.complain && data.complain.has_education === true ? (
                      <div>예</div>
                    ) : data.complain && data.complain.has_education === false ? (
                      <div>아니오</div>
                    ) : (
                      <div></div>
                    )}
                    </Col>
                </Row>
            </Col>
            <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                <Row className='card_table table_row'>
                    <Col xs='4'  className='card_table col col_color text center '>
                    실행일자
                    </Col>
                    <Col xs='8' className='card_table col text start '>
                      {data.complain && formatDateTime(data.complain.education_start_datetime) }
                      {data.complain && data.complain.education_start_datetime && <div> ~ </div>}
                      {data.complain && formatDateTime(data.complain.education_end_datetime)}
                    </Col>
                </Row>
            </Col>
          </Row>

          <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%', borderTop: '1px solid #B9B9C3'}}>
            <Button hidden={checkOnlyView(loginAuth, INSPECTION_COMPLAIN_STATUS, 'available_delete')} 
                color= 'danger' style={{marginTop: '1%', marginRight: '1%'}}
                    onClick={handleDelete}
            >삭제</Button>
            <Button hidden={checkOnlyView(loginAuth, INSPECTION_COMPLAIN_STATUS, 'available_update')}  
                color='primary' style={{marginTop: '1%', marginRight: '1%'}} onClick={() => { navigate(`${ROUTE_INSPECTION_COMPLAIN_FIX}/${complain_id}`, {state:'progress'}) }}
            >수정</Button>
            <Button style={{marginTop: '1%'}} onClick={() => navigate(ROUTE_INSPECTION_COMPLAIN)}>목록</Button>
          </Col>
        </Card>
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader className="mb-2">작업상태 변경</ModalHeader>
              <ModalBody style={{padding: 0}}>
                <div className="mb-2" style={{marginLeft:'3%'}}>
                  작업상태를 변경하시겠습니까?
                </div>
                <Col xs='12' md='12'>
                  <Row  style={{justifyContent:'start', marginLeft:'3%'}}>
                    <Col xs='4' md='2'>
                      <Col className='form-check'>
                        <Input
                          id='status'
                          value={''}
                          type='radio'
                          checked={status === '접수'}
                          onChange={() => setStatus('접수')}
                        />
                        <Label className='form-check-label' for='status' >
                          접수
                        </Label>
                      </Col>
                    </Col>
                    <Col xs='4' md='2' className="p-0 ">
                      <Col className='form-check'>
                        <Input
                          id='status'
                          value={''}
                          type='radio'
                          checked={status === '진행중'}
                          onChange={() => setStatus('진행중')}
                        />
                        <Label className='form-check-label' for='status'>
                          진행중
                        </Label>
                      </Col>
                    </Col>
                    <Col xs='4' md='2'>
                      <Col className='form-check'>
                        <Input
                          id='status'
                          value={''}
                          type='radio'
                          checked={status === '완료'}
                          onChange={() => setStatus('완료')}
                        />
                        <Label className='form-check-label' for='status'>
                          완료
                        </Label>
                      </Col>
                    </Col>
                  </Row>
                </Col>
              </ModalBody>
            <ModalFooter className='mt-1' style={{display:'flex', justifyContent:'end', alignItems:'center', borderTop: '1px solid #B9B9C3'}}>
                <Button className="mx-1" color='primary' onClick={() => onModalButton()}>확인</Button>
                <Button color='report' onClick={() => toggle()}>취소</Button>
            </ModalFooter>
        </Modal>    
      </Fragment>

  )
  }
  
  
  export default ProgressDetail