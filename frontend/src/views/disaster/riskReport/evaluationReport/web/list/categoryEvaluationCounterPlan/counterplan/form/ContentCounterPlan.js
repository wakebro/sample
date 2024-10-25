/* eslint-disable */
import ImageFileUploaderMulti from "@views/apps/customFiles/ImageFileUploaderMulti"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import Select from 'react-select'
import { CardBody, Col, Input, Row } from "reactstrap"
import { FREQUENCY_3X3, FREQUENCY_5X5, evaluationTypeLimit, typeSelectList } from "../../../../data"
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'

const ContentCounterPlan = (props) => {
	const {data, num, control, setValue, watch, files, setFiles} = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const [limit] = useState(evaluationTypeLimit[criticalDisaster.registerFormType.value])
	const [selectList, setSelectList] = useState([])
	const type = criticalDisaster.registerFormType.value
	const dispatch = useDispatch()

	function customSetFiles(filesList) {
		const firstKey = typeof (data.index) === 'number' ? data.index : Number(data.index)
		const secondKey = 'counterplan'
		const copyFiles = {...files}
		copyFiles[firstKey][secondKey] = filesList
		setFiles(copyFiles)
		dispatch(setTabTempSaveCheck(false))
	}
	
	useEffect(() => {
		setSelectList(typeSelectList[criticalDisaster.registerFormType.value])
	}, [criticalDisaster.registerFormType.value])
	return (
		<CardBody>
			<Row className='card_table top'>
				<Col xs='12'>
					<Row className='card_table table_row'>
						<Col xs='12' className='card_table col col_color text center' style={{borderRight:'0px'}}>예방대책 {num}</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row'>
						<Col xs='12' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3'}}>
							<Row className='mx-0'>
								<Col className='px-2 py-2 border-x border-y'>
									<ImageFileUploaderMulti
										setFiles={customSetFiles}
										files={files[data.index]['counterplan']}
										fileNumLimit={1}
										fileMaxSize={20000000}
										sizeOverMessage={'20MB 이하의 이미지를 업로드 하세요.'}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row' style={{minHeight:'48px'}}>
						<Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
							<div>조치사항</div>
						</Col>
						<Col xs='9' className="card_table col" style={{display:'flex', alignItems:'center'}}>
							<Controller
								name={`nowAction_${data.index}`}
								control={control}
								render={({ field: {onChange, value} }) => <Input type='textarea' rows='1'
									onChange={e => {
										onChange(e)
										dispatch(setTabTempSaveCheck(false))
									}}
									value={value}
								/>}
							/>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row' style={{minHeight:'48px'}}>
						<Col xs='8' className='card_table col text center' style={{display:'flex', alignItems:'center', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>예방대책</Col>
						<Col xs='4' className='card_table text center' style={{display:'flex', alignItems:'center', flexDirection:'column'}}><div>개선후</div><div>위험성</div></Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row' style={{minHeight:'63px'}}>
						<Col xs='8' className='card_table col text center' style={{display:'flex', alignItems:'center', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
							<Controller
								name={`counterplan_${data.index}`}
								control={control}
								render={({ field: {onChange, value} }) => <Input type='textarea' rows='1'
									onChange={e => {
										onChange(e)
										dispatch(setTabTempSaveCheck(false))
									}}
									value={value}
								/>}
							/>
						</Col>
						<Col xs='4' className='card_table text center' style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
							<Controller
								name={`dangerousness_${data.index}`}
								control={control}
								render={({ field: { onChange, value } }) => (
									<Select
										isDisabled = {(type === FREQUENCY_3X3 || type === FREQUENCY_5X5) ? watch(`multiResult_${data.index}`) < limit ? true : false
													: false}
										name={`dangerousness_${data.index}`}
										classNamePrefix='select'
										className='react-select custom-select-code custom-react-select'
										value={value}
										options={selectList}
										placeholder='선택'
										onChange={(e) => {
											onChange(e)
											dispatch(setTabTempSaveCheck(false))
										}}
									/>
								)}/>
						</Col>
					</Row>
				</Col>
			</Row>
		</CardBody>
	)
}

export default ContentCounterPlan