import Breadcrumbs from '@components/breadcrumbs'
import winLogoImg from '@src/assets/images/winlogo.png'
import axios from "axios"
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Select from 'react-select'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import Cookies from "universal-cookie"
import CustomDataTable from "../../../../components/CustomDataTable"
import { API_FACILITY_MATERIAL_INFO_LIST, API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_INCOMING_FORM, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_OUTGOING_FORM } from "../../../../constants"
import { FACILITY_MATERIAL_INFO } from "../../../../constants/CodeList"
import { checkOnlyView, checkSelectValue, getTableData, primaryColor } from "../../../../utility/Utils"
import Tab from "./Tab"
import TotalLabel from '../../../../components/TotalLabel'

const ownTypeOptions = [
    {value: '', label: '전체'},
    {value: '운영사', label: '운영사'},
    {value: '건물주', label: '건물주'}
]

const registerOptions = [
    {value: '', label: '(선택)'},
    {value: '자재등록', label: '자재등록'},
    {value: '입고등록', label: '입고등록'},
    {value: '출고등록', label: '출고등록'}
]

const MaterialInfoList = () => {
    const cookies = new Cookies()
    const loginAuth = useSelector((state) => state.loginAuth)
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '전체'}])
    const navigate = useNavigate()
    const [employeeClass, setEmployeeClass] = useState({value: '', label: '전체'})
    const [ownType, setOwnType] = useState({value: '', label: '전체'})
    const [check, setCheck] = useState(false)
    const [search, setSearch] = useState('')
    const [data, setData] = useState()
    const [modal, setModal] = useState(false)
    const [image, setImage] = useState('')
    const [code, setCode] = useState('')
    const [modelNo, setModelNo] = useState('')
    const [selected, setSelected] = useState(registerOptions[0])
    const [registerModal, setRegisterModal] = useState(false)
	const [selectError, setSelectError] = useState({type: false})
	const {type} = selectError


    const handleToggle = (path, uuid, code, model_no) => {
        setCode(code)
        model_no ? setModelNo(model_no) : setModelNo('없음')
        setImage(`/static_backend/${path}${uuid}`)
        setModal(!modal)
    }

    const defaultValue = {
        type: registerOptions[0]
    }

    const {control, setValue, formState: { errors }} = useForm({defaultValue})

    const handleSelectValidation = (e, event) => {
        checkSelectValue(e, event, selectError, setSelectError, setValue)
        setSelected(e)
	}

    const checkSelectValueObj = (control, selectError, setSelectError) => {
        const tempObj = {}
        Object.keys(selectError).map((data) => {
        if (control._formValues[data] === undefined) {
          tempObj[data] = true
          const parentElement = document.querySelector(`.custom-select-${data}`)
          if (parentElement) { // Check if parentElement exists (is not null)
            const childElement = parentElement.querySelector('.select__control')
            childElement.style.borderColor = 'red'
          }
        } else {
          tempObj[data] = false
        }
      })
      setSelectError(tempObj)
        const checkTrueFalse = Object.keys(tempObj).every(key => tempObj[key] === false)
        return checkTrueFalse
    }

    const columns = [
        {
			name: '사업소',
            cell: row => row?.property_name,
            width: '150px'
		},
		{
			name: '직종',
            cell: row => row.employee_class,
            width: '140px'
		},
		{
			name: '자재코드',
			cell: row => {
                if (row?.delete_datetime !== null) {
                    return `[삭제됨] ${row.code}`
                }
                return row.code
            },
            minWidth: '130px'
		},
		{
			name: '모델명',
			cell: row => row.model_no,
            minWidth: '170px'
		},
		{
			name: '세부규격',
			cell: row => row.capacity,
            width: '170px'
		},
		{
			name: '제작사',
            cell: row => row.maker,
            width: '150px'
		},
		{
			name: '소유구분',
            cell: row => row.own_type,
            width: '100px'
		},
		{
			name: '재고',
            cell: row => (`${row.stock.toLocaleString('ko-KR')}${row?.unit}`),
            width: '140px'
		},
		{
			name: '사진',
            cell: row => { 
                console.log(row)
                return row?.material_attachment?.length !== 0 ? 
                    <div 
                        className='custom-table-button' 
                        onClick={() => handleToggle(row?.material_attachment[0]?.path, row?.material_attachment[0]?.uuid, row?.code, row?.model_no)} 
                        style={{width: '100%'}}>보기
                    </div> 
                    : 
                    <div className='custom-table-button-gray'>없음</div> 
                },
            width: '130px',
            conditionalCellStyles: [
                {
                    when: row => row,
                    style: {
                        padding: '0.3%'
                    }
                }
            ]
		}
	]
    const toggleRegister = () => setRegisterModal(!registerModal)

    const handleRoute = () => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

        if (selected.value === '자재등록') {
            navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_FORM, {state: {type: 'register'}})
        } else if (selected.value === '입고등록') {
            navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_INCOMING_FORM, {state: {type: 'register'}})
        } else if (selected.value === '출고등록') {
            navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_OUTGOING_FORM, {state: {type: 'register'}})
        }
    }

    useEffect(() => {
        axios.get(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, {params: {property_id: cookies.get('property').value, type: 'list'}})
        .then(res => setEmployeeClassOptions(res.data))
        .catch(res => console.log(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, res))
    }, [])

    useEffect(() => {
        getTableData(
            API_FACILITY_MATERIAL_INFO_LIST, 
            {
                property_id:cookies.get('property').value, 
                employee_class: employeeClass.value, 
                own_type: ownType.value, 
                search: search, 
                check: check
            },
            setData
        )
    }, [check])

    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
	}, [errors])

    return (
        <Fragment>
            {data && 
                <>
                    <Modal isOpen={modal} toggle={handleToggle} size='lg'>
                        <ModalHeader>자재 사진</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col md='2' xs='3' style={{color: '#5E5873'}}>자재코드</Col>
                                <Col>{code}</Col>
                            </Row>
                            <Row className="mb-2">
                                <Col md='2' xs='3' style={{color: '#5E5873'}}>모델명</Col>
                                <Col>{modelNo}</Col>
                            </Row>
                            <Row>
                                <Col style={{display: 'flex', justifyContent: 'center'}}>
                                    <img src={image} style={{border: '1px solid #151515', maxWidth: '700px', maxHeight: '400px'}}></img>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={() => setModal(!modal)} color='primary'>확인</Button>
                        </ModalFooter>
                    </Modal>
                    <Row>
                        <div className='d-flex justify-content-start'>
                            <Breadcrumbs breadCrumbTitle='자재정보' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                        </div>
                    </Row>
                    <Row className="mb-1">
                        <Col>
                            <Tab md='5' active='info'></Tab>
                        </Col>
                    </Row>
                    <Card>
                        <CardHeader>
                            <CardTitle>자재현황</CardTitle>
                            <Button hidden={checkOnlyView(loginAuth, FACILITY_MATERIAL_INFO, 'available_create')}
                                color='primary' onClick={toggleRegister}>등록</Button>
                            <Modal isOpen={registerModal} toggle={toggleRegister}>
                                <ModalHeader style={{backgroundColor: primaryColor, width: '100%', padding: 0}}>
                                    <Row className='mb-1' style={{display: 'flex', alignItems: 'center'}}>
                                        <Col className='mt-1' style={{width: '-webkit-fill-available', paddingLeft: '6%'}}>
                                            <Row>
                                                <span style={{color: 'white', fontSize: '20px'}}>
                                                    내용 선택<br />
                                                </span>
                                            </Row>
                                            <Row>
                                                <span style={{color: 'white'}}>
                                                    등록하실 내용을 선택해주세요.
                                                </span>
                                            </Row>
                                        </Col>
                                        <Col style={{display: 'flex', justifyContent: 'end', paddingRight: '6%'}}>
                                            <img src={winLogoImg} style={{maxHeight: '85px'}}/> 
                                        </Col>
                                    </Row>
                                </ModalHeader>
                                <ModalBody>
                                    <Row>
                                        <Controller 
                                            name='type'
                                            control={control}
                                            render={({ field: { value } }) => (
                                            <Col style={{ paddingLeft: '1%' }}>
                                                <Select
                                                    name='type'
                                                    classNamePrefix={'select'}
                                                    className="react-select custom-select-type custom-react-select"
                                                    options={registerOptions}
                                                    value={value || selected}
                                                    onChange={ handleSelectValidation }
                                                />
                                                {type && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>등록하실 내용을 선택해주세요.</div>}
                                            </Col>
                                            )} />
                                    </Row>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color='report' onClick={toggleRegister}>취소</Button>
                                    <Button className='ms-1' color='primary' onClick={() => handleRoute()}>확인</Button>
                                </ModalFooter>
                            </Modal>
                        </CardHeader>
                        <CardBody>
                            <Row style={{ display: 'flex'}}>
                                <Col className="mb-1"  md='2'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>직종</Col>
                                        <Col xs='8' style={{ paddingLeft: '1%' }}>
                                            <Select 
                                                id='employeeClass-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                options={employeeClassOptions}
                                                onChange={(e) => setEmployeeClass(e)}
                                                value={employeeClass}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col className="mb-1" md='2'>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
                                        <Col xs='4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 0 }}>소유구분</Col>
                                        <Col xs='8' style={{ paddingLeft: '1%' }}>
                                            <Select
                                                id='ownType-select'
                                                autosize={true}
                                                className='react-select'
                                                classNamePrefix='select'
                                                defaultValue={ownTypeOptions[0]}
                                                options={ownTypeOptions}
                                                onChange={(e) => setOwnType(e)}
                                                value={ownType}
                                            />
                                        </Col>
                                    </div>
                                </Col>
                                <Col className="mb-1" md='3'>
                                    <InputGroup>
                                        <Input 
                                            value={search} 
                                            onChange={(e) => setSearch(e.target.value)} 
                                            placeholder='자재코드를 검색해 보세요.'
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    getTableData(API_FACILITY_MATERIAL_INFO_LIST, {property_id:cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, search: search, check: check}, setData)
                                                }
                                            }}
                                        />
                                        <Button style={{zIndex:0}} onClick={() => getTableData(API_FACILITY_MATERIAL_INFO_LIST, {property_id:cookies.get('property').value, employee_class: employeeClass.value, own_type: ownType.value, search: search, check: check}, setData)}>검색</Button>
                                    </InputGroup>
                                </Col>
                                <Col className="mb-1" style={{display: 'flex', alignItems: 'center'}}>
                                    <Input type="checkbox" style={{border: '1px solid #F48A25', margin: 0}} onChange={(e) => setCheck(e.target.checked)}/><div style={{color: '#F48A25'}}>&nbsp; 재고 없는 품목 제외</div>
                                </Col>
                            </Row>
                            <Row>
                                <TotalLabel 
                                    num={3}
                                    data={data.length}
                                />
                                <Col style={{display: 'flex', justifyContent: 'end'}}>사진칸을 클릭해 등록된 자재 이미지를 확인할 수 있습니다.</Col>
                            </Row>
                            <CustomDataTable
                                tableData={data}
                                columns={columns}
                                detailAPI={ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}
                                state={'입출고내역'}
                            />
                        </CardBody>
                    </Card>
                </>
            }
        </Fragment>
    )
}

export default MaterialInfoList