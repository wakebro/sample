/* eslint-disable */
import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, Col, Input, Row } from 'reactstrap'
import { CheckCircle, X } from 'react-feather'
// import DrawingTabContent from "./DrawingTabContent"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { debounce } from 'lodash'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { customFileBadge, sweetAlert } from "../../../utility/Utils"
import { OXChoiceList, scoreChoiceList, RequiredCheck, fiveSelectList } from '../data'
import PreviewModal from './PreviewModal'
import { useParams } from "react-router-dom"
import { API_INSPECTION_CHECKLIST_ATTACHMENT_UPLOAD } from '../../../constants'
import axios from "../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
const PC_MIN_WIDTH = 768

const UpdateSection = (props) => {
	// certificate
	useAxiosIntercepter()
	const { type } = useParams()
	const customStyles = {
		container: (provided) => ({
			...provided
		}),
		menuPortal: (provided) => ({ ...provided, zIndex: 9999 })
	}
	const {
		control, 
		setValue, 
		sectionData, 
		getValues, 
		setFile, 
		file
	} = props
	const [modal, setModal] = useState(false)
	const [inputModal, setInputModal] = useState("")
	const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    const handleResizeWindow = debounce(() => {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, 200)
	
	const windowSizeCheck = (data) => {
		if (windowSize.width <= PC_MIN_WIDTH) {
			setModal(!modal)
			setInputModal(data)
		}
	}
	const handleChangeFile = (event) => {
		const input = event.target
		if (input.value && input.files && input.files[0].size > (10 * 1024 * 1024)) {
			sweetAlert('', `10MB 이하의 파일을 업로드 해주세요.`, 'warning')
			input.value = null
		} else if (input.value === undefined) {
			
		} else {
			const formData = new FormData()
			formData.append('id', type)
			formData.append('file_temp', input.files[0])
			axios.post(API_INSPECTION_CHECKLIST_ATTACHMENT_UPLOAD, formData, {
				headers : {
				 "Content-Type": "multipart/form-data"
				}
			}).then((res) => {
				const updatedFiles = [...file]
				updatedFiles.push(res.data)
				setFile(updatedFiles)
			}).catch((res) => {
				console.log(res)
			})
		}
        event.target.value = ""
	}
	const deleteFile = (index) => {
		setFile(file.filter(e => e !== file[index]))
	}

	const descriptionTemp = (data) => {
		if (data !== undefined) {
			if (data['questions'] !== undefined) {
				let check = false
				data['questions'].forEach((v) => {
					if (v['use_description']) {
						check = true
					}
				})
				if (check) {
					return (
						<Col>
							비고 &nbsp;<RequiredCheck/>
						</Col>
					)
				}
			}
		}
	}
	const resetData = (data, type) => {
		if (type === 'select') {
			setValue(data, {label:'선택', value : ""})
		} else {
			setValue(data, "")
		}
	}
	const QaListTemp = (data) => {
		let check = false
		data['questions'].forEach((v) => {
			if (v['use_description']) {
				check = true
			}
		})
		return (
			data['questions'].map((v, i) => {
				let tempOption = []
				if (v['choice_type'] === 0) {
					tempOption = [...scoreChoiceList]
				} else if (v['choice_type'] === 1) {
					tempOption = [...OXChoiceList]
				} else if (v['choice_type'] === 2) {
					tempOption = [...fiveSelectList]
				}
				return (
					<Row style={{borderBottom : '1px solid #D8D6DE'}} key={v['title'] + i} >
						<Col className='mt-1 mb-1' lg={check ? 4 : 6} xs={check ? 4 : 6} style={{display:"flex", alignItems : 'center', wordBreak : 'break-word'}}>
							{v['title']}
						</Col>
						<Col className='mt-1 mb-1' lg={check ? 4 : 6} xs={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
							{
								v['is_choicable'] ? <Controller
									id={`result_${v['id']}`}
									name={`result_${v['id']}`}
									key = {`result_${v['id']}`}	
									control={control}
									render={({ field: { onChange, value } }) => (value !== "" ? 
									<Row style={{width:'100%'}}>
										<Col md={8}>
											<CheckCircle size={13} color={'#ff9f43'}/>
											<span style={{fontSize : '14px', color : '#ff9f43', wordBreak : 'break-word'}}>결과 : {value}</span>
										</Col>
										<Col md={4}>
											<Button style={{fontSize : '14px',  wordBreak : 'keep-all'}} size="sm" onClick={() => resetData(`result_${v['id']}`)}>재입력</Button>
										</Col>
									</Row> 
									: 
									<Input  onBlur={(e) => onChange(e)}/>) }
								/>
								: 
								<Controller
									id = {`result_${v['id']}`}
									name={`result_${v['id']}`}
									control={control}
									render={({ field: { onChange, value } }) => (
										value !== undefined && (value.value !== "" ? 
										<Row style={{width:'100%'}}>
											<Col md={8}>
												<CheckCircle size={13} color={'#ff9f43'}/>
												<span style={{fontSize : '14px', color : '#ff9f43', wordBreak : 'break-word'}}>결과 : {value.label}</span>
											</Col>
											<Col md={4}>
												<Button style={{fontSize : '14px',  wordBreak : 'keep-all'}} size="sm" onClick={() => resetData(`result_${v['id']}`, 'select')}>재입력</Button>
											</Col>
										</Row> 
										:
										<Select
											styles={customStyles}
											menuPortalTarget={document.body}
											name={`result_${v['id']}`}
											classNamePrefix={'select'}
											className={`react-select custom-select-${v['id']} custom-react-select`}
											options={tempOption}
											// value={value}
											onChange={(e) => onChange(e)}
											defaultValue={{label:'선택', value : ""}}
										/>
										)
									)}/>
								
							}
							
						</Col>
						{v['use_description'] && 
						<Col className='mt-1 mb-1' lg={4} xs={4}>
							<Controller
								id={`discription_${v['id']}`}
								name={`discription_${v['id']}`}
								key = {`discription_${v['id']}`}
								control={control}
								render={({ field: { onChange, value } }) => (value !== "" ? <Row>
										<Col>
											<CheckCircle size={13} color={'#ff9f43'}/>
											<span type='textarea' style={{fontSize : '14px', color : '#ff9f43', wordBreak : 'break-word'}}>결과 : {value}</span>
										</Col>
										<Col>
											<Button style={{fontSize : '14px',  wordBreak : 'keep-all'}} size="sm" onClick={() => resetData(`discription_${v['id']}`)}>재입력</Button>
										</Col>
									</Row> 
									:
									<Input type='textarea' rows = '1'  style={{display:"flex", alignItems : 'center'}} onClick={() => windowSizeCheck(`discription_${v['id']}`)} onBlur={(e) => onChange(e)}/>
									)}
							/>
							{/* <Controller
								id={`discription_${v['id']}`}
								name={`discription_${v['id']}`}
								key = {`discription_${v['id']}`}
								control={control}
								render={({ field }) => (<Input type='textarea' rows = '1'  style={{display:"flex", alignItems : 'center'}} onClick={() => windowSizeCheck(`discription_${v['id']}`)} {...field}/>
									)}
							/> */}
						</Col>
						}
					</Row>		
				)
			})
		)
	}
	

	useEffect(() => {
        window.addEventListener('resize', handleResizeWindow)
        return () => {
            window.removeEventListener('resize', handleResizeWindow)
        }
    }, [])

	return (
		<Fragment>
				<Card>
					<CardBody>
						<Row>
							{
								sectionData.map((data, i) => {
									let check_hour = "\b"
									if (data['check_hour']) {
										if (data['check_hour'] < 10) {
											check_hour = `0${data['check_hour']}:00`
										} else {
											check_hour = `${data['check_hour']}:00`
										}
									}
									
									return (
										<Fragment key={i}>
											<Col  style={{marginTop : '1rem'}} lg='5' md='11'>
												<Row className='mt-1 mb-1'>
													<Col style={{fontFamily : 'Montserrat,sans-serif', fontWeight : '900'}}>
														{check_hour}
													</Col>
												</Row>
												<Row style={{borderBottom : '1px solid #D8D6DE'}}>
													<Col style={{fontFamily : 'Montserrat,sans-serif', fontWeight : '900'}}>
														{data['title']}
													</Col>
													<Col>
														점검결과 &nbsp;<RequiredCheck/>
													</Col>
													{descriptionTemp(data)}
												</Row>
												{QaListTemp(data)}
											</Col>
											<Col lg='1' md='1'>
											</Col>
										</Fragment>
									)
								})
							}
							{/* {sectionList()} */}
						</Row>
					</CardBody>
					<CardBody style={{borderTop : '1px dashed #C1C1CB'}}>
						<Row className="mb-1">
							<Col>
								첨부파일
							</Col>
						</Row>
						<Row>
                            <Col >
								<Input type='file' id='file' name='file' onChange={(e) => handleChangeFile(e)} />      
                            </Col>
                        </Row>
						{
							file.map((data, i) => {
								return (
									<Row className="mt-1" key={i} >
										<Col>
											{customFileBadge(data['name'].split(".")[1])}{data['name']}
											<X className="ms-1" size={12} style={{cursor : 'pointer'}} onClick={() => deleteFile(i)}/>
										</Col>
									</Row>
								)
							})
						}
					</CardBody>
				</Card>
				<PreviewModal modal = {modal} setModal = {setModal} inputName = {inputModal} setValue={setValue} getValues={getValues}/>
		</Fragment>
	)
}
export default UpdateSection