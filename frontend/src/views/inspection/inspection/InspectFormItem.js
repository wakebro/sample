import { Fragment, useState, useEffect } from "react"
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import { X } from 'react-feather'
import { Card, CardBody, Col, FormFeedback, Input, Row } from 'reactstrap'
import { checkSelectValue, primaryHeaderColor } from '../../../utility/Utils'
import { timeListOption } from '../../inspection/data'
import InspectFormItemQA from './InspectFormItemQA'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import * as yup from 'yup'
import { useSelector } from 'react-redux'

const InspectFormItem = (props) => {
	const {
		itemIndex, control, setValue, 
		getValues, errors, setResolver, 
		resolver, unregister, items, 
		itemsSet, questionIndex, setQuestionIndex
	} = props
	const [checkTime, setCheckTime] = useState(true)
	const [selectError, setSelectError] = useState({[`timeList${itemIndex}`] : false})
	const {timeList} = selectError
	const previewData = useSelector((state) => state.inspectionPreview)

	const handleSelectValidation = (e, event) => {
		checkSelectValue(e, event, selectError, setSelectError, setValue)
	}

	const createQA = () => {
		return (
			questionIndex[itemIndex].map((v, i) => {
				return <InspectFormItemQA 
				key={v}
				parentIndex = {itemIndex} 
				checkIndex ={i} 
				itemIndex={v} 
				questionIndex={questionIndex[itemIndex]} 
				setQuestionIndex={setQuestionIndex}
				setResolver={setResolver} 
				resolver={resolver}
				control={control}
				errors={errors}
				setValue={setValue}
				getValues={getValues}
				unregister={unregister}
				/>
			})
		)
	}
	const deleteForm = () => {
		const checkItems = [...items]
		const deleteItems = checkItems.filter((data) => data !== itemIndex)
		const deleteResolver = yup.object().shape({
			...resolver.fields,
			...resolver.schema
		})
		questionIndex[itemIndex].forEach((item) => {
				unregister(`choiceForm_${itemIndex}${item}`)
				unregister(`multiChoice_${itemIndex}${item}`)
				unregister(`discription_${itemIndex}${item}`)
				unregister(`qaName_${itemIndex}${item}`)
				delete deleteResolver.fields[`qaName_${itemIndex}${item}`]
			}
		)

		const questionDelete = {...questionIndex}
		delete questionDelete[itemIndex]
		setQuestionIndex(questionDelete)

		unregister(`checkListName${itemIndex}`)
		unregister(`middleCategory${itemIndex}`)
		unregister(`timeType${itemIndex}`)
		unregister(`timeList${itemIndex}`)
		delete deleteResolver.fields[`checkListName${itemIndex}`]
		setResolver(deleteResolver)
		itemsSet(deleteItems)
	}
	useEffect(() => {
		setCheckTime(!getValues(`timeType${itemIndex}`))
	}, [])

	return (
		<Fragment>
			<Card>
				<Col className="custom-card-header">
					<div className="custom-create-title">항목 설정</div>
					<div className='essential_value'/>
					<Col style={{display: 'flex', justifyContent : 'flex-end'}}>
						<X className='ms-1 cursor-pointer' onClick={() => deleteForm()}/>	
					</Col>
				</Col>
				<hr className="mb-0"/>
				{ previewData.reportType === 'inspection' && 
				<CardBody>
					<Row>
						<div className='d-flex mb-1'>
							<span className='d-flex align-items-center justify-content-center me-1 ms-1 alig'>점검항목 분류</span>
							<div className='d-flex align-items-center justify-content-center me-1'>
								<Controller
									id={`timeType${itemIndex}`}
									name={`timeType${itemIndex}`}
									key={`timeType${itemIndex}`}
									control={control}
									render={({ field}) => <Input type='checkbox' {...field} defaultChecked={field.value} onClick={() => setCheckTime(field.value)} />}
								/>
								{errors[`timeType${itemIndex}`] && <FormFeedback>{errors[`timeType${itemIndex}`].message}</FormFeedback>}
								시간별
							</div>
							<div className='d-flex align-items-center justify-content-center'>
								<Controller
									id = {`timeList${itemIndex}`}
									name={`timeList${itemIndex}`}
									control={control}
									render={({ field: { value } }) => (
										<Col className='card_table col text center' style={{flexDirection:'column', alignItems:'start'}}>
											<Select
												isDisabled = {checkTime}
												name={`timeList${itemIndex}`}
												maxMenuHeight={'150px'}
												classNamePrefix={'select'}
												className={`react-select custom-select-timeList${itemIndex} custom-react-select`}
												options={timeListOption}
												value={value}
												defaultValue={timeListOption[0]}
												onChange={ handleSelectValidation }
												/>
											{timeList && <div  style={{color:'#ea5455', fontSize:'0.857rem'}}>시간을 선택해주세요.</div>}
										</Col>
								)}/>
							</div>
						</div>
					</Row>
				</CardBody>
				}
				<CardBody style={{backgroundColor : primaryHeaderColor}}>
					<Row >
						<Col md ='6' xs = '12'>
							<Row>
								<Col className='card_table col text center'xs='2'>
									점검 항목명
								</Col>
								<Col className='card_table col text center' xs='10'>
									<Controller
										id={`checkListName${itemIndex}`}
										name={`checkListName${itemIndex}`}
										key = {`checkListName${itemIndex}`}
										control={control}
										render={({ field }) => <Input bsSize='sm' maxLength={250} placeholder={'점검항목명을 입력해주세요.'} invalid={errors[`checkListName${itemIndex}`] && true} {...field} />}
									/>
									{errors[`checkListName${itemIndex}`] && <FormFeedback>{errors[`checkListName${itemIndex}`].message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
						<Col md ='6' xs = '12'>
							<Row>
								<Col className='card_table col text center'xs='2'>
									중분류
								</Col>
								<Col className='card_table col text center' xs='10'>
									<Controller
										id={`middleCategory${itemIndex}`}
										name={`middleCategory${itemIndex}`}
										key = {`middleCategory${itemIndex}`}
										control={control}
										render={({ field }) => <Input bsSize='sm' maxLength={250} placeholder={'중분류을 입력해주세요.'}  {...field} />}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				{createQA()}
			</Card>
		</Fragment>
	)
}
export default InspectFormItem