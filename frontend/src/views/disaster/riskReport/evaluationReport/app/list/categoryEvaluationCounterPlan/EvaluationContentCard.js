/* eslint-disable */
import { primaryColor, setStringDate } from "@utils"
import moment from "moment"
import { Fragment, useEffect, useState } from "react"
import { Calendar, Camera, Image } from "react-feather"
import Flatpickr from 'react-flatpickr'
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Select from 'react-select'
import { Button, Card, CardBody, CardTitle, Col, Input, InputGroup, InputGroupText, Label, Row } from "reactstrap"
import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, NOMAL, STEP_3, getMultiResult, typeSelectList } from "../../../web/data"
import { ChecklistApp, ChecklistAppResult, FrequencyApp, FrequencyAppResult, Step3App, Step3AppResult } from "./EvaluationContentType"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import { isEmptyObject } from "jquery"

const EvaluationContentCard = (props) => {
	const { control, setValue, watch, managerList, files, setFiles, data, dataIdx, dataLen, isNotWorker } = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const [selectList, setSelectList] = useState([])
	const [type, setType] = useState()
	const [fileInfo, setFileInfo] = useState({
		evalutionPath: '',
		evalutionFileName: '',
		counterplanPath: '',
		counterplanFileName: ''
	})

	const onChangeFile = e => {
		const fileList = e.target.files[0]
		const firstKey = dataIdx
		const secondKeyEval = 'evaluation'
		const secondKeyCount = 'counterplan'

		const copyFiles = {...files}
		if (e.target.name.includes('plan')) copyFiles[firstKey][secondKeyCount] = [fileList]
		else copyFiles[firstKey][secondKeyEval] = [fileList]
		setFiles(copyFiles)
	}


	useEffect(() => {
		if (criticalDisaster.registerFormType.value !== '') {
			setSelectList(typeSelectList[criticalDisaster.registerFormType.value])
			setType(criticalDisaster.registerFormType.value)
		}
	}, [criticalDisaster.registerFormType.value])

	useEffect(() => {
		if (!isEmptyObject(files)) {
			const tempFileInfo = {...fileInfo}
			const firstKey = dataIdx
			const secondKeyEval = 'evaluation'
			const secondKeyCount = 'counterplan'
			if (files[dataIdx][secondKeyEval].length !== 0) {
				tempFileInfo.evalutionPath = files[firstKey][secondKeyEval][0]['path']
				tempFileInfo.evalutionFileName = files[firstKey][secondKeyEval][0]['file_name']
			}
			if (files[dataIdx][secondKeyCount].length !== 0) {
				tempFileInfo.counterplanPath = files[firstKey][secondKeyCount][0]['path']
				tempFileInfo.counterplanFileName = files[firstKey][secondKeyCount][0]['file_name']
			}
			setFileInfo(tempFileInfo)
		}
	}, [files[dataIdx]])

	return (
		<Fragment>
			<Card>
				<Card style={{marginBottom:'0'}}>
					<CardBody>
						<Row>
							<Col xs={12} style={{display:'flex', flexDirection:'row-reverse'}}>
								<span className='basic-badge evaluation-app-index' style={{minWidth:'70px'}}>
									{`${dataIdx + 1}/${dataLen}`}
								</span>
							</Col>
						</Row>
						<Row>
							<Col xs={6}>
								<Label className='form-label' for='scene'>세부작업</Label>
								<h4 id='scene'>{data.inputDetail}</h4>
							</Col>
							<Col xs={6}>
								<Label className='form-label' for='date'>위험분류</Label>
								<h4 id='scene'>{data.selectDanger.label}</h4>
							</Col>
						</Row>
						<hr/>
						<Row>
							<Col xs={12}>
								<Label className='form-label' for='scene'>위험발생 상황 및 결과</Label>
								<h4 id='scene'>{data.inputResult}</h4>
							</Col>
						</Row>
						<hr/>
						<Row>
							<Col xs={12}>
								<Label className='form-label' for='scene'>관련근거(법적)</Label>
								<h4 id='scene'>{data.inputReason}</h4>
							</Col>
						</Row>
						<hr/>
						<Row>
							<Col xs={12}>
								<Label className='form-label' for='scene'>현재의 안전보건조치</Label>
								<Controller
									name={`nowAction_${dataIdx}`}
									control={control}
									render={({ field }) => (<Input disabled={isNotWorker} type='textarea' rows='1' {...field} />)}/>
							</Col>
						</Row>
					</CardBody>
				</Card>

				<Card style={{margin:0, backgroundColor:'#EBF3FF'}}>
					<CardBody style={{marginBottom:'50px'}}>
						<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
							<CardTitle style={{margin:'0'}}>
								<span className='basic-badge evaluation-app'>
									위험성 평가
								</span>
							</CardTitle>
						</Col>
						{
							(type === FREQUENCY_3X3 || type === FREQUENCY_5X5) && <FrequencyApp control={control} setValue={setValue} selectList={selectList} isNotWorker={isNotWorker} dataIdx={dataIdx}/>
						}
						{
							(type === STEP_3) && <Step3App control={control} setValue={setValue} selectList={selectList} isNotWorker={isNotWorker} dataIdx={dataIdx}/>
						}
						{
							(type === CHECKLIST) && <ChecklistApp control={control} setValue={setValue} selectList={selectList} isNotWorker={isNotWorker} dataIdx={dataIdx}/>
						}
						<hr/>
						<Row style={{marginTop:'30px', alignItems:'center'}}>
							<Col xs={5} style={{textAlign:'end'}}>
								<h4 id='scene'>위험성</h4>
							</Col>
							{
								(type === FREQUENCY_3X3 || type === FREQUENCY_5X5) && <FrequencyAppResult control={control} watch={watch} type={type} dataIdx={dataIdx}/>
							}
							{
								(type === STEP_3) && <Step3AppResult control={control} watch={watch} type={type} dataIdx={dataIdx}/>
							}
							{
								(type === CHECKLIST) && <ChecklistAppResult control={control} watch={watch} type={type} dataIdx={dataIdx}/>
							}
						</Row>
					</CardBody>
				</Card>
			</Card>

			{
				getMultiResult(type, watch(`multiResult_${dataIdx}`)) >= NOMAL &&
				<Card>
					<CardBody>
						<Row>
							<Col xs={12}>
								<Label className='form-label' for='date'>위험성 감소대책</Label>
								<Controller
									name={`counterplan_${dataIdx}`}
									control={control}
									render={({ field }) => <Input disabled={isNotWorker} type='textarea' rows='1' {...field} />}
								/>
							</Col>
						</Row>
						<hr/>
						<Row>
							<Col xs={7}>
								<Label className='form-label' for='scene'>개선 예정일</Label>
								<Controller
									name={`schedule_${dataIdx}`}
									control={control}
									render={({ field : {onChange, value}}) => {
										return (
											watch(`schedule_${dataIdx}`) === ''
											?
												<InputGroup>
													<Flatpickr
														disabled={isNotWorker}
														id='range-picker'
														className= {`form-control`}
														placeholder={moment().format('YYYY-MM-DD')}
														value={value}
														onChange={(data) => {
															const newData = setStringDate(data)[0]
															onChange(newData)
														}}
														options={{
															mode: 'single',
															dateFormat: 'Y-m-d',
															locale: Korean
														}}/>
													<InputGroupText><Calendar color='#B9B9C3'/></InputGroupText>
												</InputGroup>
											:
												<Flatpickr
													disabled={isNotWorker}
													id='range-picker'
													className= {`form-control`}
													placeholder={moment().format('YYYY-MM-DD')}
													value={value}
													onChange={(data) => {
														const newData = setStringDate(data)[0]
														onChange(newData)
													}}
													options={{
														mode: 'single',
														dateFormat: 'Y-m-d',
														locale: Korean
													}}/>
										)
									}}/>
							</Col>
							<Col xs={5}>
								<Label className='form-label' for='date'>담당자</Label>
								<Controller
									name={`manager_${dataIdx}`}
									control={control}
									render={({ field: { onChange, value } }) => (
										<Select
											name={`manager_${dataIdx}`}
											classNamePrefix='select'
											isDisabled={isNotWorker}
											className={`react-select custom-select-manager_${dataIdx} custom-react-select`}
											value={value}
											options={managerList}
											onChange={(e) => onChange(e)}/>
									)}/>
							</Col>
						</Row>
						<hr/>
						<Row>
							<Col xs={7}>
								<Label className='form-label' for='scene'>개선 완료일</Label>
								<Controller
									name={`complete_${dataIdx}`}
									control={control}
									render={({ field : {onChange, value}}) => {
										return (
											watch(`complete_${dataIdx}`) === ''
											?
												<InputGroup>
													<Flatpickr
														id='range-picker'
														disabled={isNotWorker}
														className= {`form-control`}
														placeholder={moment().format('YYYY-MM-DD')}
														value={value}
														onChange={(data) => {
															const newData = setStringDate(data)[0]
															onChange(newData)
														}}
														options={{
															mode: 'single',
															dateFormat: 'Y-m-d',
															locale: Korean
														}}/>
													<InputGroupText><Calendar color='#B9B9C3'/></InputGroupText>
												</InputGroup>
											:
												<Flatpickr
													id='range-picker'
													disabled={isNotWorker}
													className= {`form-control`}
													placeholder={moment().format('YYYY-MM-DD')}
													value={value}
													onChange={(data) => {
														const newData = setStringDate(data)[0]
														onChange(newData)
													}}
													options={{
														mode: 'single',
														dateFormat: 'Y-m-d',
														locale: Korean
													}}/>
										)
									}}/>
							</Col>
							<Col xs={5}>
								<Label className='form-label' for='date'>개선 후 위험성</Label>
								<Controller
									name={`dangerousness_${dataIdx}`}
									control={control}
									render={({ field: { onChange, value } }) => (
										<Select
											name={`dangerousness_${dataIdx}`}
											classNamePrefix='select'
											isDisabled={isNotWorker}
											className={`react-select custom-select-dangerousness_${dataIdx} custom-react-select`}
											value={value}
											options={selectList}
											onChange={(e) => onChange(e)}
										/>
									)}/>
							</Col>
						</Row>
						<hr/>
						<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
							<CardTitle style={{margin:'0'}}>
								<span className='basic-badge evaluation-app'>사진 등록</span>
							</CardTitle>
						</Col>
						<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
							<CardTitle style={{marginTop:'10px', marginBottom:'0'}}>
								<h2 style={{color:primaryColor}} className="fw-border">개선 조치 전 사진을 등록해주세요.</h2>
							</CardTitle>
						</Col>
						<Row style={{justifyContent:'center', margin:'1rem'}}>
							<div style={{height:"160px", width: '220px', objectFit:'contain'}}>
								<img style={{height:"100%", width: '100%', objectFit:'contain'}}
									src={fileInfo.evalutionPath === '' 
									? '/static_backend/disaster/noImg.png'
									: `/static_backend/${fileInfo.evalutionPath}/${fileInfo.evalutionFileName}`}/>
							</div>
						</Row>
						<Row>
							<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
								<Input type="file" capture='camera' 
									disabled={isNotWorker}
									name='evaluation'
									onChange={onChangeFile}/>
							</Col>
						</Row>
						<hr/>

						<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
							<CardTitle style={{marginTop:'10px', marginBottom:'0'}}>
								<h2 style={{color:primaryColor}} className="fw-border">개선 조치 후 사진을 등록해주세요.</h2>
							</CardTitle>
						</Col>
						<Row style={{justifyContent:'center', margin:'1rem'}}>
							<div style={{height:"160px", width: '220px', objectFit:'contain'}}>
								<img style={{height:"100%", width: '100%', objectFit:'contain'}}
									src={fileInfo.counterplanPath === '' 
									? '/static_backend/disaster/noImg.png'
									: `/static_backend/${fileInfo.counterplanPath}/${fileInfo.counterplanFileName}`}/>
							</div>
						</Row>
						<Row>
							<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
								<Input type="file" capture='camera' 
									disabled={isNotWorker}
									name='counterplan'
									onChange={onChangeFile}/>
						</Col>
						</Row>
						<hr/>

					</CardBody>
				</Card>
			}
		</Fragment>
	)
}

export default EvaluationContentCard