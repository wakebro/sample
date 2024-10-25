/* eslint-disable */
import { primaryColor } from "@utils"
import { Fragment } from "react"
import { Controller } from "react-hook-form"
import Select from 'react-select'
import { CardTitle, Col, Row } from "reactstrap"
import { returnResult } from "../../../web/list/categoryEvaluationCounterPlan/data"
import { handleBordlerCss, handleResult } from "./data"

const ChecklistApp = (props) => {
	const { control, setValue, selectList, isNotWorker, dataIdx } = props
	return (
		<Fragment>
			<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
				<CardTitle style={{marginTop:'10px', marginBottom:'0'}}>
					<h2 style={{color:primaryColor}} className="fw-border">선택지 중 하나를 골라주세요.</h2>
				</CardTitle>
			</Col>

			<Row style={{marginTop:'20px'}}>
				<Col xs={12} style={{textAlign:'center'}}>
					<Row><h4 id='scene'>위험성 확인결과</h4></Row>
					<Controller
						name={`frequency_${dataIdx}`}
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select
								isDisabled={isNotWorker}
								name={`frequency_${dataIdx}`}
								classNamePrefix='select'
								className={`react-select custom-select-frequency_${dataIdx} custom-react-select`}
								styles={{ 
									container: base => ({...base, display:'flex', justifyContent:'center'}),
									control: base => ({...base, width:'50%'}),
									menu: base => ({...base, width:'45%'})
									}}
								value={value}
								options={selectList}
								onChange={(e) => {
									setValue(`multiResult_${dataIdx}`, e.value)
									onChange(e)
								}}/>
						)}/>
				</Col>
			</Row>
		</Fragment>
	)
}

const ChecklistAppResult = (props) => {
	const {control, watch, type, dataIdx} = props
	return (
		<Fragment>
			<Controller
				name={`multiResult_${dataIdx}`}
				control={control}
				render={({ field: {value} }) => {
					if (watch(`multiResult_${dataIdx}`) === '') return (<div style={handleBordlerCss()}></div>)
					else return (
						<Col xs={7}>
							<div style={handleBordlerCss(type, value)}>
								{handleResult(type, value)}
							</div>
						</Col>
					)
				}}/>
		</Fragment>
	)
}

const Step3App = (props) => {
	const { control, setValue, selectList, isNotWorker, dataIdx } = props
	return (
		<Fragment>
			<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
				<CardTitle style={{marginTop:'10px', marginBottom:'0'}}>
					<h2 style={{color:primaryColor}} className="fw-border">선택지 중 하나를 골라주세요.</h2>
				</CardTitle>
			</Col>

			<Row style={{marginTop:'20px'}}>
				<Col xs={12} style={{textAlign:'center'}}>
					<Row><h4 id='scene'>위험성의 수준</h4></Row>
					<Controller
						name={`frequency_${dataIdx}`}
						control={control}
						render={({ field: { onChange, value } }) => (
							<Select
								isDisabled={isNotWorker}
								name={`frequency_${dataIdx}`}
								classNamePrefix='select'
								className={`react-select custom-select-frequency_${dataIdx} custom-react-select`}
								styles={{ 
									container: base => ({...base, display:'flex', justifyContent:'center'}),
									control: base => ({...base, width:'50%'}),
									menu: base => ({...base, width:'45%'})
									}}
								value={value}
								options={selectList}
								onChange={(e) => {
									setValue(`multiResult_${dataIdx}`, e.value)
									onChange(e)
								}}/>
						)}/>
				</Col>
			</Row>
		</Fragment>
	)
}

const Step3AppResult = (props) => {
	const {control, watch, type, dataIdx} = props
	return (
		<Fragment>
			<Controller
				name={`multiResult_${dataIdx}`}
				control={control}
				render={({ field: {value} }) => {
					if (watch(`multiResult_${dataIdx}`) === '') return (<div style={handleBordlerCss()}></div>)
					else return (
						<Col xs={7}>
							<div style={handleBordlerCss(type, value)}>
								{handleResult(type, value)}
							</div>
						</Col>
					)
				}}/>
		</Fragment>
	)
}

const FrequencyApp = (props) => {
	const { control, setValue, selectList, isNotWorker, dataIdx } = props
	return (
		<Fragment>
			<Col xs={12} style={{display:'flex', justifyContent:'center'}}>
				<CardTitle style={{marginTop:'10px', marginBottom:'0'}}>
					<h2 style={{color:primaryColor}} className="fw-border">값을 입력하면 자동 계산됩니다.</h2>
				</CardTitle>
			</Col>

			<Row style={{marginTop:'20px'}}>
				<Col xs={5} style={{textAlign:'center'}}>
					<Row><h4 id='scene'>가능성(빈도)</h4></Row>
					<Controller
						name={`frequency_${dataIdx}`}
						control={control}
						render={({ field: { value } }) => (
							<Select
								isDisabled={isNotWorker}
								name={`frequency_${dataIdx}`}
								classNamePrefix='select'
								className={`react-select custom-select-frequency_${dataIdx} custom-react-select`}
								value={value}
								options={selectList}
								onChange={(e) => {
									returnResult(
										dataIdx,
										`frequency_${dataIdx}`,
										`strength_${dataIdx}`,
										e,
										control,
										setValue)
								}}/>
						)}/>
				</Col>
				<Col xs={2} style={{textAlign:'center'}}>
					<Row><h4 id='scene'>&nbsp;</h4></Row>
					*
				</Col>
				<Col xs={5} style={{textAlign:'center'}}>
					<Row><h4 id='scene'>중대성(강도)</h4></Row>
					<Controller
						name={`strength_${dataIdx}`}
						control={control}
						render={({ field: { value } }) => (
							<Select
								isDisabled={isNotWorker}
								name={`strength_${dataIdx}`}
								classNamePrefix='select'
								className={`react-select custom-select-strength_${dataIdx} custom-react-select`}
								value={value}
								options={selectList}
								onChange={(e) => {
									returnResult(
										dataIdx,
										`strength_${dataIdx}`,
										`frequency_${dataIdx}`,
										e,
										control,
										setValue)
								}}/>
						)}/>
				</Col>
			</Row>
		</Fragment>
	)
}
const FrequencyAppResult = (props) => {
	const {control, watch, type, dataIdx} = props
	return (
		<Fragment>
			<Controller
				name={`multiResult_${dataIdx}`}
				control={control}
				render={({ field: {value} }) => {
					if (watch(`multiResult_${dataIdx}`) === '') return (<div style={handleBordlerCss()}></div>)
					else return (
						<Col xs={7}>
							<div style={handleBordlerCss(type, value)}>
								{handleResult(type, value)}
							</div>
						</Col>
					)
				}}/>
		</Fragment>
	)
}

export { ChecklistApp, ChecklistAppResult, FrequencyApp, FrequencyAppResult, Step3App, Step3AppResult }

