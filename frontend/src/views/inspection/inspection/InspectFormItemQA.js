import { Fragment, useEffect, useState } from "react"
import { Plus, X } from 'react-feather'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { CardBody, Col, FormFeedback, Input, Label, Row } from 'reactstrap'
import * as yup from 'yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { multiChoiceList } from '../data'
import { primaryColor } from "../../../utility/Utils"
const InspectFormItemQA = (props) => {
	const {
		parentIndex, 
		checkIndex, 
		itemIndex, 
		questionIndex, 
		setQuestionIndex, 
		setResolver, 
		resolver, 
		control, 
		errors, 
		setValue,
		unregister,
		getValues
	} = props

	const [multiSelect, setMultiSelect] = useState(multiChoiceList[0])

	const updateResolver = yup.object().shape({
		...resolver.schema,
		...resolver.fields,
		[`qaName_${parentIndex}${itemIndex}`] : yup.string().required('질문을 입력해주세요.').min(1, '1자 이상 입력해주세요')
	})

	const questionIndexCustom = (data, index) => {
		const tempQA = [...questionIndex]
		if (data === 'plus') {
			setValue(`choiceForm_${parentIndex}${tempQA[tempQA.length - 1] + 1}`, true)
			setValue(`discription_${parentIndex}${tempQA[tempQA.length - 1] + 1}`, false)
			setValue(`qaName_${parentIndex}${tempQA[tempQA.length - 1] + 1}`, '')
			setValue(`multiChoice_${parentIndex}${tempQA[tempQA.length - 1] + 1}`, multiChoiceList[0])
			setQuestionIndex(prevState => ({
				...prevState,
				[`${parentIndex}`]:[...prevState[`${parentIndex}`], tempQA[tempQA.length - 1] + 1]
			}))
		} else {

			unregister(`choiceForm_${parentIndex}${index}`)
			unregister(`multiChoice_${parentIndex}${index}`)
			unregister(`discription_${parentIndex}${index}`)
			unregister(`qaName_${parentIndex}${index}`)

			const deleteResolver = yup.object().shape({
				...resolver.fields,
				...resolver.schema
			})
			delete deleteResolver.fields[`qaName_${parentIndex}${itemIndex}`]
			setResolver(deleteResolver)
			setQuestionIndex(prevState => ({
				...prevState,
				[`${parentIndex}`] : prevState[`${parentIndex}`].filter((item) => item !== index)
			}))
		}
	}
	const questionState = () => {
		if (questionIndex.length === 1) {
			return <Plus color={primaryColor} className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('plus', itemIndex)}/>
		} else {
			if (questionIndex.length === checkIndex + 1) {
				return (
					<>
						<Plus color={primaryColor} className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('plus', itemIndex)}/>
						<X className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('minus', itemIndex)}/>
					</>
				)
			} else {
				return <X className='ms-1 cursor-pointer' onClick={() => questionIndexCustom('minus', itemIndex)}/>
			}
		}
	}

	const setValueMultiSelect = (e, name) => {
		setMultiSelect(e)
		setValue(name, e)
	}
	useEffect(() => {
		setMultiSelect(getValues(`multiChoice_${parentIndex}${itemIndex}`))
		setResolver(updateResolver)
	}, [])
	return (
		<Fragment>
			<CardBody>
				<Row  style={{alignItems : 'center'}}>
					<Col md ='6' xs = '12'>
						<Row>
							<Col className='card_table col text center'xs='2'>
								질문
							</Col>
							<Controller
								id={`qaName_${parentIndex}${itemIndex}`}
								name={`qaName_${parentIndex}${itemIndex}`}
								key = {`qaName_${parentIndex}${itemIndex}`}
								control={control}
								render={({ field }) => (
									<Col className='card_table col text' xs='10' style={{flexDirection:'column', alignItems:'start'}}>
										<Col xs={12} style={{display:'flex'}}>
											<Col xs={9}>
												<Input bsSize='sm' maxLength={498} placeholder={'점검항목명을 입력해주세요.'} invalid={errors[`qaName_${parentIndex}${itemIndex}`] && true} {...field} />
											</Col>
											<Col xs={3}>{questionState()}</Col>
										</Col>
										{errors[`qaName_${parentIndex}${itemIndex}`] && <div className='custom-form-feedback'>{errors[`qaName_${parentIndex}${itemIndex}`].message}</div>}
									</Col>
								)}
							/>
						</Row>
					</Col>
					<Col md ='6' xs = '12'>
						<Row>
							<Col className='card_table col text center' md='2' xs='3'>
								점검결과
							</Col>
							<Col className='card_table col text center' md='2' xs='3'>
								<Controller
									name={`choiceForm_${parentIndex}${itemIndex}`}
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='form-check'>
											<Input id={`choiceForm_${parentIndex}${itemIndex}_true`} value={true} type='radio' checked={value === true}
											onChange={() => onChange(true)}/>
											<Label className='form-check-label' for={`choiceForm_${parentIndex}${itemIndex}_true`}>
												주관식
											</Label>
										</Col>
									)}/>
							</Col>
							<Col className='card_table col text center' md='5' xs='6'>
								<Controller
									name={`choiceForm_${parentIndex}${itemIndex}`}
									control={control}
									render={({ field : {onChange, value} }) => (
										<Col className='d-flex form-check' style={{alignItems : 'center'}}>
											<Input id={`choiceForm_${parentIndex}${itemIndex}_false`} value={false} type='radio' checked={value === false}
											onChange={() => onChange(false)}/>
											<Label className='form-check-label me-1' for={`choiceForm_${parentIndex}${itemIndex}_false`}>
												객관식
											</Label>
											<Controller
												id = {`multiChoice_${parentIndex}${itemIndex}`}
												name={`multiChoice_${parentIndex}${itemIndex}`}
												control={control}
												render={() => (
													<Select
														isDisabled ={value}
														name={`multiChoice_${parentIndex}${itemIndex}`}
														classNamePrefix={'select'}
														className={`react-select custom-select-multiChoice_${parentIndex}${itemIndex} custom-react-select`}
														options={multiChoiceList}
														value={multiSelect}
														defaultValue={multiChoiceList[0]}
														onChange={(e) => setValueMultiSelect(e, `multiChoice_${parentIndex}${itemIndex}`)}
													/>
											)}/>
										</Col>
									)}/>
								
							</Col>
							<Col className='card_table col text center' style={{borderLeft : '1px solid #D8D6DE'}} md='1' xs='2'>
								비고
							</Col>
							<Col className='card_table col text start'   md='2' xs='10'>
								<Controller
									
									id={`discription_${parentIndex}${itemIndex}`}
									name={`discription_${parentIndex}${itemIndex}`}
									key = {`discription_${parentIndex}${itemIndex}`}
									control={control}
									render={({ field }) => <Input className='me-1' type='checkbox' {...field} defaultChecked={field.value}/>}
								/>
								비고
							</Col>
						</Row>
					</Col>
				</Row>
			</CardBody>
		</Fragment>
	)
}
export default InspectFormItemQA