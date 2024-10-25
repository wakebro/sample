import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import Swal from 'sweetalert2'
import Cookies from "universal-cookie"
import { Fragment, useEffect, useState } from "react"
import { useParams } from 'react-router'
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, Col, Row, CardTitle, Button, CardBody } from "reactstrap"
import {typeObj, listUrlObj, detailUrlObj, typeCodeObj} from '../data'
import Filter from './Filter'
import UtilityCode from './UtilityCode'
import { ROUTE_ENERGY_CODE } from '../../../constants'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import EnergyBasicModalForm from './form/EnergyBasicModalForm'
import { checkOnlyView, getTableData, primaryColor, sweetAlert } from '../../../utility/Utils'
import MagnificationCode from './MagnificationCode'
import UtilityCodeEntry from './UtilityFeeEntry'
import { useSelector } from 'react-redux'
import TotalLabel from '../../../components/TotalLabel'


const EnergyBasicIndex = () => {
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)
    const { typecode } = useParams()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [pageType, setPageType] =  useState('')
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')
    const [detailData, setDetailData] = useState([])
    const [selectBuilding, setSelectBuilding] = useState({ value:'', label: '건물전체'})
    const [buildingListLength, setBuildingListLength] = useState(0)

    const cookies = new Cookies()

    const paramObj = {
        utilitycode: {
            property: cookies.get('property').value,
            search : search
        },
        magnification: {
            property: cookies.get('property').value,
            buildingId : selectBuilding.value
        },
        utilityentry: {
            property: cookies.get('property').value,
            buildingId : selectBuilding.value,
            search : search
        }
    }

    const handleModal = () => {
        if (buildingListLength <= 1 && typecode !== 'utilitycode') { // 측정된 데이터 길이가 0 이면 리다이렉트
            sweetAlert('', '등록된 건물이 없습니다.<br/>건물 등록은 관리자에게 문의 해주세요.', 'warning', 'center')
            return
        }
        setIsOpen(true)
        setPageType('register')
    }

    const handleEditModal = (id) => {
        getTableData(`${detailUrlObj[typecode]}/${id}`, {}, setDetailData)
        setIsOpen(true)
        setPageType('modify')
    }

    const handleDeleteModal = (id) => {
        Swal.fire({
            icon: "warning",
            html: "정말 삭제하시겠습니까?",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "취소",
            // cancelButtonColor : '#FF9F43',
            confirmButtonText: '확인',
            confirmButtonColor : primaryColor,
            reverseButtons :true,
            customClass: {
                actions: 'sweet-alert-custom right',
                cancelButton: 'me-1'
            }
        }).then(function (result) {
            if (result.value) {
                axios.delete(`${detailUrlObj[typecode]}/${id}`)
                .then(res => {
                    if (res.status = '200') {
                        Swal.fire({
                            icon: "success",
                            html: '성공적으로 완료하였습니다.',
                            showCancelButton: true,
                            showConfirmButton: false,
                            cancelButtonText: "확인",
                            cancelButtonColor : primaryColor,
                            reverseButtons :true,
                            customClass: {
                                actions: 'sweet-alert-custom right'
                            }
                        })
                        navigate(`${ROUTE_ENERGY_CODE}/${typecode}`)
                    }
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire({
                    icon: "info",
                    html: "취소하였습니다.",
                    showCancelButton: true,
                    showConfirmButton: false,
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

    const handleSaarch = () => {
        getTableData(listUrlObj[typecode], paramObj[typecode], setData)
    }
    
    if (typecode !== 'utilityentry') {
        useEffect(() => {
            getTableData(listUrlObj[typecode], paramObj[typecode], setData)
        }, [selectBuilding])
    } else {
        useEffect(() => {
            getTableData(listUrlObj[typecode], paramObj[typecode], setData)
        }, [])
    }

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle={typeObj[`${typecode}`]} breadCrumbParent='에너지관리' breadCrumbParent2='기본정보' breadCrumbActive={typeObj[`${typecode}`]}/>
                </div>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>{typeObj[`${typecode}`]}</CardTitle>
							<Button hidden={checkOnlyView(loginAuth, typeCodeObj[`${typecode}`], 'available_create')}
                            color='primary' onClick={() => handleModal()}>등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Filter 
                                typecode={typecode}
                                cookies={cookies}
                                search={search}
                                setSearch={setSearch}
                                handleSaarch={handleSaarch}
                                setSelectBuilding={setSelectBuilding}
                                selectBuilding={selectBuilding}
                                setBuildingListLength={setBuildingListLength}
                            />
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            { typecode === 'utilitycode' &&
                                <UtilityCode 
                                    handleEditModal={handleEditModal}
                                    handleDeleteModal={handleDeleteModal}
                                    data={data}
                                />
                            }
                            { typecode === 'magnification' &&
                                <MagnificationCode 
                                    handleEditModal={handleEditModal}
                                    handleDeleteModal={handleDeleteModal}
                                    data={data}
                                />
                            
                            }
                            { typecode === 'utilityentry' &&
                                <UtilityCodeEntry 
                                    handleEditModal={handleEditModal}
                                    handleDeleteModal={handleDeleteModal}
                                    data={data}
                                />
                            }
                            <EnergyBasicModalForm 
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                typecode={typecode}
                                cookies={cookies}
                                pageType={pageType}
                                setPageType={setPageType}
                                detailData={detailData}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}
export default EnergyBasicIndex