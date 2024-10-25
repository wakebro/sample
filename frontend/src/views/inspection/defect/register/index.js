import { yupResolver } from "@hookform/resolvers/yup"
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Breadcrumbs from '@components/breadcrumbs'
import { Col, Form, Input, Row, Button, FormFeedback, CardTitle, CardBody, Card, CardHeader, Label } from "reactstrap"
import * as yup from 'yup'
import { Link, useNavigate } from "react-router-dom"
import {  API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, ROUTE_INSPECTION_DEFECT, API_MANUAL_REGISTER, API_INSPECTION_DEFECT_REGISTER } from "../../../../constants"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Cookies from 'universal-cookie'
import Select from "react-select"
import { isEmptyObject } from 'jquery'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from 'react-flatpickr'
import FileUploaderSingle from "./FileUploaderSingle"
import { 
    makeSelectList, 
    checkSelectValueObj, 
    checkSelectValue, 
    formatDateTime,
    axiosPostPutNavi,
    setStringDate,
    getTableDataCallback
} from "../../../../utility/Utils"
import { Korean } from "flatpickr/dist/l10n/ko.js"

const DefectRegister = () => {
    useAxiosIntercepter()
    const navigate = useNavigate()
    const cookies = new Cookies()
    const property_id = cookies.get('property').value
    const property_name =  cookies.get('property').label
    const userid = cookies.get('userId')

    const [employeeClassList, setEmployeeClassList] = useState([])
	const [selectError, setSelectError] = useState({emp_class: false})
    const [writer, setWriter] = useState('')
    const [checkDate, setCheckDate] = useState() // 점검일자
    const [repairDate, setRepairDate] = useState()
    const [BeforeImages, setBeforeImages] = useState([])
    const [AfterImages, setAfterImages] = useState([])
    const [relatedMatter, setRelatedMatter] = useState([
        { label: '관리비 증가', value: false },
        { label: '서비스 품질', value: false },
        { label: '안전 사고', value: false },
        { label: '불편사항', value: false },
        { label: '보안', value: false },
        { label: '입주민', value: false },
        { label: '기타', value: false }
      ])
    console.log(relatedMatter)

	const {emp_class} = selectError

    const defaultValues = {
        emp_class: {value:'', label:'선택'},
        name:'', 
        check_datetime:'', 
        location:'', 
        priority: 0, // 중요도 0:중요, 1:경미, 2: 제안
        problem:'',
        expected_loss:'',
        repair_plan:'',
        decision:'',
        description:'',
        repair_user_name:'',
        repair_datetime:'',
        repair_detail:''
    }

    const validationSchema = yup.object().shape({
		location: yup.string().required('위치를 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        check_datetime: yup.array().test('isNonEmpty', '점검일자를 입력해주세요.', function(value) {
			return value
        }).nullable()
        
    })

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues,
        resolver: yupResolver(validationSchema)
    })

    const handleSelectValidation = (e, event) => { 
		checkSelectValue(e, event, selectError, setSelectError, setValue) 
	}

    const handleCheckboxChange = (index) => {
        const updatedMatter = [...relatedMatter]
        updatedMatter[index].value = !updatedMatter[index].value
        setRelatedMatter(updatedMatter)
      }
 
    const onSubmit = (data) => {
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
        const trueValues = relatedMatter.filter(item => item.value).map(item => item.label)
		const formData = new FormData()
		formData.append('prop_id', property_id)
        formData.append('emp_class_id', data.emp_class.value)
        formData.append('check_user_name', writer)
        formData.append('name', data.name)
        formData.append('check_datetime', formatDateTime(checkDate))
        formData.append('location', data.location)
        formData.append('priority', data.priority)
        formData.append('related_matters', trueValues)
        formData.append('problem', data.problem)
        formData.append('expected_loss', data.expected_loss)
        formData.append('repair_plan', data.repair_plan)
        formData.append('decision', data.decision)
        formData.append('description', data.description)
        formData.append('repair_user_name', data.repair_user_name)
        formData.append('repair_datetime', formatDateTime(repairDate) || 'undefined')
        formData.append('repair_detail', data.repair_detail)
        formData.append('before_image', BeforeImages[0])
        formData.append('after_image', AfterImages[0])
        
        // 등록 후 페이지 이동
        axiosPostPutNavi('register', '하자관리', API_INSPECTION_DEFECT_REGISTER, formData, navigate, ROUTE_INSPECTION_DEFECT)
	}
    // onSubmit end

    useEffect(() => {
        getTableDataCallback(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, {property_id: property_id}, (data) => {
			makeSelectList(true, '', data, employeeClassList, setEmployeeClassList, ['name'], 'id')
        })
        getTableDataCallback(API_MANUAL_REGISTER, {user_id: userid}, (data) => { setWriter(data.name) })
	}, [])
    
    useEffect(() => {
        if (!isEmptyObject(errors)) {
            checkSelectValueObj(control, selectError, setSelectError)
        }
    }, [errors])
	return (
    <Fragment>
        <Row>
            <div className='d-flex justify-content-start'>
                <Breadcrumbs breadCrumbTitle='하자관리' breadCrumbParent='시설관리' breadCrumbActive='하자관리' />
            </div>
        </Row>
        <Card>
            <CardHeader>
                <CardTitle>하자관리</CardTitle>
            </CardHeader>
     
            <CardBody>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center '>
                            <div>분류 번호</div>&nbsp;
                            <div className='essential_value'/>
                            </Col>
                            <Col xs='8' className='card_table col text start'>
                                <div>
                                    {property_name}&nbsp;&nbsp;-&nbsp;&nbsp;
                                </div>
                                <Controller
                                        id='emp_class'
                                        name='emp_class'
                                        control={control}
                                        render={({ field: { value } }) => (
                                        <Col xs={6} md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'end'}}>
                                            <Select 
                                                id='emp_class'
                                                name='emp_class'
                                                autosize={true}
                                                className="react-select custom-select-emp_class custom-react-select"
                                                classNamePrefix='select'
                                                options={employeeClassList}
                                                defaultValue={employeeClassList[0]}
                                                value={value}
                                                onChange={handleSelectValidation}
                                            />
                                        {emp_class && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>직종을 선택해주세요.</div>}
                                        </Col>
                                    )}/>                         
                            </Col>
                        </Row>                   </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>점검자</Col>
                            <Col xs='8' className='card_table col text start '>
                                {writer}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4'  className='card_table col col_color text center '>
                                하자명
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='name'
                                    name='name'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={49} invalid={errors.name && true} {...field} />}
                                />
                                {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>
                                점검일자&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                id='check_datetime'
                                name='check_datetime'
                                control={control}
                                render={({ field: {onChange, value} }) => (
                                    <Col lg='12' md='12' xs='12' className='card_table col text center'>
                                        <Row style={{width:'100%'}}>
                                            <Flatpickr
                                                className={`form-control ${errors.check_datetime ? 'is-invalid' : ''}`}
                                                id='default-picker'
                                                placeholder="2023/03/23"
                                                value={value}
                                                onChange={(data) => {
                                                    const newData = setStringDate(data)
                                                    onChange(newData)
                                                    setCheckDate(newData)
                                                    }}
                                                options = {{
                                                    dateFormat: "Y-m-d",
                                                    locale: Korean
                                                }}
                                                    />
                                                {errors.check_datetime && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.check_datetime.message}</div>}
                                        </Row>
                                    </Col>
                                )}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center'>
                            <div>위치</div>&nbsp;
                            <div className='essential_value'/>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='location'
                                    name='location'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.location && true} {...field} />}
                                />
                                {errors.location && <FormFeedback>{errors.location.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                        <Col xs='4'  className='card_table col col_color text center '>중요도</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Col md='4'>
                                    <Controller
                                    id='priority'
                                    name='priority'
                                    control={control}
                                    render={({ field : {onChange, value} }) => (
                                        <Col className='form-check'>
                                        <Input id='priority' value={0} type='radio' checked={value === 0 }
                                        onChange={() => {									
                                            onChange(0)
                                        }}/>
                                        <Label className='form-check-label' for='priority'>
                                        중요
                                        </Label>
                                        
                                        </Col>
                                    )}/>
                                </Col>
                                <Col md='4'>
                                    <Controller
                                    id='priority'
                                    name='priority'
                                    control={control}
                                    render={({ field : {onChange, value} }) => (
                                    <Col className='form-check'>
                                        <Input id='priority' value={1} type='radio' checked={value === 1}
                                        onChange={() => {									
                                        onChange(1)
                                        }}/>
                                        <Label className='form-check-label' for='priority'>
                                        경미
                                        </Label>
                                        
                                    </Col>
                                    )}/>
                                </Col>
                                <Col md='4'>
                                    <Controller
                                    id='priority'
                                    name='priority'
                                    control={control}
                                    render={({ field : {onChange, value} }) => (
                                        <Col className='form-check'>
                                        <Input id='priority' value={2} type='radio' checked={value === 2}
                                        onChange={() => {									
                                            onChange(2)
                                        }}/>
                                        <Label className='form-check-label' for='priority'>
                                        제안
                                        </Label>
                                        
                                        </Col>
                                    )}/>
                                </Col>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                                <div>관련사항</div>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <div className="align-item-center" style={{width:'100%'}}>
                                    {relatedMatter.map((matter, index) => (
                                        <Label key={index} className='form-check-label'  style={{minWidth:'100px'}}>
                                        <Input
                                            style={{marginRight:'10%'}}
                                            type="checkbox"
                                            checked={matter.value}
                                            onChange={() => handleCheckboxChange(index)}
                                        />
                                        {matter.label}
                                        </Label>
                                    ))}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height: '100%' }}>
                            <Col xs='4'  className='card_table col col_color text center '>
                                시공 전 사진
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <FileUploaderSingle
                                    setFiles={setBeforeImages}
                                    files={BeforeImages}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center'  style={{borderBottom: '1px solid #B9B9C3', minHeight:'110px'}}>문제점</Col>
                            <Col xs='8' className='card_table col text start'  style={{borderBottom: '1px solid #B9B9C3'}}>
                                <Controller
                                    id='problem'
                                    name='problem'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' style={{height:'100%'}} type="textarea" invalid={errors.problem && true} {...field} />}
                                />
                                {errors.problem && <FormFeedback>{errors.problem.message}</FormFeedback>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center'  style={{ minHeight:'110px'}}>예상 손해</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='expected_loss'
                                    name='expected_loss'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' style={{height:'100%'}} type="textarea" invalid={errors.expected_loss && true} {...field} />}
                                />
                                {errors.expected_loss && <FormFeedback>{errors.expected_loss.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height: '100%' }}>
                            <Col xs='4'  className='card_table col col_color text center '>
                                시공 후 사진
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <FileUploaderSingle
                                    setFiles={setAfterImages}
                                    files={AfterImages}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center '  style={{borderBottom: '1px solid #B9B9C3', minHeight:'110px'}}>개선 방향</Col>
                            <Col xs='8' className='card_table col text start'  style={{borderBottom: '1px solid #B9B9C3'}}>
                                <Controller
                                    id='repair_plan'
                                    name='repair_plan'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' style={{height:'100%'}} type="textarea" invalid={errors.repair_plan && true} {...field} />}
                                />
                                {errors.repair_plan && <FormFeedback>{errors.repair_plan.message}</FormFeedback>}
                            </Col>
                        </Row>
                        <Row>
                            <Col xs='4'  className='card_table col col_color text center ' style={{minHeight:'110px'}}>결정 사안</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='decision'
                                    name='decision'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' style={{height:'100%'}} type="textarea" invalid={errors.decision && true}  {...field} />}
                                />
                                {errors.decision && <FormFeedback>{errors.decision.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                            <div>비고</div>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='description'
                                    name='description'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' invalid={errors.description && true} {...field} />}
                                />
                                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row style={{height:'100%'}}>
                            <Col xs='4'  className='card_table col col_color text center'>
                            <div>조치자</div>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='repair_user_name'
                                    name='repair_user_name'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={49} invalid={errors.repair_user_name && true} {...field} />}
                                />
                                {errors.repair_user_name && <FormFeedback>{errors.repair_user_name.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>완료일자</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='repair_datetime'
                                    name='repair_datetime'
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                        <Col lg='12' md='12' xs='12' className='card_table col text center'>
                                            <Row style={{width:'100%'}}>
                                                <Flatpickr
                                                    className={`form-control ${errors.repair_datetime ? 'is-invalid' : ''}`}
                                                    id='default-picker'
                                                    placeholder="2023/03/23"
                                                    value={value}
                                                    onChange={(data) => {
                                                        const newData = setStringDate(data)
                                                        onChange(newData)
                                                        setRepairDate(newData)
                                                        }}
                                                    options = {{
                                                        dateFormat: "Y-m-d",
                                                        locale: Korean
                                                    }}
                                                        />
                                                    {errors.repair_datetime && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.repair_datetime.message}</div>}
                                            </Row>
                                        </Col>
                                )}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>
                            <div>처리내용</div>
                            </Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                                <Controller
                                    id='repair_detail'
                                    name='repair_detail'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' invalid={errors.repair_detail && true} {...field} />}
                                />
                                {errors.repair_detail && <FormFeedback>{errors.repair_detail.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col className='d-flex justify-content-end mb-1' style={{paddingRight: '3%'}}>
                        <Button 
                            color='report'
                            style={{marginTop: '1%', marginRight: '1%'}} 
                            tag={Link}
                            to={`${ROUTE_INSPECTION_DEFECT}`}
                            >취소</Button>
                        <Button type='submit' color='primary' style={{marginTop: '1%'}}
                    >확인</Button>
                    </Col>
                </Row>
                </Form>
            </CardBody>
        </Card>
    </Fragment>
	)
}

export default DefectRegister