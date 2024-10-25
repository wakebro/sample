import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Input, Row, Label } from "reactstrap"
import { useLocation, useNavigate } from "react-router-dom"
import { Controller, useForm } from "react-hook-form"
import FileUploaderSingle from "./FileUploaderSingle"
import Select from 'react-select'
import { axiosPostPut, getTableData, getCommaDel, AddCommaOnChange, sweetAlert } from "../../../../utility/Utils"
import { API_FACILITY_MATERIAL_INFO_DETAIL, API_FACILITY_MATERIAL_INFO_LIST, API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL, ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST } from "../../../../constants"
import Cookies from "universal-cookie"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import PropertyGroupCheckTable from "../../../apps/cutomTable/PropertyGroupCheckTable"

const ownTypeOptions = [
    {value: '', label: '선택'},
    {value: '운영사', label: '운영사'},
    {value: '건물주', label: '건물주'}
]

const typeOptions = [
    {value: '', label: '선택'},
    {value: '소모성', label: '소모성'},
    {value: '비품성', label: '비품성'}
]

const MaterialInfoForm = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const [clickDeleteOriginFile, setClickDeleteOriginFile] = useState(false)
	// const [checkCode, setCheckCode] = useState(false)
    const cookies = new Cookies()
    const property_id = cookies.get("property").value
    const { state } = useLocation()
    const [files, setFiles] = useState([])
    // const [oldCode, setOldCode] = useState()
    const [employeeClassOptions, setEmployeeClassOptions] = useState([{value: '', label: '선택'}])

    const [isHighProperty, setIsHighProperty] = useState(false)
    const [checkList, setCheckList] = useState(new Set()) 

    const validationSchema = yup.object().shape({
        code: yup.string().required('자재코드를 입력하세요.'),
        safe_qty: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        })
	})
    const [submitResult, setSubmitResult] = useState(false)
    
    const defaultValues = state.type === 'register' ? {
        employeeClass: {value: '', label: '선택'},
        code: '',
        order_code: '',
        ownType: {value: '', label: '선택'},
        capacity: '',
        model_no: '',
        maker: '',
        unit: '',
        safe_qty: '',
        type: {value: '', label: '선택'},
        description: ''
    } : {
        code: state?.data?.code,
        order_code: state?.data?.order_code,
        employeeClass: state?.data?.employee_class ? {value: state?.data?.employee_class?.id, label: state?.data?.employee_class?.code} : {value: '', label: '직종'},
        ownType: ownTypeOptions.find(option => option?.value === state?.data?.own_type),
        capacity: state?.data?.capacity,
        model_no: state?.data?.model_no,
        maker: state?.data?.maker,
        unit: state?.data?.unit,
        safe_qty: state?.data?.safe_qty ? state.data.safe_qty : '',
        type: typeOptions.find(option => option?.value === state?.data.type),
        description: state?.data?.description ? state?.data?.description : ''
    }
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
        trigger
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const onSubmit = (data) => {
        if (isHighProperty && checkList?.size <= 0) {
            sweetAlert('사업소 미선택', '해당 자재를 등록할 사업소를 선택해주세요.', 'warning', 'center')
            return
        }

        const formData = new FormData()
        formData.append('property', cookies.get('property').value ?? '')
        formData.append('code', data?.code ?? '')
        formData.append('employee_class', data?.employeeClass?.value ?? '')
        formData.append('own_type', data?.ownType?.value ?? '')
        formData.append('capacity', data?.capacity ?? '')
        formData.append('model_no', data?.model_no ?? '')
        formData.append('maker', data?.maker ?? '')
        formData.append('unit', data?.unit ?? '')
        formData.append('safe_qty', getCommaDel(data?.safe_qty) ?? '')
        formData.append('type', data?.type?.value ?? '')
        formData.append('order_code', data?.order_code ?? '')
        formData.append('description', data?.description ?? '')
        formData.append('file', files[0] ? files[0] : '')
        formData.append('is_file_del', clickDeleteOriginFile)

        if (isHighProperty) {
            for (const prop of checkList) { // 사업소
                formData.append('property_list', prop)
            }
        } else {
            formData.append('property_list', property_id)
        }

        const API = state.type === 'register' ? `${API_FACILITY_MATERIAL_INFO_DETAIL}/-1`
                                            : `${API_FACILITY_MATERIAL_INFO_DETAIL}/${state.id}`
        axiosPostPut(state.type, '자재정보', API, formData, setSubmitResult)
    }

    useEffect(() => {
        getTableData(`${API_FACILITY_MATERIAL_INFO_LIST}`, 
        {
            property_id: property_id,
            register: true
        }, 
        (data) => {
            const tempIsHighProperty = data?.prop_data?.high_property
            setIsHighProperty(tempIsHighProperty)
            if (state.type === 'register') {
                const groupName = data?.prop_data?.property_group.name
                const nextIdNum = data?.nextId
                const propName = data?.prop_data?.name
                setValue('code', `${groupName}-${propName}-${nextIdNum}`)
            }
        })
        getTableData(API_FACILITY_MATERIAL_INFO_SELECT_OPTIONS, {property_id: cookies.get('property').value, type: 'form'}, setEmployeeClassOptions)

        if (state.type === 'modify') {
            setCheckList(new Set(state?.data?.property_list))
        }
    }, [])

    useEffect(() => {
		if (submitResult) {
			if (state.type === 'register') {
				navigate(ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_LIST)
            } else {
				navigate(`${ROUTE_FACILITYMGMT_MATERIAL_INFORMATION_DETAIL}/${state.id}`, {state: '자재이력'})
			}
		}
	}, [submitResult])

    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='자재정보' breadCrumbParent='시설관리' breadCrumbParent2='자재관리' breadCrumbActive='자재정보' />
                </div>
            </Row>
            <Card>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>자재 등록</CardTitle>
                    </CardHeader>
                    <CardBody className="mb-1">
                        { isHighProperty && 
                            <Row className='mb-2'>
                                <Col>
                                    <Label className="d-flex align-items-center risk-report text-normal">
                                        사업소 선택&nbsp;
                                        <div className='essential_value'/>
                                    </Label>
                                    <PropertyGroupCheckTable
                                        checkList={checkList}
                                        setCheckList={setCheckList}
                                        purpose='highProperty'
                                    />
                                </Col>
                            </Row>
                        }
                        <Row className="mx-0">
                            <Label className="ps-0 d-flex align-items-center risk-report text-normal">
                                {'자재 정보'}
                            </Label>
                            <Col md='5'>
                                <Row style={{border: '0.5px solid #B9B9C3', height: 'auto'}}>
                                    { state.type === 'register' ? (
                                        <FileUploaderSingle
                                            setFiles={setFiles}
                                            files={files}
                                        />
                                    ) : (
                                        <FileUploaderSingle
                                            setFiles={setFiles}
                                            files={files}
                                            updatedfilename={state?.mainImg?.original_file_name}
                                            setClickDeleteOriginFile={setClickDeleteOriginFile}
                                        />
                                    )}
                                </Row>
                                <Row style={{display: 'flex', justifyContent: 'end', padding: '1%'}}>
                                    등록/수정한 사진은 본문 하단 자재사진탭에 자동 저장됩니다.
                                </Row>
                            </Col>
                            <Col md='7'>
                                <Row className='card_table top'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>직종</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='employeeClass'
                                                    name='employeeClass'
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <Select
                                                            name='employeeClass'
                                                            classNamePrefix={'select'}
                                                            className="react-select custom-select-employeeClass custom-react-select"
                                                            options={employeeClassOptions}
                                                            value={value}
                                                            styles={{ menuPortal: base => ({ ...base, zIndex: 10 }) }}
                                                            defaultValue={employeeClassOptions[0]}
                                                            onChange={(e) => setValue('employeeClass', e)}
                                                        />
                                                )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>
                                                <div>자재코드</div>
                                            </Col>
                                            <Controller
                                                id='code'
                                                name='code'
                                                control={control}
                                                render={({ field:{value} }) => (
                                                    <Col className='card_table col text start'>
                                                        <Input disabled value={value} style={{zIndex:0}}/>
                                                    </Col>
                                                )}
                                            />
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>구매용 코드</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='order_code'
                                                    name='order_code'
                                                    control={control}
                                                    render={({ field }) => <Input {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>모델명</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='model_no'
                                                    name='model_no'
                                                    control={control}
                                                    render={({ field }) => <Input {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>세부규격</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='capacity'
                                                    name='capacity'
                                                    control={control}
                                                    render={({ field }) => <Input {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>단위</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='unit'
                                                    name='unit'
                                                    control={control}
                                                    render={({ field }) => <Input {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>제작사</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='maker'
                                                    name='maker'
                                                    control={control}
                                                    render={({ field }) => <Input {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>소유구분</Col>
                                            <Col lg='8' md='8' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='ownType'
                                                    name='ownType'
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <Select
                                                            name='ownType'
                                                            classNamePrefix={'select'}
                                                            className="react-select custom-select-ownType custom-react-select"
                                                            options={ownTypeOptions}
                                                            value={value}
                                                            defaultValue={ownTypeOptions[0]}
                                                            onChange={(e) => setValue('ownType', e)}
                                                        />
                                                )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>재고량</Col>
                                            <Col lg='8' md='810' xs='8' className='card_table col text start'>
                                                <Input disabled value={state.stock?.toLocaleString('ko-KR')}></Input>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col md='6' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>안전재고량</Col>
                                            <Col lg='8' md='810' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='safe_qty'
                                                    name='safe_qty'
                                                    control={control}
                                                    render={({ field: {onChange, value} }) => (
                                                        <Input 
                                                            type="text" 
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={ e => {
                                                                AddCommaOnChange(e, onChange)
                                                                trigger('safe_qty')
                                                            }}/>
                                                        )}
                                                />
                                                {errors.safe_qty && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.safe_qty.message}</div>}
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>타입</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='type'
                                                    name='type'
                                                    control={control}
                                                    render={({ field: { value } }) => (
                                                        <Select
                                                            name='type'
                                                            classNamePrefix={'select'}
                                                            className="react-select custom-select-type custom-react-select"
                                                            options={typeOptions}
                                                            value={value}
                                                            defaultValue={typeOptions[0]}
                                                            onChange={(e) => setValue('type', e)}
                                                        />
                                                )}/>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row className='card_table mid'>
                                    <Col md='12' xs='12'>
                                        <Row className='card_table table_row'>
                                            <Col lg='2' md='2' xs='4' className='card_table col col_color text center'>비고</Col>
                                            <Col lg='10' md='10' xs='8' className='card_table col text start'>
                                                <Controller
                                                    id='description'
                                                    name='description'
                                                    control={control}
                                                    render={({ field }) => <Input type='textarea' {...field}/>}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row style={{display: 'flex', justifyContent: 'end', padding: '1%'}}>
                                    재고량은 본문 하단의 입출고관리 탭에서 수정하실 수 있습니다.
                                </Row>
                            </Col>
                        </Row>
                    </CardBody>
                    <CardFooter style={{display:'flex', justifyContent:'end'}}>
                        <Button color='report' className="mx-1" onClick={() => navigate(-1)}>취소</Button>
                        <Button type='submit' color='primary'>확인</Button>
                    </CardFooter>
                </Form>
            </Card>
        </Fragment>
    )
}

export default MaterialInfoForm