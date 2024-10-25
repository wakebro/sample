import { Fragment, useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Modal, ModalBody, ModalFooter, Row, TabContent } from "reactstrap"
import { API_FACILITY_MATERIAL_INFO_DETAIL, API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT, 
    API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT_MAIN_IMG, API_FACILITY_MATERIAL_INFO_DETAIL_EXPORT, 
    API_FACILITY_MATERIAL_INFO_DETAIL_MODAL, API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT, 
    API_FACILITY_MATERIAL_INFO_DETAIL_STOCK, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL, 
    ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST, 
    API_FACILITY_MATERIAL_STOCK_OUTGOING_FORM, 
    URL,
    API_SYSTEMMGMT_BASIC_INFO_PROPERTY} from "../../../../constants"
import { dateFormat, getTableData, pickerDateChange, axiosSweetAlert, sweetAlert, handleDownload, primaryColor, checkOnlyView, axiosDeleteParm } from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import NavTab from "./NavTab"
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import CustomDataTable from "./CustomDataTable"
import MaterialInfoDetailModal from "./RegisterModal"
import MaterialInfoDetailSubMaterialModal from "./ReplacementMaterialRegisterModal"
import ModifyModal from "./ModifyModal"
import axios from "axios"
import * as moment from 'moment'
import ReplacementMaterialModifyModal from "./ReplacementMaterialModifyModal"
import StockModal from "./StockModal"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FileText } from "react-feather"
import Cookies from "universal-cookie"
import { useSelector } from "react-redux"
import { FACILITY_MATERIAL_INFO } from "../../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"

const MySwal = withReactContent(Swal)

