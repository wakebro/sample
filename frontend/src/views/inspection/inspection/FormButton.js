import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"
import { Button, Card, CardBody, Row } from "reactstrap"
import '../../../assets/scss/style.scss'
import { ROUTE_INSPECTION_INSPECTION_FORM, ROUTE_INSPECTION_INSPECTION_FORM_LIST, 
	ROUTE_INSPECTION_INSPECTION_PREVIEW, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_PREVIEW, 
	ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM, ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST
} from '../../../constants'
import {
	setBuilding,
	setBuildingLocation,
	setBuildingUse, setDiscription, setEmployeeClass, 
	setFormId, setName, setSection, setType
} from "../../../redux/module/inspectionPreview"
const FormButton = (props) => {
	const { type, handleSubmit, onSubmit, questionIndex } = props
	const navigate = useNavigate()
	const {formId} = useParams()
	const dispatch = useDispatch()
	const previewData = useSelector((state) => state.inspectionPreview)

	const preview = data => {
		dispatch(setName(data.name))
		dispatch(setEmployeeClass(data.employeeClass))
		dispatch(setType(data.type))
		dispatch(setDiscription(data.discription))

		dispatch(setBuilding(data.building))
		dispatch(setBuildingLocation(data.buildingLocation))
		dispatch(setBuildingUse(data.buildingUse))
		dispatch(setFormId(formId))

		const section = []
		Object.entries(questionIndex).forEach((item) => {
			const temp = {
				check_hour_status : data[`timeType${item[0]}`],
				title : data[`checkListName${item[0]}`],
				sub_title : data[`middleCategory${item[0]}`],
				question_list : []
			}
			if (data[`timeType${item[0]}`]) {
				temp['check_hour'] = data[`timeList${item[0]}`].value
			}

			item[1].forEach((qa) => {
				const qa_temp = {}
				qa_temp[`title`] = data[`qaName_${item[0]}${qa}`] 
				qa_temp[`is_choicable`] = data[`choiceForm_${item[0]}${qa}`]
				qa_temp[`choice_type`] = data[`multiChoice_${item[0]}${qa}`].value
				qa_temp[`use_description`] = data[`discription_${item[0]}${qa}`] 
				temp['question_list'].push(qa_temp)

			})
			section.push(temp)
		})
		dispatch(setSection(section))

		navigate(previewData.reportType !== 'disaster' ? ROUTE_INSPECTION_INSPECTION_PREVIEW : ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_PREVIEW)
	}
	return (
		<Card className="formButton-fixed-container">
			<CardBody >
				<Row>
					<div style={{display:'flex', justifyContent:'flex-end'}}>
						<div style={{border:'1px solid white'}}><Button onClick={() => navigate(previewData.reportType !== 'disaster' ? ROUTE_INSPECTION_INSPECTION_FORM_LIST : `${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM_LIST}/safety`)} color='primary'>취소</Button></div>
						<div style={{border:'1px solid white'}}><Button onClick={handleSubmit(preview)} color='primary'>미리보기</Button></div>
						<div style={{backgroundColor:'white', border:'1px solid white'}}><Button color='primary' outline onClick={handleSubmit(onSubmit)}>{type !== 'detail' ? '저장하기' : '수정하기'}</Button></div>
					</div>
				</Row>
			</CardBody>
		</Card>
	)
}
const FormPreviewButton = (props) => {
	const navigate = useNavigate()
	const { formId, type } = props
	const registerUrl = type !== 'disaster' ? `${ROUTE_INSPECTION_INSPECTION_FORM}/${formId}` : `${ROUTE_CRITICAL_DISASTER_SAFETY_INSPECTION_FORM}/${formId}`
	return (
		<Card className="formButton-fixed-container">
			<CardBody >
				<Row>
					<div style={{display:'flex', justifyContent:'flex-end'}}>
						<div style={{border:'1px solid white'}}><Button onClick={() => navigate(registerUrl, {state : 'back'})}  color='primary'>돌아가기</Button></div>
					</div>
				</Row>
			</CardBody>
		</Card>
	)
}

const FormDetailButton = (props) => {
	const navigate = useNavigate()
	const {setSubmitType, listApi} = props

	const clickEvent = (data) => {
		setSubmitType(data)
	}
	
	return (
		<Card className="formButton-fixed-container mb-0">
			<CardBody >
				<Row>
					<div style={{display:'flex', justifyContent:'flex-end'}}>
						<div style={{border:'1px solid white'}}><Button onClick={() => navigate(listApi)} color='report'>취소</Button></div>
						<div style={{border:'1px solid white'}}><Button type="submit" onClick={() => clickEvent('temporary')}  color='primary'>임시저장</Button></div>
						<div style={{backgroundColor:'white', border:'1px solid white'}}><Button type="submit" onClick={() => clickEvent('complete')} outline  color='primary'>저장하기</Button></div>
					</div>
				</Row>
			</CardBody>
		</Card>
	)
}

export { FormButton, FormPreviewButton, FormDetailButton }
