import { Fragment } from "react"
import Flatpickr from "react-flatpickr"
import { Controller } from "react-hook-form"
import Select from 'react-select'
import { Button, Col, FormFeedback, Input, Label, ModalBody, Row } from "reactstrap"
import * as yup from 'yup'
import { selectBuildingTypeList } from "../data"
import moment from 'moment'
import { AddCommaOnChange, addCommaNumber, resultCheckFunc, getCommaDel } from '@utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const CreateLine = (props) => {
	const {id, redux, control, setValue, unregister, errors, lineList, setLineList, resolver, setResolver, trigger} = props

	// 함수 중첩 품의서용 콤마
	const approvalCommaValue = (value) => { return addCommaNumber(resultCheckFunc(getCommaDel(value))) }

	const handleAdd = () => {
		const tempLine = [...lineList]
		let lineIndex = 0
		if (tempLine.length !== 0) {
			lineIndex = tempLine[tempLine.length - 1] + 1
		}
		tempLine.push(lineIndex)

		setValue(`date_${lineIndex}`, moment().format('YYYY-MM-DD'))
		setValue(`title_${lineIndex}`, '')
		setValue(`company_${lineIndex}`, '')
		setValue(`buildingType_${lineIndex}`, {label:'기존건물', value:0})
		setValue(`building_${lineIndex}`, redux.buildingList[0])
		setValue(`price_${lineIndex}`, '')
		const currentResolver = yup.object().shape({
			...resolver.fields,
			[`date_${lineIndex}`]: yup.string().required('날짜를 입력해주세요.'), 
			[`title_${lineIndex}`]: yup.string().required('공사명를 입력해주세요.'),
			[`company_${lineIndex}`]: yup.string().required('업체명를 입력해주세요.'),
			[`price_${lineIndex}`]: yup.string().required('금액을 입력해주세요.').matches(/^[\d,\.]+$/g, '올바른 금액형태로 입력해주세요.')
		})
		setResolver(currentResolver)
		setLineList(tempLine)
	}

	const handleDelete = () => {
		const currentResolver = yup.object().shape({...resolver.fields})
		unregister(`date_${id}`)
		unregister(`title_${id}`)
		unregister(`company_${id}`)
		unregister(`buildingType_${id}`)
		unregister(`building_${id}`)
		unregister(`price_${id}`)
		delete currentResolver.fields[`date_${id}`]
		delete currentResolver.fields[`title_${id}`]
		delete currentResolver.fields[`company_${id}`]
		delete currentResolver.fields[`price_${id}`]

		setLineList(lineList.filter(line => line !== id))
		setResolver(currentResolver)
	}

	return (
		<Fragment>
			<ModalBody className='ms-1 me-1' style={{ backgroundColor:'#fff', borderBottomLeftRadius : '0.357rem', borderBottomRightRadius : '0.357rem', height:'auto'}}>
				<Row>
					<Col xs={12} md={3}>
						<Label className="card_table col center form-check-label custom_label">날짜&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							name={`date_${id}`}
							control={control}
							render={({field : {onChange, value}}) => (
							<Flatpickr
								value={value}
								id='range-picker'
								className='form-control'
								onChange={date => onChange(moment(date[0]).format('YYYY-MM-DD'))}
								options={{
									mode: 'single', 
									maxDate: moment().format('YYYY-MM-DD'),
									ariaDateFormat:'Y-m-d',
									locale: Korean
								}}/>
							)}/>
					</Col>
					<Col xs={12} md={6}>
						<Label className="card_table col center form-check-label custom_label">공사명&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							name={`title_${id}`}
							control={control}
							render={({ field }) => (
								<Fragment>
									<Input maxLength={90} style={{width:'100%'}} invalid={errors[`title_${id}`] && true} {...field}/>
									{errors[`title_${id}`] && <FormFeedback>{errors[`title_${id}`].message}</FormFeedback>}
								</Fragment>
						)}/>
					</Col>
					<Col xs={12} md={3}>
						<Label className="card_table col center form-check-label custom_label">업체명&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							name={`company_${id}`}
							control={control}
							render={({ field }) => (
								<Fragment>
									<Input maxLength={90} style={{width:'100%'}} invalid={errors[`company_${id}`] && true} {...field}/>
									{errors[`company_${id}`] && <FormFeedback>{errors[`company_${id}`].message}</FormFeedback>}
								</Fragment>
						)}/>
					</Col>
				</Row>
				<br/>
				<Row >
					<Col xs={12} md={3}>
						<Label className="card_table col center form-check-label custom_label">건물구분&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							name={`buildingType_${id}`}
							control={control}
							render={({ field: {onChange, value} }) => (
								<Fragment>
									<Select
										name='employeeClass'
										classNamePrefix={'select'}
										className="react-select custom-select-employeeClass custom-react-select"
										options={selectBuildingTypeList}
										value={value}
										onChange={e => onChange(e) }/>
								</Fragment>
						)}/>
					</Col>
					<Col xs={12} md={6}>
						<Label className="card_table col center form-check-label custom_label">건물명&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							name={`building_${id}`}
							control={control}
							render={({ field: {onChange, value} }) => (
								<Fragment>
									<Select
										name='employeeClass'
										classNamePrefix={'select'}
										className="react-select custom-select-employeeClass custom-react-select"
										options={redux.buildingList}
										value={value}
										onChange={e => onChange(e) }/>
								</Fragment>
						)}/>
					</Col>
					<Col xs={12} md={3}>
						<Label className="card_table col center form-check-label custom_label">금액&nbsp;
							<div className='essential_value'/>
						</Label>
						<Controller
							name={`price_${id}`}
							control={control}
							render={({ field : {onChange, value}}) => (
								<Fragment>
									<Input 
										style={{width:'100%', textAlign:'end'}} 
										invalid={errors[`price_${id}`] && true} 
										onChange={(e) => { 
											AddCommaOnChange(e, onChange, true)
											trigger(`price_${id}`)
										}}
										value={approvalCommaValue(value)}
										/>
									{errors[`price_${id}`] && <FormFeedback>{errors[`price_${id}`].message}</FormFeedback>}
								</Fragment>
						)}/>
					</Col>
				</Row>
				<br/>
				<Row hidden={redux.modalPageType === 'modify' && true}>
					<Col className='d-flex justify-content-end'>
						<Button outline style={{marginRight:'1em'}} onClick={() => handleAdd()}>추가</Button>
						{lineList.length !== 1 && <Button outline onClick={() => handleDelete()}>삭제</Button>}
					</Col>
				</Row>
			</ModalBody>
		</Fragment>
	)
}

export default CreateLine