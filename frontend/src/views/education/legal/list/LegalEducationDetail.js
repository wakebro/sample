import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { FileText } from 'react-feather'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Row } from "reactstrap"
import { API_EDUCATION, API_EDUCATION_DETAIL_EXPORT, API_EDUCATION_DETAIL_PARTICIPANTS, API_EDUCATION_FORM, ROUTE_EDUCATION, URL } from "../../../../constants"
import { EDUCATION_LEGAL } from '../../../../constants/CodeList'
import { axiosDeleteParm, checkOnlyView } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { bigTitleObj, titleObj} from '../../EducationData'

const LegalEducationDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { type, id } = useParams()
    const [data, setData] = useState([])
    const [participants, setParticipants] = useState([])
    const [fileCount, setFileCount] = useState()
    const [pictureCount, setPictureCount] = useState()
    const navigator = useNavigate()

    const handleDownload = (name, orangeName, path) => {
        axios({
            url: `${URL}/static_backend/${path}${(name)}`,
            method: 'GET',
            responseType: 'blob'
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `${orangeName}`)
            document.body.appendChild(link)
            link.click()
        })
    }

    const handleDeleteSubmit = () => {
        axiosDeleteParm(`${titleObj[type]}`, `${API_EDUCATION}/${id}`, {}, `${ROUTE_EDUCATION}/${type}`, navigator)
	}

    const handleExport = () => {
        axios.get(`${API_EDUCATION_DETAIL_EXPORT}/${id}`)
        .then((res) => {
            axios({
                url: res.data.url,
                method: 'GET',
                responseType: 'blob'
            }).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `${res.data.name}`)
                document.body.appendChild(link)
                link.click()
            }).catch((res) => {
                console.log(res)
            })
        })
        .catch(res => {
            console.log(res)
        })
	}

    useEffect(() => {
		axios.get(`${API_EDUCATION}/${id}`)
		.then(res => {
			setData(res.data)
            let count = 0
            let changePictureCount = 0
            res.data.education_files.map((file) => {
                if (file.type === 'file') {
                    count++
                } else {
                    changePictureCount++
                }
            })
            setFileCount(count)
            setPictureCount(changePictureCount)
		})

        axios.get(`${API_EDUCATION_DETAIL_PARTICIPANTS}/${id}`)
		.then(res => {
			setParticipants(res.data)
		})
    }, [])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle={`${bigTitleObj[type]}`} breadCrumbParent='교육관리' breadCrumbParent2='교육' breadCrumbActive={`${titleObj[type]}`} />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
						<FileText size={14}/>
						문서변환
					</Button.Ripple>
                </div>
			</Row>
            <Card>
                <CardHeader>
					<CardTitle className="title">
                        {bigTitleObj[type]}
					</CardTitle>
				</CardHeader>
                {data && participants && (
                    <CardBody>
                        <Row className='card_table top' style={{borderTop:'1px solid #B9B9C3', borderBottom:0}}>
                            <Col md='6' xs='12'>
                                <Row className='card_table table_row' style={{borderBottom:'1px solid #B9B9C3'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>교육명</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.subject}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md='6' xs='12'>
                                <Row className='card_table table_row' style={{borderBottom:'1px solid #B9B9C3'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>교육일자</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <div>{data.start_date}</div>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table top' style={{borderTop:0, borderBottom:0}}>
                            <Col md='6' xs='12'>
                                <Row className='card_table table_row' style={{borderBottom:'1px solid #B9B9C3'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>교육인원</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.target_count} 명</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md='6' xs='12'>
                                <Row className='card_table table_row' style={{borderBottom:'1px solid #B9B9C3'}}>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>교육시간</Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <div>{data.training_time} 시간</div>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table top' style={{borderTop:0, borderBottom:0}}>
                            <Col md='12' xs='12'>
                                <Row className='card_table table_row'  style={{ borderBottom:'1px solid #B9B9C3'}}>
                                    <Col lg='2' md='4' xs='4' className='card_table col col_color text center'>비고</Col>
                                    <Col lg='10' md='8' xs='8' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                <Row style={{width:'100%'}}>
                                                    <div>{data.comment}</div>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row style={{marginTop:'3%', marginBottom:'-1%'}}>
                            <CardTitle className="title">
                                수강자목록
                            </CardTitle>
                        </Row>
                        <Row className='card_table top' style={{borderRight:0}}>
                            <Col md='2' xs='3'>
                                <Row className='card_table table_row'>
                                    <Col lg='12' md='12' xs='12' className='card_table col col_color text center' style={{borderRight:0}}>소속</Col>
                                </Row>
                            </Col>
                            <Col md='10' xs='9'>
                                <Row className='card_table table_row'>
                                    <Col lg='2' md='2' xs='3' className='card_table col col_color text center' style={{borderRight:0}}>직급</Col>
                                    <Col xs={9} md={10} lg={10}>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='3' className='card_table col col_color text center' style={{borderRight:0}}>직종</Col>
                                            <Col lg='10' md='10' xs='9' className='card_table col col_color text center'>이름(아이디)</Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        { participants.map((user) => {
                            return (
                                <Row className='card_table top' style={{borderLeft:'1px solid #B9B9C3'}}>
                                    <Col md='2' xs='3' style={{borderRight:'1px solid #B9B9C3', height:'auto'}}>
                                        <Row className='card_table table_row'>
                                            <Col lg='12' md='12' xs='12' key={user.belong} className='card_table col text center text-break' >
                                                <div>{user.belong}</div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='10' xs='9' style={{borderRight:'1px solid #B9B9C3', height:'auto'}}>
                                        <Row className='card_table table_row'>
                                            <Col lg='12' md='12' xs='12' className='d-flex flex-column'>
                                                {user.level.map((data, idx) => {
                                                    const isLevelLastIndex = idx === user.level.length - 1
                                                    return (
                                                        <Row
                                                            className='card_table table_row'
                                                            style={{
                                                                borderBottom: isLevelLastIndex ? 'none' : '1px solid #B9B9C3',
                                                                textAlign: 'center',
                                                                alignItems: 'center'
                                                            }}>
                                                            <Col xs={3} md={2} lg={2} key={`${idx}-${data.level}`} className='px-0 py-1'>
                                                                {data.level}
                                                            </Col>
                                                            <Col xs={9} md={10} lg={10} style={{height:'100%'}}>
                                                                {data.class.map((classData, classIdx) => {
                                                                    const isLastIndex = classIdx === data.class.length - 1
                                                                    const employeeLength = classData.employee.length
                                                                    return (
                                                                        <>
                                                                        <Row className='px-0 py-0'
                                                                            style={{
                                                                                borderBottom: isLastIndex ? 'none' : '1px solid #B9B9C3',
                                                                                textAlign: 'center',
                                                                                height: 'auto'
                                                                            }}>
                                                                            {/* <Col xs={3} md={2} lg={2} key={`${classIdx}-${data.class}`} className={`px-0 py-1 ${employeeLength > 1 ? 'd-inline-block' : 'd-flex'}`} style={{borderLeft:'1px solid #B9B9C3', alignItems:'center', justifyContent:'center'}}> */}
                                                                            <Col xs={3} md={2} lg={2} key={`${classIdx}-${data.class}`} className={`px-0 py-1 d-flex`} style={{borderLeft:'1px solid #B9B9C3', alignItems:'center', justifyContent:'center'}}>
                                                                                {/* <div key={classData.class} className={`px-0 ${employeeLength > 1 ? 'education-table' : ''}`}>{classData.class}</div> */}
                                                                                <div key={classData.class} className={`px-0`}>{classData.class}</div>
                                                                            </Col>
                                                                            <Col xs={9} md={10} lg={10} className={`py-1 px-0 ${employeeLength > 1 ? 'd-inline-block' : 'd-flex'}`} style={{borderLeft: '1px solid #B9B9C3', alignItems:'center', justifyContent:'center'}}>
                                                                                {classData.employee.map((user) => (
                                                                                    <div key={user} className='px-0'>{user}</div>
                                                                                ))}
                                                                            </Col>
                                                                        </Row>
                                                                        </>
                                                                    )
                                                                })}
                                                            </Col >
                                                        </Row>
                                                    )
                                                })}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            )
                        })}
                        <Row style={{marginTop:'4%', marginBottom:'-2%'}}>
                            <CardTitle className="title" >
                                사진
                            </CardTitle>
                        </Row>
                        <Row style={{marginBottom:'3%', padding:'inherit', marginLeft:'auto'}}>
                        {data.education_files && data.education_files.length > 0  && pictureCount > 0 ? (
                            data.education_files && data.education_files.map((file) => {
                                if (file.type === 'picture') {
                                    return (
                                    <Col md='6' xs='12' style={{display:'flex', justifyContent:'center'}}> 
                                        <Card>
                                            {/* /넣어야함. */}
                                            <img key={file.file_name} src={`/static_backend/${file.path}${file.file_name}`} style={{objectFit: 'scale-down' }} />
                                        </Card>
                                    </Col>

                                    )
                                }
                            })
                            ) : (
                                <Row style={{display:'flex', alignItems:'center', justifyContent:'space-around', paddingRight:0}}>
                                    <Col md='6' xs='12' className="card_table col text center" style={{height: "400px", width: '600px', backgroundColor: '#ECE9E9', display:'flex', justifyContent:'center'}}>
                                        등록된 사진이 없습니다.
                                    </Col>
                                    <Col md='6' xs='12' className="card_table col text center" style={{height: "400px", width: '600px', backgroundColor: '#ECE9E9', display:'flex', justifyContent:'center'}}>
                                        등록된 사진이 없습니다.
                                    </Col>
                                </Row>
                        )}

                        </Row>
                        <Row className='card_table' style={{marginBottom:'1%'}}>
                            <Col style={{borderTop: '3px dotted #ccc'}}>
                            {data.education_files && 
                                <Row style={{marginTop:'4%', marginBottom:'-2%'}}>
                                    <CardTitle className="title">
                                        첨부파일 {fileCount}
                                    </CardTitle>
                                </Row>
                            }
                                {data.education_files && data.education_files.map((file, idx) => {
                                    if (file.type === 'file') {
                                        let imagePath
                                        let file_path = file.original_file_name.split('.').pop()
                                        if (file_path === 'csv') {
                                            file_path = 'xlsx'
                                        } 
                                        try {
                                        imagePath = require(`../../../../assets/images/icons/${file_path}.png`).default
                                        } catch (error) {
                                        imagePath = require('../../../../assets/images/icons/unknown.png').default
                                        }
                                        return (
                                            <div key={idx}>
                                                <a onClick={() => handleDownload(file.file_name, file.original_file_name, file.path)}>
                                                    <img src={imagePath} width='16' height='18' className='me-50' />
                                                    <span className='text-muted fw-bolder align-text-top'>
                                                        {file.original_file_name}
                                                    </span>
                                                </a>
                                            </div>
                                        )
                                    }
                                })}
                        </Col>
                    </Row>
                    <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                        <Fragment >
                            <Button hidden={checkOnlyView(loginAuth, EDUCATION_LEGAL, 'available_delete')}
                                type='button' color="danger" onClick={handleDeleteSubmit}>삭제</Button>
                            <Button hidden={checkOnlyView(loginAuth, EDUCATION_LEGAL, 'available_update')}
                                type='submit' color='primary' 
                                className="ms-1"
                                tag={Link} 
                                to={`${ROUTE_EDUCATION}/${type}/form`} 
                                state={{
                                    title: "법정교육관리",
                                    key: "legalEducation",
                                    API: API_EDUCATION_FORM,
                                    type:'modify',
                                    id: id
                                }}>수정</Button>
                            <Button //color='primary' 
                                className="ms-1"
                                tag={Link} 
                                to={`${ROUTE_EDUCATION}/${type}`}
                                //outline={true}
                                >목록</Button>
                        </Fragment>
                    </CardFooter>
                    </CardBody>
                )}
            </Card>
        </Fragment>
    )

}
export default LegalEducationDetail