const MaterialInfoDetail = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { id } = useParams()
    const cookies = new Cookies()
    const property_id = cookies.get("property").value
    const [subId, setSubId] = useState()
    const [subName, setSubName] = useState()
    const [data, setData] = useState()
    const [mainImg, setMainImg] = useState()
    const [rowId, setRowId] = useState()
    const [detailData, setDetailData] = useState()
    const navigate = useNavigate()
    const { state } = useLocation()
	const [navActive, setNavActive] = useState(state)
    const [show, setShow] = useState(false)
    const [previewModal, setPreviewModal] = useState(false)
    const [material, setMaterial] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    const [isHighProperty, setIsHighProperty] = useState(false)
    const [isProperty, setIsProperty] = useState(false)
    const [isDelMaterial, setIsDelMaterial] = useState(false)

    const togglePreviewModal = () => setPreviewModal(!previewModal)
    const BasicInfoTabList = [
        {value : '입출고내역', label : '입출고내역'},
        {value : '자재이력', label : '자재이력'},
        {value : '자재사진', label : '자재사진'},
        {value : '대체자재', label : '대체자재'}
    ]

    const [previewImage, setPreviewImage] = useState('')
    const handlePreview = (path, uuid) => {
        setPreviewImage(`${path}${uuid}`)
        togglePreviewModal(!previewModal)
    }
    const [picker, setPicker] = useState([moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
    const columns = {
        자재이력: [
            {
                name: '등록일자',
                selector: row => dateFormat(row.create_datetime),
                width: '150px'
            },
            {
                name: '수리 및 기타내역',
                selector: row => row.content,
                conditionalCellStyles: [
                    {
                        when: row => row,
                        style: {
                            display: 'flex',
                            justifyContent: 'flex-start'
                        }
                    }
                ]
            },
            {
                name: '첨부파일',
                width: '250px',
                selector: row => {
                    return (
                        <Fragment>
                                <Row>
                                    <Col md={7} xs={7} title={row.original_file_name}>{row.original_file_name}</Col>
                                    {row.original_file_name ? 
                                    <Col md={5} xs={5} style={{display: 'flex', justifyContent: 'end'}}>
                                        <Button outline onClick={() => handleDownload(`${row.path}${row.uuid}`, row.original_file_name)}>
                                            다운로드</Button>
                                    </Col> : ''}
                                </Row>
                            </Fragment> 
                    )
                }
            },
            {
                name: '등록자',
                selector: row => (row.user ? row.user.name : ''),
                width: '120px'
            }
        ],
        입출고내역: [
            {
                name: '등록일자',
                minWidth: '130px',
                cell: row => dateFormat(row.create_datetime),
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '구분',
                cell: row => (row.quantity < 0 ? '출고' : '입고'),
                width: '80px',
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '입출고수량',
                width: '100px',
                cell: row => <Col style={{textAlign: 'end'}}>{row.quantity ? Math.abs(row.quantity).toLocaleString('ko-KR') : ''}</Col>,
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '단가',
                minWidth: '150px',
                cell: row => <Col style={{textAlign: 'end'}}>{row.unit_price ? `\u{20A9}${row.unit_price.toLocaleString('ko-KR')}` : ''}</Col>,
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '입출고금액',
                minWidth: '200px',
                cell: row => <Col style={{textAlign: 'end'}}>{row.quantity && row.unit_price ? `\u{20A9}${((Math.abs(row.quantity) * row.unit_price).toLocaleString('ko-KR'))}` : ''}</Col>,
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '재고',
                cell: row => <Col style={{textAlign: 'end'}}>{row.stock?.toLocaleString('ko-KR')}</Col>,
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '재고금액',
                cell: row => <Col style={{textAlign: 'end'}}>{row.stock_price ? `\u{20A9}${row.stock_price.toLocaleString('ko-KR')}` : ''}</Col>,
                minWidth: '200px',
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '등록자',
                cell: row => (row.user ? (row.user.name ? row.user.name : '') : ''),
                width: '10%',
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            },
            {
                name: '비고',
                cell: row => row.description,
                conditionalCellStyles: [
                    {
                        when: row => row.quantity < 0,
                        style: {
                            backgroundColor: '#FFF6F6'
                        }
                    }
                ]
            }
        ],
        자재사진: [
            {
                name: '등록일자',
                selector: row => { return dateFormat(row.create_datetime) },
                width: '150px'
            },
            {
                name: '자재사진',
                minWidth: '20rem',
                cell: row => { return <Fragment><Col style={{color: '#FF9228', textDecoration: 'underline'}} onClick={() => handlePreview(row.path, row.uuid)}>{row.original_file_name}</Col>{row.original_file_name ? <Col style={{display: 'flex', justifyContent: 'end'}}><Button outline onClick={() => handleDownload(`${row.path}${row.uuid}`, row.original_file_name)}>다운로드</Button></Col> : ''}</Fragment> }
            }
        ],
        대체자재: [
            {
                name: '등록일자',
                selector: row => { return dateFormat(row.create_datetime) },
                width: '150px'
            },
            {
                name: '대체자재명',
                selector: row => (
                    row.replacement_material ? row.replacement_material.model_no ? 
                    `${row.replacement_material.code} (${row.replacement_material.model_no})` :
                    `${row.replacement_material.code} (미등록)` : 
                    ''
                )
            },
            {
                name: '제작사',
                selector: row => (row.replacement_material ? row.replacement_material.maker : '')
            },
            {
                name: '비고',
                selector: row => row.description
            }
        ]
    }
	const [tableSelect, setTableSelect] = useState([])
    const [modal, setModal] = useState(false)
    const [stockModal, setStockModal] = useState(false)
    const [modifyModal, setModifyModal] = useState(false)
    const [replacementModifyModal, setReplacementModifyModal] = useState(false)
    const [subMaterialModal, setSubMaterialModal] = useState(false)
    const toggle = () => {
        if (navActive !== '대체자재') {
            setModal(!modal)
            return
        }
        setSubMaterialModal(!subMaterialModal)
    }
    const toggleModify = () => (navActive !== '대체자재' ? setModifyModal(!modifyModal) : setSubMaterialModal(!subMaterialModal))
    const toggleReplacementModify = () => setReplacementModifyModal(!replacementModifyModal)
    const toggleStockModal = () => setStockModal(!stockModal)
    const [stock, setStock] = useState(0)
    const [finalUnitPrice, setFinalUnitPrice] = useState(`₩0`)
    const [stockPrice, setStockPrice] = useState(0)
    let API = ''
    if (navActive === '자재이력') {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_MODAL}/${id}`
    } else if (navActive === '자재사진') {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT}/${id}`
    } else if (navActive === '대체자재') {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT}/${id}`
    } else if (navActive === '입출고내역') {
        API = `${API_FACILITY_MATERIAL_INFO_DETAIL_STOCK}/${id}`
    }

    const handleDelete = () => {
        MySwal.fire({
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
        }).then(function (result) {
            if (result.value) {
                const recordIds = tableSelect.map(item => item.id)
                axios.delete(API, {data: {property: property_id, recordIds: recordIds, start_date: picker[0], end_date: picker[1]}})
                .then(res => {
                    if (res.status = '200') {
                        MySwal.fire({
                            title: `${navActive} 삭제 완료`,
                            html: `${navActive} 삭제가 완료되었습니다.`,
                            icon: 'success',
                            heightAuto: false,
                            customClass: {
                                confirmButton: 'btn btn-primary',
                                actions: `sweet-alert-custom center`
                            }
                        }).then(res => {
                            if (res.isConfirmed === true) {
                                setTableSelect([])
                                navigate(`${ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}/${id}`, {state: navActive})
                            }
                        })
                    } else {
                        sweetAlert(`${navActive} 삭제 실패`, `${navActive} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
                    }
                })
            } else {
                MySwal.fire({
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

    const handleModify = () => {
        setRowId(tableSelect[0].id)
        if (navActive === '대체자재') {
            setSubId(tableSelect[0].replacement_material.id)
            setSubName(tableSelect[0].replacement_material.code)
        }
        navActive !== '대체자재' ? toggleModify() : toggleReplacementModify()
    }

    const handleMainImg = () => {
        MySwal.fire({
            icon: "info",
            html: '대표사진으로 등록하시겠습니까?',
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
        }).then((res) => {
            if (res.isConfirmed) {
                axios.put(`${API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT_MAIN_IMG}/${id}`, {selected: tableSelect[0].id})
                .then(res => {
                    setMainImg(res.data)
                    setTableSelect([])
                })
                .catch(res => {
                    console.log(`${API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT_MAIN_IMG}/${id}`, res)
                })

            } else {
                MySwal.fire({
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

    const handleWarning = () => {
        return MySwal.fire({
            title: '입출고내역을 삭제하시겠습니까?',
            text: '해당 메뉴는 최근 하나의 항목씩만 제거가 가능합니다.',
            icon: 'warning',
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
        }).then(function (result) {
            if (result.isConfirmed) {
                axios.delete(`${API_FACILITY_MATERIAL_INFO_DETAIL_STOCK}/${id}`, {data: {property_id : property_id }})
                .then(res => {
                    if (res.status === 200) {
                        axiosSweetAlert(`입출고내역 삭제 완료`, `입출고내역 삭제가 완료되었습니다.`, 'success', 'center', setSubmitResult)
                    } else {
                        sweetAlert(`입출고내역 삭제 실패`, `입출고내역 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
                    }
                })
            } else {
                MySwal.fire({
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

    const handleExport = () => {
        axios.get(`${API_FACILITY_MATERIAL_INFO_DETAIL_EXPORT}/${id}`, {params: {property_id: cookies.get('property').value}})
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
        getTableData(API_FACILITY_MATERIAL_STOCK_OUTGOING_FORM, {property_id: cookies.get('property').value, material_id: id}, setMaterial)

        getTableData(`${API_FACILITY_MATERIAL_INFO_DETAIL}/${id}`, {property: cookies.get('property').value}, (data) => {
            setData(data.data)
            setMainImg(data.main_img)
            data.stock ? setStock(data.stock) : setStock(0)
            setStockPrice(data.stock_price)
            setFinalUnitPrice(data.final_unit_price)
            setShow(true)
            setIsProperty(data?.data?.property === property_id)
            setIsDelMaterial(data?.data?.delete_datetime !== null)
        })
        getTableData(`${API_SYSTEMMGMT_BASIC_INFO_PROPERTY}/${property_id}`, {}, (data) => {
            const tempIsHighProperty = data?.high_property
            if (typeof tempIsHighProperty === 'boolean') setIsHighProperty(tempIsHighProperty)
        })
    }, [])
    
    useEffect(() => {
        setTableSelect([])
        setPicker([moment().subtract(7, 'days').format('YYYY-MM-DD 00:00:00'), moment().format('YYYY-MM-DD 23:59:59')])
    }, [navActive])

    useEffect(() => {
        let API = ''
        if (navActive === '자재이력') {
            API = `${API_FACILITY_MATERIAL_INFO_DETAIL_MODAL}/${id}`
        } else if (navActive === '자재사진') {
            API = `${API_FACILITY_MATERIAL_INFO_DETAIL_ATTACHMENT}/${id}`
        } else if (navActive === '대체자재') {
            API = `${API_FACILITY_MATERIAL_INFO_DETAIL_REPLACEMENT}/${id}`
        } else if (navActive === '입출고내역') {
            API = `${API_FACILITY_MATERIAL_INFO_DETAIL_STOCK}/${id}`
        }
        getTableData(API, {property: property_id, row_id: '', type: navActive, start_date: picker[0], end_date: picker[1]}, setDetailData)
    }, [picker])

    useEffect(() => {
        if (submitResult) navigate(`${ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}/${id}`, {state: '입출고내역'})
    }, [submitResult])

    return (
        <Fragment>
            {data && detailData && show &&
                <>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='자재정보' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                            <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                                <FileText size={14}/>
                                문서변환
                            </Button.Ripple>
                        </div>
                    </Row>
                    <Modal isOpen={previewModal} toggle={togglePreviewModal} previewImage={previewImage} size='lg'>
                        <ModalBody style={{display: 'flex', justifyContent: 'center'}}>
                            <img src={`/static_backend/${previewImage}`} style={{border: '1px solid #151515', maxWidth: '700px', maxHeight: '400px'}} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color='primary' onClick={togglePreviewModal}>확인</Button>
                        </ModalFooter>
                    </Modal>
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                자재현황&nbsp;
                                {isDelMaterial && <span>{'(삭제됨)'}</span>}
                            </CardTitle>
                        </CardHeader>
                        <CardBody className="mb-1" >
                            <Row className="mb-2" style={{marginLeft: 0}}>
                                {mainImg !== '' ?
                                    <Col md='5'style={{padding: 0}}>
                                        <div style={{padding: '5%', border: '0.5px solid #B9B9C3', height: '370px', display: 'flex', justifyContent: 'center'}}>
                                            <img src={`/static_backend/${mainImg.path}${mainImg.uuid}`} style={{width: '50%', objectFit:'contain', border: '#151515'}}></img>
                                        </div>
                                    </Col>
                                    :
                                    <Col className="card_table col text center" md='5' style={{height : '370px', backgroundColor: '#ECE9E9'}}>
                                        자재 이미지를 등록해 주세요.
                                    </Col>
                                }
                                <Col md='7' className="material_mt">
                                    <Row className='card_table mx-0'>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>직종</Col>
                                                {data.employee_class ? 
                                                    <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.employee_class.code}</Col>
                                                    :
                                                    <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.employee_class}</Col>
                                                }
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>자재 코드</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.code}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mx-0'>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>모델명</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.model_no}</Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>구매용 코드</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.order_code}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mx-0'>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>제작사</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.maker}</Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>소유구분</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.own_type}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mx-0'>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>세부규격</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.capacity}</Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>단위</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.unit}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mx-0'>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>재고량</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{`${stock.toLocaleString('ko-KR')}${data?.unit ? data?.unit : ''}`}</Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>안전재고량</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{data.safe_qty ? `${data.safe_qty.toLocaleString('ko-KR')}${data.unit}` : ''}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mx-0'>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>최종단가</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{finalUnitPrice ? `₩${finalUnitPrice.toLocaleString('ko-KR')}` : ''}</Col>
                                            </Row>
                                        </Col>
                                        <Col md='6' xs='12'>
                                            <Row className='card_table table_row' style={{minHeight:'45.875px'}}>
                                                <Col lg='4' md='4' xs='4' className='card_table col col_left col_top text center'>재고금액</Col>
                                                <Col lg='8' md='8' xs='8' className='card_table col text border-xt'>{`₩${stockPrice.toLocaleString('ko-KR')}`}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row className='card_table mx-0 border-b' style={{minHeight:'50px'}}>
                                        <Col md='12' xs='12'>
                                            <Row className='card_table table_row'>
                                                <Col lg='2' md='2' xs='4' className='card_table col col_left col_top text center'>비고</Col>
                                                <Col lg='10' md='10' xs='8' className='card_table col text border-xt'>{data.description}</Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <NavTab tabList={BasicInfoTabList} active={navActive} setActive={setNavActive}/>
                                </Col>
                            </Row>

                            {
                                detailData &&
                                <TabContent activeTab={navActive} style={{border:'1px solid #D8D6DE', overflow:'scroll', width:'100%'}}>
                                    <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                                        { navActive === '자재사진' && (isHighProperty || isProperty) && !isDelMaterial &&
                                            <Col sm='5' xs='12' className="mt-1 material-position" style={{display:'flex', alignItems: 'center'}}>
                                                <Button disabled={tableSelect.length !== 1} outline onClick={() => handleMainImg()}>대표사진 등록</Button>
                                            </Col>
                                        }
                                        <Col className="mt-1 ps-0" sm='1' xs='3' style={{display: 'flex', justifyContent: 'end', alignItems: 'center'}}>
                                            등록일
                                        </Col>
                                        <Col className="mt-1" sm='4' xs='7' style={{padding: 0}}>
                                            <Flatpickr
                                                value={picker}
                                                id='range-picker'
                                                className='form-control'
                                                onChange={date => { if (date.length === 2) setPicker(pickerDateChange(date)) } }
                                                options={{
                                                    mode: 'range',
                                                    ariaDateFormat:'Y-m-d',
                                                    locale: {
                                                        rangeSeparator: ' ~ '
                                                    },
                                                    defaultValue: picker,
                                                    locale: Korean
                                                }}
                                            />
                                        </Col>
                                        <Col className="mt-1" sm='2' xs='12' style={{width: 'auto', marginRight: '1%', display: 'flex', justifyContent: 'center'}}>
                                            {navActive !== '자재사진' && !isDelMaterial && <Button outline className='mx-1' onClick={navActive !== '입출고내역' ? toggle : toggleStockModal}>등록</Button>}
                                            {navActive !== '자재사진' && navActive !== '입출고내역' && !isDelMaterial && <Button disabled={tableSelect.length !== 1} style={{marginRight: '1rem'}} outline onClick={() => handleModify()}>수정</Button>}
                                            {navActive !== '입출고내역' ? 
                                                (navActive === '자재사진') ?
                                                    (isHighProperty || isProperty) && !isDelMaterial && <Button disabled={tableSelect.length === 0} outline onClick={() => handleDelete()}>삭제</Button> 
                                                    :
                                                    !isDelMaterial && <Button disabled={tableSelect.length === 0} outline onClick={() => handleDelete()}>삭제</Button> 
                                                : 
                                                !isDelMaterial && <Button outline disabled={detailData.length === 0}onClick={handleWarning}>삭제</Button> // 입출고내역
                                            }
                                        </Col>
                                    </Row>
                                    <Row className="mt-1">
                                        <CustomDataTable
                                            tableData={detailData}
                                            columns={columns[navActive]}
                                            setTableSelect={setTableSelect}
                                            selectType={navActive !== '입출고내역'}
                                            toggleModify={toggleModify}
                                            setRowId={setRowId}
                                            toggleReplacementModify={toggleReplacementModify}
                                            setSubId={setSubId}
                                            setSubName={setSubName}
                                            mainImg={mainImg}
                                        />
                                    </Row>
                                    <MaterialInfoDetailModal
                                        modal={modal}
                                        toggle={toggle}
                                        navActive={navActive}
                                        id={id}
                                        picker={picker}
                                        setTableSelect={setTableSelect}
                                        material={material}
                                        unit={data.unit}
                                        navigate={navigate}
                                    />
                                    <StockModal
                                        modal={stockModal}
                                        toggle={toggleStockModal}
                                        id={id}
                                        setDetailData={setDetailData}
                                        unit={data.unit}
                                        setStock={setStock}
                                        setStockPrice={setStockPrice}
                                        picker={picker}
                                        setFinalUnitPrice={setFinalUnitPrice}
                                        material={material}
                                        navigate={navigate}
                                    />
                                    {
                                        navActive === '대체자재' && subId && rowId ?
                                        <ReplacementMaterialModifyModal
                                            modifyModal={replacementModifyModal}
                                            toggleModify={toggleReplacementModify}
                                            navActive={navActive}
                                            id={id}
                                            rowId={rowId}
                                            setRowId={setRowId}
                                            detailData={detailData}
                                            subId={subId}
                                            subName={subName}
                                            setSubId={setSubId}
                                            setDetailData={setDetailData}
                                            picker={picker}
                                            setTableSelect={setTableSelect}
                                            setReplacementModifyModal={setReplacementModifyModal}
                                        />
                                        : rowId &&
                                        <ModifyModal
                                            modifyModal={modifyModal}
                                            toggleModify={toggleModify}
                                            navActive={navActive}
                                            id={id}
                                            rowId={rowId}
                                            setRowId={setRowId}
                                            detailData={detailData}
                                            setDetailData={setDetailData}
                                            setTableSelect={setTableSelect}
                                            picker={picker}
                                            navigate={navigate}
                                            material={material}
                                            cookies={cookies}
                                        />
                                    }
                                    { navActive === '대체자재' &&
                                        <MaterialInfoDetailSubMaterialModal
                                            modal={subMaterialModal}
                                            toggle={toggle}
                                            navActive={navActive}
                                            id={id}
                                            detailData={detailData}
                                            setDetailData={setDetailData}
                                            setTableSelect={setTableSelect}
                                            setSubMaterialModal={setSubMaterialModal}
                                        />
                                    }

                                </TabContent>
                            }
                        </CardBody>
                        <CardFooter style={{display:'flex', justifyContent:'end', alignItems:'center'}}>
                            { (isHighProperty || isProperty) && 
                                <>
                                <Button hidden={checkOnlyView(loginAuth, FACILITY_MATERIAL_INFO, 'available_delete')}
                                    color='danger'
                                    disabled={isDelMaterial}
                                    onClick={() => axiosDeleteParm(
                                                        '자재현황', `${API_FACILITY_MATERIAL_INFO_DETAIL}/${id}`, 
                                                        {property: property_id}, 
                                                        ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST, 
                                                        navigate,
                                                        'warning',
                                                        '자재이력이 없다면 삭제되며 이력이 있다면<br/>더 이상 수정 및 내역 추가가 불가능합니다. <br/>정말로 삭제하시겠습니까?'
                                                    )
                                    }>
                                        삭제
                                </Button>
                                <Button hidden={checkOnlyView(loginAuth, FACILITY_MATERIAL_INFO, 'available_update')}
                                    disabled={isDelMaterial}
                                    className="mx-1" color="primary" 
                                    tag={Link} to={ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_FORM} 
                                    state={{type: 'modify', id: id, data: data, stock: stock, mainImg: mainImg}}>
                                        수정
                                </Button>
                                </>
                            }
                            <Button tag={Link} to={ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST}>목록</Button>
                        </CardFooter>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default MaterialInfoDetail