import { Fragment, useEffect, useState } from "react"
import { Card, CardBody, Col, Input, Row } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { debounce } from 'lodash'
import { Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import Select from 'react-select'
import { OXChoiceList, scoreChoiceList, fiveSelectList } from '../data'
import PreviewModal from './PreviewModal'
const PC_MIN_WIDTH = 768

const PreviewSection = (props) => {
	// certificate
	const {control, setValue, getValues} = props
	const sectionData = useSelector((state) => state.inspectionPreview.section)
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
	
	const test = (data) => {
		if (windowSize.width <= PC_MIN_WIDTH) {
			setModal(!modal)
			setInputModal(data)
		}
	}

	const descriptionTemp = (data) => {
		if (data !== undefined) {
			if (data['question_list'] !== undefined) {
				let check = false
				data['question_list'].forEach((v) => {
					if (v['use_description']) {
						check = true
					}
				})
				if (check) {
					return (
						<Col>
							비고
						</Col>
					)
				}
			}
		}
	}
	const QaListTemp = (data, parent) => {
		let check = false
		data['question_list'].forEach((v) => {
			if (v['use_description']) {
				check = true
			}
		})
		return (
			data['question_list'].map((v, i) => {
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
						<Col className='mt-1 mb-1' lg={check ? 4 : 6} md={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
							{v['title']}
						</Col>
						<Col className='mt-1 mb-1' lg={check ? 4 : 6} md={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
							{
								v['is_choicable'] ? 
									<Input/>
								: 
								<Select
									maxMenuHeight={'150px'}
									classNamePrefix={'select'}
									className={`react-select`}
									options={tempOption}
									defaultValue={tempOption[0]}
									/>
							}
						</Col>
						{v['use_description'] && 
						<Col className='mt-1 mb-1' lg={4} md={4}>
							<Controller
									
									id={`discription_${parent}${i}`}
									name={`discription_${parent}${i}`}
									key = {`discription_${parent}${i}`}
									control={control}
									render={({ field }) => <Input type='textarea' rows = '1'  style={{display:"flex", alignItems : 'center'}} onClick={() => test(`discription_${parent}${i}`)} {...field}/>}
								/>
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
									{ console.log(data, i) }
									let check_hour = "\b"
									if (data['check_hour_status']) {
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
														점검결과
													</Col>
													{descriptionTemp(data)}
												</Row>
												{QaListTemp(data, i)}
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
				</Card>
				<PreviewModal modal = {modal} setModal = {setModal} inputName = {inputModal} setValue={setValue} getValues={getValues} />
		</Fragment>
	)
}
export default PreviewSection