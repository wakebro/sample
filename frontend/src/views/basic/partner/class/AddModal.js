import { setIsOpen, setMainClass, setMainClassList, setMidClass, setMidClassList, setSubClass } from '@store/module/basicPnrClass'
import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'
import { X } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Input, Label, Modal, Row } from "reactstrap"
import { API_BASICINFO_PARTNER_CLASS } from '../../../../constants'
import { setName, setPageType } from '../../../../redux/module/basicPnrClass'
import { axiosPostPutRedux, selectListType } from '../../../../utility/Utils'
import { partnerClassList } from '../data'
import { pageTypeKor } from '../../../system/auth/data'

const setReduxObj = {
	mainClass: setMainClass,
	midClass: setMidClass,
	subClass: setSubClass,
	midClassList: setMainClassList,
	subClassList: setMidClassList
}

const AddModal = () => {
	const dispatch = useDispatch()
	const basicPnrClass = useSelector((state) => state.basicPnrClass)
	const [radio, setRadio] = useState(partnerClassList[0].value.split('_')[0])
	const [err, setErr] = useState(false)

	const closeModal = () => {
		dispatch(setIsOpen(false))
		setRadio(partnerClassList[0].value.split('_')[0])
	}

	const resetRedux = (radio) => {
		if (radio === undefined) dispatch(setMainClass(''))
		dispatch(setMidClass(''))
		dispatch(setSubClass(''))
		dispatch(setMidClassList([]))
		if (basicPnrClass.pageType === 'modify') dispatch(setSubClass(basicPnrClass.name))
	}

	const setClassList = (classList, dataList) => {
		let sliceRange = null
		if (basicPnrClass.pageType === 'modify') {
			if (classList === 'midClassList') sliceRange = 2
			else if (classList === 'subClassList') sliceRange = 4
		}

		const tempList = []
		dataList.map(row => {
			tempList.push(selectListType('', row, ['name'], 'code'))
			if (basicPnrClass.pageType === 'modify' && row.code.substr(0, sliceRange) === basicPnrClass.code.substr(0, sliceRange)) {
				if (classList === 'midClassList') {
					dispatch(setMainClass(selectListType('', row, ['name'], 'code')))
					dispatch(setReduxObj['midClass'](basicPnrClass.name))
				} else if (classList === 'subClassList') {
					dispatch(setMidClass(selectListType('', row, ['name'], 'code')))
					dispatch(setReduxObj['subClass'](basicPnrClass.name))
				}
			}
		})
		dispatch(setReduxObj[classList](tempList))
	}
	
	const getClassList = (outputClass, mainData = null) => {
		axios.get(API_BASICINFO_PARTNER_CLASS, {
			params: {
				main: mainData, 
				class: outputClass
			}
		})
		.then(res => {
			setClassList(`${outputClass}ClassList`, res.data)
		})
	}

	const getClass = () => {
		axios.get(`${API_BASICINFO_PARTNER_CLASS}/${basicPnrClass.code}`)
		.then(res => {
			let className = 'sub'
			if (res.data.code.substr(2) === '0000') className = 'main'
			else if (res.data.code.substr(2) !== '0000' && res.data.code.substr(4) === '00') className = 'mid'

			setRadio(className)
			if (className === 'main') {
				dispatch(setIsOpen(true))
				dispatch(setMainClass(res.data.name))
			} else dispatch(setName(res.data.name))
		})
	}

	const handleSelectClass = (e, event) => { dispatch(setReduxObj[event.name](e)) }

	const handleSubmit = (event) => {
		event.preventDefault()
		const className = event.target[`${radio}Class`].id
		const element = document.querySelector(`.${className}`)
		if (event.target[`${radio}Class`].value === '') {
			element.style.borderColor = 'red'
			setErr(true)
			return false
		}

		let beforeData = null
		if (radio !== 'main') {
			partnerClassList.map((classData, idx) => {
				const value = `${classData.value.split('_')[0]}Class`
				if (value === className) {
					beforeData = basicPnrClass[`${partnerClassList[idx - 1].value.split('_')[0]}Class`].value
				}
			})
		}

		const formData = new FormData()
		formData.append('class', radio)
		formData.append('name', event.target[`${radio}Class`].value)
		
		if (beforeData !== null) {
			if (className === 'midClass') beforeData = beforeData.slice(0, 2)
			if (className === 'subClass') beforeData = beforeData.slice(0, 4)
			formData.append('top', beforeData)
		}


		const API = basicPnrClass.pageType === 'register' ? `${API_BASICINFO_PARTNER_CLASS}/-1`
											: `${API_BASICINFO_PARTNER_CLASS}/${basicPnrClass.code}`

		axiosPostPutRedux(basicPnrClass.pageType, '협력업체분류', API, formData, dispatch, setIsOpen, false)
	}

	const handleDisable = () => {
		switch (radio) {
			case 'sub':
				if (basicPnrClass.midClass === '') return true
			default:
				return false
		}
	}

	const outputRegisterList = () => {
		if (basicPnrClass.isOpen) {
			let range = null
			partnerClassList.filter(classData => {
				if (classData.value.split('_')[0] === radio) {
					range = parseInt(classData.value.split('_')[1])
				}
			})

			return (
				<Form onSubmit={handleSubmit}>
					{
						partnerClassList.map((classData, idx) => {
							const label = classData.label
							const value = classData.value.split('_')[0]
							let beforeData = null
							if (value !== 'main') {
								beforeData = partnerClassList[idx - 1].value.split('_')[0]
							}
							const beforeLabel = value !== 'main' ? partnerClassList[idx - 1].label : ''
							const isDisabled = idx !== 0 && (basicPnrClass[`${beforeData}Class`] === null || basicPnrClass[`${beforeData}Class`] === '')
							if (idx <= range) {
								return (
									<Card key={idx} style={{margin:'5% 0'}}>
										<Label className='form-label' for={`${value}Class`}>{value === radio ? `${label}명` : label}</Label>
										{
											value === radio ?
												<>
													<Input 
														className={`${value}Class`}
														disabled={isDisabled} 
														type='text' id={`${value}Class`} value={basicPnrClass[`${value}Class`]} 
														onChange={(e) => {
															const className = e.target.id
															const element = document.querySelector(`.${className}`)
															if (e.target.value !== '') {
																element.style.borderColor = ''
																setErr(false)
															} else {
																element.style.borderColor = 'red'
																setErr(true)
															}
															dispatch(setReduxObj[e.target.id](e.target.value))
														}}
														name={`${value}Class`}
													/>
													{err === true && <div style={{color:'#ea5455', fontSize:'0.857rem'}}>분류명을 입력해주세요.</div>}
												</>
											:
												<Select
													name={`${value}Class`}
													classNamePrefix={'select'}
													className="react-select"
													options={basicPnrClass[`${value}ClassList`]}
													value={basicPnrClass[`${value}Class`]}
													onChange={handleSelectClass}
													isDisabled={isDisabled}
													placeholder={<span className='custom-placeholder'>{isDisabled ? `${beforeLabel}를 먼저 선택해주세요.` : `${label}를 선택해주세요.`}</span>}
												/>
										}
									</Card>
								)
							}
							return false
						})
					}
					<CardFooter>
						<Row>
							<Col style={{textAlign:'end'}}>
								<Button color="report" onClick={() => closeModal()}>취소</Button>
								&nbsp;&nbsp;&nbsp;
								<Button disabled={basicPnrClass.pageType === 'register' ? false : handleDisable()} color='primary' onSubmit={() => handleSubmit}>확인</Button>
							</Col>
						</Row>
					</CardFooter>
				</Form>
			)
		}
	}

	useEffect(() => {
		if (!basicPnrClass.isOpen) setRadio(partnerClassList[0].value.split('_')[0])
	}, [basicPnrClass.isOpen])

	useEffect(() => {
		if (basicPnrClass.isOpen) {
			resetRedux()
			if (radio !== 'main' && basicPnrClass.isOpen && basicPnrClass.mainClassList.length === 0 && basicPnrClass.pageType === 'register') {
				getClassList('mid')
			}
		}
	}, [radio])

	useEffect(() => {
		if (basicPnrClass.isOpen) {
			if (radio === 'sub' && basicPnrClass.mainClass !== '') {
				resetRedux(radio)
				getClassList(radio, basicPnrClass.mainClass.value)
			}
		}
	}, [basicPnrClass.mainClass])

	useEffect(() => {
		if (basicPnrClass.code !== null) {
			dispatch(setPageType('modify'))
		}
	}, [basicPnrClass.code])

	useEffect(() => {
		if (basicPnrClass.pageType === 'modify') getClass()
	}, [basicPnrClass.pageType])

	useEffect(() => {
		if (basicPnrClass.name !== '') {
			dispatch(setIsOpen(true))
			getClassList('mid')
		}
	}, [basicPnrClass.name])

	return (
		<Fragment>
			{
				basicPnrClass.isOpen &&
					<Modal isOpen={basicPnrClass.isOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-lg'>
						<Card style={{margin:'0'}}>
							<CardHeader>
								<CardTitle>{`분류${pageTypeKor[basicPnrClass.pageType]}`}</CardTitle>
								<X style={{cursor:'pointer'}} onClick={() => closeModal()}/>
							</CardHeader>
							<CardBody>
								<Row style={{margin:'0'}}>
									<Col md='6' xs='12'>
										<Row>
											{
												partnerClassList.map(classData => {
													const value = classData.value.split('_')[0]
													return (
														<Col key={value} className='form-check'>
															<Input disabled={basicPnrClass.pageType === 'modify'} id={`pnrClass_${value}`} value={value} type='radio' checked={radio === value} onChange={() => setRadio(value)}/>
															<Label className='form-check-label' for={`pnrClass_${value}`}>{classData.label}</Label>
														</Col>
													)
												})
											}
										</Row>
									</Col>
								</Row>

								{outputRegisterList()}
							</CardBody>
							
						</Card>
					</Modal>
			}
		</Fragment>
	)
}

export default AddModal