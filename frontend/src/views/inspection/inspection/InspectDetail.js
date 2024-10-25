import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, Row, Col, Form, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Sign from './Sign'
import { API_INSPECTION_PERFORMANCE_DETAIL, ROUTE_INSPECTION_INSPECTION_DETAIL_EXPORT, ROUTE_CRITICAL_DISASTER_LIST, ROUTE_INSPECTION_INSPECTION_LIST, ROUTE_INSPECTION_REG, ROUTE_CRITICAL_DISASTER_INSPECTION_REG } from '../../../constants'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import { useParams, useNavigate, useLocation } from "react-router-dom"
import DetailSection from './DetailSection'
import UpdateSection from './UpdateSection'
import { useForm } from 'react-hook-form'
import { FormDetailButton } from './FormButton'
import { OXChoiceList, scoreChoiceList, warningAlert, signListObj, fiveSelectList } from '../data'
import Cookies from 'universal-cookie'
import { FileText } from 'react-feather'
import { axiosPostPutCallback, getTableDataCallback, isSignPreSignCheck, signAuthCheck, sweetAlert } from '../../../utility/Utils'
import InspectionSignModal from './sign/InspectionSignModal'

const InspectDetail = () => {
	// certificate
	useAxiosIntercepter()
	const defaultValues = {} 
	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors }
	} = useForm({
		defaultValues : defaultValues
	})

	// is_completabled 0 미작성 1 완료 2 임시저장 3회수
	const cookies = new Cookies()
	const navigate = useNavigate()
	const [data, setData] = useState({})
	const [signList, setSignList] = useState([]) // 결재 상태 0 미완료 1 완료
	const [update, setUpdate] = useState(false)
	const [submitType, setSubmitType] = useState('') // 저장 상태 임시저장 점검완료
	const [file, setFile] = useState([])
	const [signNameList, setSignNameList] = useState([])

	const { type, id } = useParams()
	const { state } = useLocation()
	const pageLocation = (state?.type === 'manager' || state?.type === undefined || state?.type === 'inspection') ? 'inspection' : 'critical'

	console.log(type)

	const [templeteCode, setTempleteCode] = useState('')
	const [signButton, setSignButton] = useState(true) // 현재 접속 유저가 결재권한이 있는지 체크
    const activeUser = Number(cookies.get('userId')) // 현재 접속 유저 아이디
    const [isInCharge, setIsInCharge] = useState(false) // 담당자인지 체크
    const [isSignPreSign, setIsSignPreSign] = useState(false) // 전
    const [isMod, setIsMod] = useState(false)

	const [isOpen, setIsOpen] = useState(false)
	const [inputData, setInputData] = useState([])

	const [signIdList, setSignIdList] = useState([activeUser, 0, 0, 0])
    const [orignUserSign, setOrignUserSign] = useState([activeUser, 0, 0, 0])
    const [orignSignType, setOrignSignType] = useState([1, 3, 3, ''])
	const [userSign, setUserSign] = useState([])
    const [signType, setSignType] = useState([1, 3, 3, 0])

	// list page 
	const LIST_API = state?.type === 'manager' ? 
						`${ROUTE_INSPECTION_REG}/mg` : // 자체점검일지관리
					state?.type === 'inspection' || state?.type === undefined ?
						`${ROUTE_INSPECTION_INSPECTION_LIST}/${templeteCode}` : //자제점검실적상세
					state?.type === 'criticalManager' ? 
						`${ROUTE_CRITICAL_DISASTER_INSPECTION_REG}/safety` : // 중대재점검일지관리
						`${ROUTE_CRITICAL_DISASTER_LIST}/${templeteCode}` // 중대재점검실적상세

	const getInit = () => {
		const params = {
			id : id,
			user_id : cookies.get('userId')
		}

		getTableDataCallback(API_INSPECTION_PERFORMANCE_DETAIL, params, function(data) {
			if (data.delete_datetime !== null) {
				sweetAlert('', "삭제된 페이지 입니다.", 'warning')
				navigate(LIST_API, {state:{type: state?.type, scheduleId:state?.scheduleId}})
			}
			setTempleteCode(data.templete_code)
			const nameList = []
			const signTypeList = []
            const idList = []
			setData(data)
			setFile(data['file'])
			data.sections.forEach((data) => {
				data.questions.forEach((v) => {
					if (v['use_description']) {
						setValue(`discription_${v['id']}`, v['description'])
					}
					if (v['is_choicable']) {
						setValue(`result_${v['id']}`, v['answer'])
					} else {
						if (v['choice_type'] === 0) {
							if (v['answer'] !== "") {
								setValue(`result_${v['id']}`, scoreChoiceList.find(item => item.value === parseInt(v['answer'])))
							} else {
								setValue(`result_${v['id']}`, {label:'선택', value : ""})
							}
						} else if (v['choice_type'] === 1) {
							if (v['answer'] !== "") {
								setValue(`result_${v['id']}`, OXChoiceList.find(item => item.value === parseInt(v['answer'])))
							} else {
								setValue(`result_${v['id']}`, {label:'선택', value : ""})
							}
						} else if (v['choice_type'] === 2) {
							if (v['answer'] !== "") {
								setValue(`result_${v['id']}`, fiveSelectList.find(item => item.value === parseInt(v['answer'])))
							} else {
								setValue(`result_${v['id']}`, {label:'선택', value : ""})
							}
						}
					}
				})
			})

			const tempSignList = data?.sign_list
			console.log(tempSignList)
			if (Array.isArray(tempSignList) && tempSignList.length > 0) {
				tempSignList.map(data => {
					nameList.push(data.username)
					signTypeList.push(data.type)
					idList.push(data?.user ? data?.user : 0)
				})
				setUserSign(tempSignList)
				setSignType(signTypeList)

				setOrignUserSign(idList)
				setOrignSignType(signTypeList)

				setSignNameList(nameList)

				setSignIdList(idList) // id
				setSignList(signTypeList) // type
			} else {
				setSignIdList(orignUserSign)
				setSignType(orignSignType)
			}

			const tempCompletabled = data?.is_completabled
			setUpdate(tempCompletabled === 0 || tempCompletabled === 2) // 미작성 임시저장
		})
	}

	const onSubmit = data => {
		const formData = new FormData()
		const result = []
		let returnPoint = true
		Object.entries(data).forEach(([key, value]) => {
			if (value === "" && submitType === 'complete') {
				warningAlert()
				returnPoint = false
			}
			let temp = {id : key.split("_")[1], type : key.split("_")[0], value : value}
			
			// select 값 object
			if (typeof value === 'object') {
				if (value['value'] === "" && submitType === 'complete') {
					warningAlert()
					returnPoint = false
				}
				temp = {id : key.split("_")[1], type : key.split("_")[0], value : value['value']}
			}
			result.push(temp)
		})
		if (!returnPoint) return
		formData.append('submitType', submitType)
		formData.append('id', id)
		formData.append('user_id', cookies.get('userId'))
		formData.append('result', JSON.stringify(result))
		formData.append('files',  JSON.stringify(file))

		if (update && submitType === 'complete') {
			setInputData(formData)
			setIsOpen(true)
		}

		if (submitType === 'temporary') {
			axiosPostPutCallback('register', '점검일지 임시', API_INSPECTION_PERFORMANCE_DETAIL, formData, function() {
				getInit()
			}, true, '저장')
		}
	}

	const handleClick = () => {
    	localStorage.setItem("data", JSON.stringify(data))
		window.open(`${ROUTE_INSPECTION_INSPECTION_DETAIL_EXPORT}/${id}`, '_blank')
	}
	
	useEffect(() => {
		getInit()
	}, [])

    useEffect(() => {
		if (update) return
        if (userSign.length && userSign.length === 4) {
            setIsInCharge(userSign[0].user === activeUser)
			// 결재 버튼 보여질 권한 체크
            const tempSignButtonCheck = signAuthCheck(activeUser, userSign) 
            setSignButton(tempSignButtonCheck) 
            if (tempSignButtonCheck) setIsSignPreSign(isSignPreSignCheck(activeUser, userSign, false))
			//temp
			setIsMod(true)
			for (const userData of userSign) {
				if (userData.view_order >= 1 && (userData.type === 1 || userData.type === 2)) {
					setIsMod(false)
					break
				}
			}
        }
    }, [userSign])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs 
						breadCrumbTitle={`${pageLocation === 'inspection' ? '점검일지' : '안전점검양식'}`} 
						breadCrumbParent={`${pageLocation === 'inspection' ? '점검관리' : '중대재해관리'}`} 
						breadCrumbParent2={`${pageLocation === 'inspection' ? '자체점검' : '일일안전점검'}`}
						breadCrumbActive={`${pageLocation === 'inspection' ? '점검실적' : '점검일지'}`}/>
					<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleClick}>
						<FileText size={14}/>
						문서변환
					</Button.Ripple>
				</div>
			</Row>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<Row>
					<Card>
						<CardHeader>
							<Col lg='8' md='12'>
								<CardTitle>
									{data['title']}
								</CardTitle>
									<Row className='card_table mt-1 mx-0  border-right'>
										<Col lg='4' md='12' className='border-top'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													건물
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{data['building']}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12' className='border-top'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													작성일자
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{/* {moment(data['write_datetime']).format('YYYY-MM-DD dd')} */}
													{data['write_datetime']}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12' className='border-top'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													관리자
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{data['user']}
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className='card_table mx-0 border-right border-top'>
										<Col lg='4' md='12' className='border-b'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													직종
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{data['employee_class']}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12' className='border-b'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													직급
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{data['employee_level']}
												</Col>
											</Row>
										</Col>
										<Col lg='4' md='12' className='border-b'>
											<Row className='card_table table_row'>
												<Col md='3' className='card_table col text center ' style={{borderLeft: '1px solid #B9B9C3'}}>
													담당자
												</Col>
												<Col md='9' className='card_table col text start '  style={{borderLeft: '1px solid #B9B9C3'}}>
													{data['writer']}
												</Col>
											</Row>
										</Col>
									</Row>
							</Col>
							<Col lg='4' xs='12'>
								{ data && 
									<Sign 
										userSign={userSign}
										setUserSign={setUserSign}
										signList={signList}
										setSignList={setSignList}
										signNameList={signNameList}
										update={data['is_completabled']}
										signListObj={signListObj}
										completable = {data['is_completabled'] === 1} 
									/>
								}
							</Col>
						</CardHeader>
					</Card>
					<InspectionSignModal 
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						userSign={signIdList}
						setUserSign={setSignIdList}
						signType={signType}
						setSignType={setSignType}
						inputData={inputData}
						navigate={navigate}
						setUpdate={setUpdate}
                        getInit={getInit}
						orignUserSign={orignUserSign}
						orignSignType={orignSignType}
					/>
					{ update ? 
						<UpdateSection 
							sectionData = {data['sections']} 
							control={control} 
							setValue={setValue} 
							errors = {errors} 
							getValues={getValues} 
							setFile={setFile} 
							file={file}
						/> 
					: 
						(data['sections'] && 
							<DetailSection 
								completable = {data['is_completabled']} 
								sectionData = {data['sections']} 
								fileData ={data['file']} 
								setUpdate = {setUpdate} 
								signList={signList} 
								getInit={getInit} 
								userSign={userSign}
								signIdList={signIdList} 
								cookies={cookies} 
								signListObj={signListObj} 
								templeteCode={templeteCode}
								signButton={signButton}
								isInCharge={isInCharge}
								isSignPreSign={isSignPreSign}
								isMod={isMod}
								pageLocation={pageLocation}
								listApi={LIST_API}
							/>
						)
					}
					{update && <FormDetailButton listApi={LIST_API} setUpdate = {setUpdate} setSubmitType={setSubmitType}/>}
				</Row>				
			</Form>
		</Fragment>
	)
}
export default InspectDetail