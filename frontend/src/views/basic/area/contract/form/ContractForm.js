import { isEmptyObject } from 'jquery'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import { Link } from 'react-router-dom'
import Select from 'react-select'
import Flatpickr from 'react-flatpickr'
import { useLocation } from 'react-router'
import { Controller, useForm } from 'react-hook-form'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Label, FormFeedback, Form, CardFooter } from "reactstrap"
import { API_BASICINFO_AREA_CONTRACT, ROUTE_BASICINFO_AREA_CONTRACT, API_BUILIDNG_SELECT_LIST, ROUTE_BASICINFO_AREA_CONTRACT_DETAIL, API_BASICINFO_AREA_CONTRACT_FORM } from "../../../../../constants"
import { validationSchemaInconv, defaultValues, validationEditSchemaInconv } from '../ContractData'
import { checkSelectValue, checkSelectValueObj, axiosPostPut, AddCommaOnChange, getCommaDel, handleFileInputLimitedChange, setStringDate, getTableDataCallback } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import FileIconImages from '../../../../apps/customFiles/FileIconImages'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import moment from 'moment'

const ContractForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const cookies = new Cookies()
    const now = moment().format('YYYY-MM-DD')
    const [detailData, setDetailData] = useState()
    const [buildingList, setBuildingList] = useState([{ value:'', label: '건물 선택'}])
    const [selectError, setSelectError] = useState({building: false})
	const {building} = selectError
    const [files, setFiles] = useState([])
    const [selectedFiles, setSelectedFiles] = useState([])
    const [submitResult, setSubmitResult] = useState(false)
    const [showNames, setShowNames] = useState([])
   
    let yubResolver
	if (state.type === 'register') {
		yubResolver = yupResolver(validationSchemaInconv)
	} else {
		yubResolver = yupResolver(validationEditSchemaInconv)
	}

    const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
        trigger
	} = useForm({
		defaultValues: JSON.parse(JSON.stringify(defaultValues)),
		resolver: yubResolver
	})

    const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

    const handleFileInputChange = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, 6, showNames, setShowNames, setSelectedFiles)
    }

    // 새로 업로드한 부분 삭제
    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }
    // 과거의 파일 리스트중 삭제
    const onPastRemoveFile = (file) => {
        setShowNames(showNames.filter((element) => element !== file))
    }

    const onSubmit = (data) => {
        let matchingIds = []
        if (state.type === 'modify') {
            matchingIds = showNames.map((id) => id.id)
        }
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }
        const pageType = state.type
		const formData = new FormData()
        Object.keys(defaultValues).map((key) => {
            if (key !== 'date' && key !== 'contract_date' && key !== 'building' && key !== 'amount' && key !== 'members' && key !== 'area_total') {
                formData.append(key, data[key])
            }
        })
        formData.append('members', getCommaDel(data.members))
        formData.append('amount', getCommaDel(data.amount))
        formData.append('area_total', getCommaDel(data.area_total))
        formData.append('building', data.building.value)
        formData.append('contract_date', data.contract_date)
        formData.append('start_date', data.date[0]) //.toLocaleString('ko-KR')
        formData.append('end_date', data.date[1])
        formData.append('old_files_id', matchingIds)
        formData.append('description', data.description)
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('doc_files', files[i])
              }
        } else {
            formData.append('doc_files', [''])
        }
		formData.append('property', cookies.get('property').value)
        formData.append('user_id', cookies.get("userId"))

		const API = pageType === 'register' ? API_BASICINFO_AREA_CONTRACT_FORM
										: `${API_BASICINFO_AREA_CONTRACT}/${state.id}`

        axiosPostPut(pageType, "사업소별계약관리", API, formData, setSubmitResult)
    }

    
    // 파일 삭제하면 선택된파일 없다고 나타나는 곳
    useEffect(() => {
        const inputElement = document.getElementById("doc_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i])
        }
        inputElement.files = dataTransfer.files
    }, [files])
    
    useEffect(() => {
        if (state.type === 'register') {
            if (!isEmptyObject(errors)) {
                checkSelectValueObj(control, selectError, setSelectError)
			}
		}
	}, [errors])
    
    
    useEffect(() => {
        if (submitResult) {
            if (state.type === 'modify') {
                window.location.href = `${ROUTE_BASICINFO_AREA_CONTRACT_DETAIL}/${state.id}`
			} else {
                window.location.href = ROUTE_BASICINFO_AREA_CONTRACT
			}
		}
	}, [submitResult])
    
    useEffect(() => {
        getTableDataCallback(API_BUILIDNG_SELECT_LIST, {property:cookies.get('property').value}, (data) => {
            if (Array.isArray(data)) {
                const tempList = data.map(row => ({value:row.id, label: `${row.name}(${row.code})`}))
                tempList.unshift({ value:'', label: '건물 선택'})
                setBuildingList(tempList)
            }
        })
	}, [])
    
    useEffect(() => {
        if (state.type === 'modify') {
            getTableDataCallback(`${API_BASICINFO_AREA_CONTRACT}/${state.id}`, {property:cookies.get('property').value}, (data) => {
                setDetailData(data)
                const tempfileList = data?.contract_files
                if (Array.isArray(tempfileList)) {
                    setShowNames(tempfileList.map((file) => ({id: file.id, name: file.original_file_name})))
                }
            })
        }
    }, [])

    useEffect(() => {
        if (detailData) {
            setValue('name', detailData.name)
            setValue("members", detailData.members)
            setValue('amount', detailData.amount)
            setValue("area_total", detailData.area_total)
            setValue("manage", detailData.manage)
            setValue("building", buildingList.find(item => item.label === detailData.building))
            setValue("description", detailData.description)
            setValue("contract_date", detailData.contract_date)
            setValue("date", [detailData.start_date, detailData.end_date])
        }
    }, [detailData])

    return (
        <Fragment>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle='사업소별계약관리' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive={`계약정보자료실`} />
					</div>
				</Row>
			<Card>
				<CardHeader>
					<CardTitle className="title">
						계약정보자료실&nbsp;{state.type === 'register' ? '등록' : '수정'}
					</CardTitle>
				</CardHeader>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="card_table mx-0" style={{borderTop: '1px solid #B9B9C3', borderRight: '1px solid #B9B9C3'}}>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>현장명</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Col lg='8' md='8' xs='8' className='card_table col text'>
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='12' xs='12'className='card_table col text border_none' style={{flexDirection:'column'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Input style={{width:'100%'}} bsSize='sm' invalid={errors.name && true} {...field}/>
                                                    {errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
                                                </Row>
                                            </Col>
                                        )}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>관리인원</Col>
                                    <Controller
                                        name='members'
                                        control={control}
                                        render={({ field: {onChange, value} }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text'>
                                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Input 
                                                            style={{width:'100%'}} 
                                                            bsSize='sm' 
                                                            invalid={errors.members && true} 
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange, true)
                                                                trigger('members')
                                                            }}
                                                        />
                                                        {errors.members && <FormFeedback>{errors.members.message}</FormFeedback>}
                                                    </Row>
                                                </Col>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center px-0'>
                                        <div>최초계약일</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        id='contract_date'
                                        name='contract_date'
                                        control={control}
                                        render={({ field: {onChange, value} }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Flatpickr
                                                        className={`form-control ${errors.contract_date ? 'is-invalid' : ''}`}
                                                        id='default-picker'
                                                        value={value}
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options = {{
                                                            dateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }}
                                                        placeholder={now}
                                                    />
                                                    {errors.contract_date && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.contract_date.message}</div>}
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                        </Row>
                        <Row className="card_table mx-0 border-right">
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>계약금액</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        name='amount'
                                        control={control}
                                        render={({ field : {onChange, value}}) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text'>
                                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Input 
                                                            style={{width:'100%'}} 
                                                            bsSize='sm' 
                                                            invalid={errors.amount && true} 
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange, true)
                                                                trigger('amount')
                                                            }}
                                                        />
                                                        {errors.amount && <FormFeedback>{errors.amount.message}</FormFeedback>}
                                                    </Row>
                                                </Col>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        연면적(평)&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        name='area_total'
                                        control={control}
                                        render={({ field: {onChange, value} }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text'>
                                                <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column'}}>
                                                    <Row style={{width:'100%'}}>
                                                        <Input 
                                                            style={{width:'100%'}} 
                                                            bsSize='sm' 
                                                            invalid={errors.area_total && true} 
                                                            value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
                                                            onChange={(e) => {
                                                                AddCommaOnChange(e, onChange)
                                                                trigger('area_total')
                                                            }}/>
                                                        {errors.area_total && <FormFeedback>{errors.area_total.message}</FormFeedback>}
                                                    </Row>
                                                </Col>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>관리형태</Col>
                                    <Controller
                                        name='manage'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.manage && true} {...field}/>
                                                            {errors.manage && <FormFeedback>{errors.manage.message}</FormFeedback>}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table mx-0 border-right' style={{marginBottom: '2%'}}>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>계약기간</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        id = 'date'
                                        name='date'
                                        control={control}
                                        render={({ field : {onChange, value}}) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text' style={{flexDirection:'column'}}>
                                                <Row style={{width:'100%'}}>
                                                    <Flatpickr
                                                        id='range-picker'
                                                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                                        value={value || ''}
                                                        onChange={(data) => {
                                                            const newData = setStringDate(data)
                                                            onChange(newData)
                                                        }}
                                                        options={{
                                                            mode: 'range',
                                                            dateFormat: 'Y-m-d',
                                                            locale: Korean
                                                        }}
                                                        placeholder={`${now} ~ ${now}`}
                                                    />
                                                    {errors.date && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>{errors.date.message}</div>}
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>
                                        <div>건물코드</div>&nbsp;
                                        <div className='essential_value'/>
                                    </Col>
                                    <Controller
                                        name='building'
                                        control={control}
                                        render={({ field: { value } }) => (
                                            <Col md={8} className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
                                                <Select
                                                    name='building'
                                                    classNamePrefix={'select'}
                                                    className="react-select custom-select-building custom-react-select"
                                                    options={buildingList}
                                                    value={value}
                                                    onChange={ handleSelectValidation }/>
                                                {building && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>건물을 선택해주세요.</div>}
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                            <Col md='4' xs='12' className="border-b">
                                <Row className='card_table table_row'>
                                    <Col lg='4' md='4' xs='4' className='card_table col col_color text center'>비고</Col>
                                    <Controller
                                        name='description'
                                        control={control}
                                        render={({ field }) => (
                                            <Col lg='8' md='8' xs='8' className='card_table col text center'>
                                                <Row style={{width:'100%'}}>
                                                    <Col lg='12' xs='12'className='card_table col text start border_none' style={{flexDirection:'column', alignItems:'center', paddingLeft:'0', paddingRight:'0'}}>
                                                        <Row style={{width:'100%'}}>
                                                            <Input style={{width:'100%'}} bsSize='sm' invalid={errors.description && true} {...field}/>
                                                            {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        )}/>
                                </Row>
                            </Col>
                        </Row>
                        <Row className='card_table'>
                            <div className="mb-1">
                                <Label className="form-label" for="doc_file">
                                    첨부파일
                                </Label>
                                <Input type="file" id="doc_file" name="doc_file"  multiple onChange={handleFileInputChange}  />
                            </div>
                            <div className="mb-1">
                                <div className='form-control hidden-scrollbar' style={{ height: '46.2px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
                                    {selectedFiles && selectedFiles.length > 0 &&
                                        selectedFiles.map((file, idx) => {
                                            const ext = file.name.split('.').pop()
                                            return (
                                              <span key={`file_${idx}`} className="mx-0 px-0">
                                                <FileIconImages
                                                  ext={ext}
                                                  file={file}
                                                  filename={file.name}
                                                  removeFunc={onRemoveFile}
                                                />
                                              </span>
                                            )
                                        })
                                    }
                                    { state.type === 'modify' && detailData && detailData.contract_files.length > 0 && 
                                        showNames.map((file, idx) => {
                                            const ext = file.name.split('.').pop()
                                            return (
                                              <span key={idx} className="mx-0 px-0">
                                                <FileIconImages
                                                  ext={ext}
                                                  file={file}
                                                  filename={file.name}
                                                  removeFunc={onPastRemoveFile}
                                                />
                                              </span>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </Row>
                        <CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end', borderTop: '1px solid #dae1e7'}}>
                            <Fragment >
                                    { state.type === 'modify' &&
                                    <Button color='report' 
                                        className="ms-1"
                                        tag={Link} 
                                        to={`${ROUTE_BASICINFO_AREA_CONTRACT_DETAIL}/${state.id}`} 
                                        >취소</Button>
                                }
                                <Button className="ms-1" type='submit' color='primary'>{state.type === 'register' ? '저장' : '수정'}</Button>
                                <Button
                                    className="ms-1"
                                    // color='report'
                                    tag={Link} 
                                    to={ROUTE_BASICINFO_AREA_CONTRACT}
                                    state={{
                                        key: 'costCategory'
                                    }} >목록</Button>
                            </Fragment>
                        </CardFooter>
                    </Form>
                </CardBody>
			</Card>
		</Fragment>
    )

}
export default ContractForm