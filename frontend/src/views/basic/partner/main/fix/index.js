import { yupResolver } from "@hookform/resolvers/yup"
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import * as yup from 'yup'
import { API_BASICINFO_PARTNER_DETAIL, ROUTE_BASICINFO_PARTNER_MANAGEMENT, ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL } from "../../../../../constants"
import axios from '../../../../../utility/AxiosConfig'
import { axiosPostPut, sweetAlert } from "../../../../../utility/Utils"
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import { checkCategory } from "../../data"
import OptionFilter from "../register/OptionFilter"

const Partner_Management_Fix = () => {
    useAxiosIntercepter()
    const params = useParams()
	const company_id = params.id
    const navigate = useNavigate()
    const cookies = new Cookies()
    const property_id = cookies.get('property').value
    const type = 'cooperate'
    const [bigOption, setBigOption] = useState([{ label: '대분류', value: '' }])
    const [midOption, setMidOption] = useState([{label: '중분류', value:''}])
    const [smallOption, setSmallOption] = useState([{label: '소분류', value:''}])
    const [category, setCategory] = useState([])
    const [questionIndex, setQuestionIndex] = useState([0]) // 필터의 개수
    const [submitResult, setSubmitResult] = useState(false)
    
    const createQA = () => {
        return (
          <div style={{width:'100%'}}>
            {questionIndex.map((v, i) => (
              <div className="mb-1" key={v}>
                <OptionFilter
                  itemIndex={v}
                  checkIndex={i} 
                  questionIndex={questionIndex}     
                  setQuestionIndex={setQuestionIndex}
                  bigOption={bigOption[i] || { label: '대분류', value: '' }} 
                  setBigOption={selectedOption => {
                    setBigOption(prevOptions => {
                      const updatedOptions = [...prevOptions]
                      updatedOptions[i] = selectedOption
                      return updatedOptions
                    })
                  }}                  
                  midOption={midOption[i] || { label: '중분류', value: '' }} 
                  setMidOption={selectedOption => {
                    setMidOption(prevOptions => {
                      const updatedOptions = [...prevOptions]
                      updatedOptions[i] = selectedOption
                      return updatedOptions
                    })
                  }}
                  smallOption={smallOption[i] || { label: '소분류', value: '' }}
                  setSmallOption= {selectedOption => {
                    setSmallOption(prevOptions => {
                      const updatedOptions = [...prevOptions]
                      updatedOptions[i] = selectedOption
                      return updatedOptions
                    })
                  }} 
                  deleteBigOption={setBigOption} 
                  deleteMidOption={setMidOption} 
                  deleteSmallOption={setSmallOption} 
                /> 
              </div>
            ))}
          </div>
        )
      }


    const setCategories = (bigOptions, midOptions, smallOptions) => {
        const categories = []
      
        bigOptions.forEach((bigOption, index) => {
          if (bigOption.value !== '' && midOptions[index]?.value === '' && smallOptions[index]?.value === '') {
            categories.push(bigOption.value)
          } else if (midOptions[index]?.value !== '' && smallOptions[index]?.value === '') {
            categories.push(midOptions[index].value)
          } else if (smallOptions[index]?.value !== '') {
            categories.push(smallOptions[index].value)
          } else {
            categories.push('000000')
          }
        })
        setCategory(categories)
      }


    const defaultValues = {
        code:'', //회사코드
        name:'', // 회사명
        // type:'', //협력/건물주 => 협력업체 등록에서는 협력으로 고정
        use_property_group:'', //보기 설정
        item:'', // 주요취급품목
        coporate_number:'', // 법인 번호
        company_number:'', // 사업자 번호
        business_person_name:'', // 사업자명
        ceo:'', // 대표자
        personal_number:'', //주민등록번호
        business_type:'',  // 업태
        business_item:'', //종목
        address:'', // 주소
        contact_name:'',  // 담당자
        contact_mobile:'', // 핸드폰
        phone:'', //전화번호
        email:'', //이메일
        fax:'', //팩스번호
        description:'', //비고
        cooperate_type:'' //협력업체 구분 => 일반/공용

    }

    const validationSchema = yup.object().shape({
		code: yup.string().required('회사코드를 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        item: yup.string().required('취급품목을 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        name: yup.string().required('회사명을 입력해주세요.').min(1, '1자 이상 입력해주세요'),
        email: yup.string().email('email 형식에 맞춰주세요.')
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

    const onSubmit = (data) => {
        if (!checkCategory(bigOption, midOption)) {
            sweetAlert('', `업체구분을 완료 해주세요.`, 'warning', 'center')
            return false
        }
		const formData = new FormData()
        formData.append('company_id', company_id) 
		formData.append('prop_id', property_id) // 사업소 아이디
        formData.append('code', data.code)
        formData.append('name', data.name)
        formData.append('type', type)
        formData.append('use_property_group', data.use_property_group)
        formData.append('item', data.item)
        formData.append('coporate_number', data.coporate_number)
        formData.append('company_number', data.company_number)
        formData.append('business_person_name', data.business_person_name)
        formData.append('ceo', data.ceo)
        formData.append('personal_number', data.personal_number)
        formData.append('business_type', data.business_type)
        formData.append('business_item', data.business_item)
        formData.append('address', data.address)
        formData.append('contact_name', data.contact_name)
        formData.append('contact_mobile', data.contact_mobile)
        formData.append('phone', data.phone)
        formData.append('email', data.email)
        formData.append('fax', data.fax)
        formData.append('description', data.description)
        formData.append('cooperate_type', data.cooperate_type)
        formData.append('category', JSON.stringify(category))

        axiosPostPut('modify', "협력업체", API_BASICINFO_PARTNER_DETAIL, formData, setSubmitResult)
	}


    useEffect(() => {
		axios.get(API_BASICINFO_PARTNER_DETAIL, { params: {company_id: company_id} })
		.then(
			res => {
                setValue('code', res.data.tableData.code)
                setValue('name', res.data.tableData.name)
                setValue('item', res.data.tableData.item ? res.data.tableData.item : '')
                setValue('coporate_number', res.data.tableData.coporate_number)
                setValue('company_number', res.data.tableData.company_number)
                setValue('business_person_name', res.data.tableData.business_person_name)
                setValue('ceo', res.data.tableData.ceo)
                setValue('personal_number', res.data.tableData.personal_number)
                setValue('business_type', res.data.tableData.business_type)
                setValue('business_item', res.data.tableData.business_item)
                setValue('address', res.data.tableData.address)
                setValue('contact_name', res.data.tableData.contact_name)
                setValue('contact_mobile', res.data.tableData.contact_mobile)
                setValue('phone', res.data.tableData.phone)
                setValue('email', res.data.tableData.email)
                setValue('fax', res.data.tableData.fax)
                setValue('description', res.data.tableData.description)
                res.data.category.map((category, i) => {
                    setBigOption((prevOptions) => {
                      const updatedOptions = [...prevOptions]
                      updatedOptions[i] = {
                        label: category.main_category.label,
                        value: category.main_category.value
                      }
                      return updatedOptions
                    })
                    setMidOption((prevOptions) => {
                        const updatedOptions = [...prevOptions]
                        updatedOptions[i] = {
                          label: category.middle_category.label ? category.middle_category.label : midOption[0].label,
                          value: category.middle_category.value ? category.middle_category.value : midOption[0].value
                        }
                        return updatedOptions
                    })
                    setSmallOption((prevOptions) => {
                        const updatedOptions = [...prevOptions]
                        updatedOptions[i] = {
                          label: category.sub_category.label ? category.sub_category.label : smallOption[0].label,
                          value: category.sub_category.value ? category.sub_category.value : smallOption[0].value
                        }
                        return updatedOptions
                    })
                    setQuestionIndex((prevIndex) => {
                        const updatedIndex = [...prevIndex]
                        updatedIndex[i] = i
                        return updatedIndex
                    })
                })
                if (res.data.tableData.use_property_group === true) {
                    setValue('use_property_group', 'all')
                } else {
                    setValue('use_property_group', 'property')
                }
                if (res.data.tableData.cooperate_type === true) {
                    setValue('cooperate_type', 'cooperate')
                } else {
                    setValue('cooperate_type', 'basic')
                }
            })
	}, [])

    useEffect(() => {
        setCategories(bigOption, midOption, smallOption)
	}, [bigOption, midOption, smallOption])

    useEffect(() => {
		if (submitResult) {
            navigate(`${ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL}/${company_id}`)
		}
	}, [submitResult])
    
return (
    <Fragment>
        <Card>
            <CardHeader>  
                <CardTitle className="mb-1">협력업체수정</CardTitle>
            </CardHeader>
        <CardBody style={{ paddingTop: 0}}>
        <Row>
            <div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{marginLeft: 0, marginRight: 0, borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                    <Col  xs='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row>
                            <Col md='2' xs='4'  className='card_table col col_color text center '>
                            <div>회사코드</div>&nbsp;
                            <div className='essential_value'/>
                            </Col>
                            <Col md='10' xs='8' className='card_table col text start '>
                                <Controller
                                    id='code'
                                    name='code'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.code && true} {...field} />}
                                />
                                {errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>보기설정</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    name='use_property_group'
                                    control={control}
                                    render={({ field : {onChange, value} }) => (
                                        <Col className='form-check'>
                                            <Label className='form-check-label' for='viewSetting1'>
                                                전사
                                            </Label>
                                            <Input id='viewSetting1' name='use_property_group' type='radio' checked={value === 'all'} onChange={() => onChange('all')}/>
                                        </Col>
                                )}/>
                                <Controller
                                    name='use_property_group'
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                        <Col className='form-check ms-1'>
                                            <Label className='form-check-label' for='viewSetting2'>
                                                사업소
                                            </Label>
                                            <Input id='viewSetting2' name='use_property_group' type='radio' checked={value === 'property'} onChange={() => onChange('property')}/>
                                        </Col>
                                )}/>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center px-0'>
                                <div>주요취급품목</div>&nbsp;
                                <div className='essential_value'/>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='item'
                                    name='item'
                                    control={control}
                                    render={({ field }) => (
                                        <Col className='card_table col text center' style={{flexDirection:'column'}}>
                                            <Input bsSize='sm' maxLength={254} invalid={errors.item && true} {...field} />
                                            {errors.item && <FormFeedback>{errors.item.message}</FormFeedback>}
                                        </Col>
                                    )}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>
                            <div>회사명</div>&nbsp;
                            <div className='essential_value'/>
                            </Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='name'
                                    name='name'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.name && true} {...field} />}
                                />
                                {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>사업자번호</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='company_number'
                                    name='company_number'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.company_number && true} {...field} />}
                                />
                                {errors.company_number && <FormFeedback>{errors.company_number.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>사업자명</Col>
                            <Col xs='8' className='card_table col text start '>
                            <Controller
                                    id='business_person_name'
                                    name='business_person_name'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.business_person_name && true} {...field} />}
                                />
                                {errors.business_person_name && <FormFeedback>{errors.business_person_name.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>주민등록번호</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='personal_number'
                                    name='personal_number'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.personal_number && true} {...field} />}
                                />
                                {errors.personal_number && <FormFeedback>{errors.personal_number.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>법인번호</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='coporate_number'
                                    name='coporate_number'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.coporate_number && true} {...field} />}
                                />
                                {errors.coporate_number && <FormFeedback>{errors.coporate_number.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>종목</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='business_item'
                                    name='business_item'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.business_item && true} {...field} />}
                                />
                                {errors.business_item && <FormFeedback>{errors.business_item.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>대표자</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='ceo'
                                    name='ceo'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.ceo && true} {...field} />}
                                />
                                {errors.ceo && <FormFeedback>{errors.ceo.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>전화번호</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='phone'
                                    name='phone'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.phone && true} {...field} />}
                                />
                                {errors.phone && <FormFeedback>{errors.phone.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>                    
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>업태</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='business_type'
                                    name='business_type'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.business_type && true} {...field} />}
                                />
                                {errors.business_type && <FormFeedback>{errors.business_type.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>팩스번호</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='fax'
                                    name='fax'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.fax && true} {...field} />}
                                />
                                {errors.fax && <FormFeedback>{errors.fax.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>주소</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='address'
                                    name='address'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.address && true} {...field} />}
                                />
                                {errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center' style={{textAlign:'center'}}>협력업체 구분</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    name='cooperate_type'
                                    control={control}
                                    render={({ field : {onChange, value} }) => (
                                        <Col className='form-check'>
                                            <Label className='form-check-label' for='cooperateType1'>
                                                일반협력
                                            </Label>
                                            <Input id='cooperateType1' name='cooperateType1' type='radio' checked={value === 'basic'} onChange={() => onChange('basic')}/>
                                        </Col>
                                )}/>
                                <Controller
                                    name='cooperate_type'
                                    control={control}
                                    render={({ field: {onChange, value} }) => (
                                        <Col className='form-check ms-1'>
                                            <Label className='form-check-label' for='cooperateType2'>
                                                공용협력
                                            </Label>
                                            <Input id='cooperateType2' name='cooperateType2' type='radio' checked={value === 'cooperate'} onChange={() => onChange('cooperate')}/>
                                        </Col>
                                )}/>
                            </Col>
                        </Row>
                    </Col>                    
                </Row>
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>담당자</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='contact_name'
                                    name='contact_name'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.contact_name && true} {...field} />}
                                />
                                {errors.contact_name && <FormFeedback>{errors.contact_name.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>핸드폰</Col>
                                <Col xs='8' className='card_table col text start '>
                                    <Controller
                                        id='contact_mobile'
                                        name='contact_mobile'
                                        control={control}
                                        render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.contact_mobile && true} {...field} />}
                                    />
                                    {errors.contact_mobile && <FormFeedback>{errors.contact_mobile.message}</FormFeedback>}
                                </Col>
                        </Row>
                    </Col>
                </Row>

                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3'}}>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>e-mail</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='email'
                                    name='email'
                                    control={control}
                                    render={({ field }) => (
                                        <Col className='card_table col text center' style={{flexDirection:'column'}}>
                                            <Input bsSize='sm' maxLength={40} invalid={errors.email && true} {...field} />
                                            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                                        </Col>
                                    )}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col xs='12' md='6' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4'  className='card_table col col_color text center '>비고</Col>
                            <Col xs='8' className='card_table col text start '>
                                <Controller
                                    id='description'
                                    name='description'
                                    control={control}
                                    render={({ field }) => <Input bsSize='sm' maxLength={254} invalid={errors.description && true} {...field} />}
                                />
                                {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                
                <Row style={{marginLeft: 0, marginRight: 0, borderRight: '1px solid #B9B9C3', marginBottom:'5%'}}>
                    <Col xs='12' md='12' style={{borderBottom: '1px solid #B9B9C3'}}>
                        <Row className='card_table table_row'>
                            <Col xs='4' md='2'  className='card_table col col_color text center '>업체구분</Col>
                            <Col xs='8' md='10' className='card_table col text start '>
                            {createQA()}
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>     
                    <Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
                        <Button tag={Link} color="report"
                                to={`${ROUTE_BASICINFO_PARTNER_MANAGEMENT_DETAIL}/${company_id}`}
                                >취소</Button>
                        <Button className='ms-1' type='submit' color='primary'>확인</Button>
                        <Button className='ms-1' onClick={() => navigate(ROUTE_BASICINFO_PARTNER_MANAGEMENT)}>목록</Button>
                    </Col>
                </Row>

                </Form>
            </div>
        </Row>
        </CardBody>
    </Card>
</Fragment>
	)
}

export default Partner_Management_Fix