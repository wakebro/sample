/* eslint-disable */
import ImageFileUploaderMulti from "@views/apps/customFiles/ImageFileUploaderMulti"
import { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import Select from 'react-select'
import { CardBody, Col, Input, Row } from "reactstrap"
import { CHECKLIST, FREQUENCY_3X3, FREQUENCY_5X5, STEP_3, getMultiResult, getStrGrade, typeSelectList } from "../../../../data"
import { returnResult } from "../../data"
import { setTabTempSaveCheck } from '@store/module/criticalDisaster'

const ContentEvaluation = (props) => {
	const {data, num, control, setValue, watch, files, setFiles} = props
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const [selectList, setSelectList] = useState([])
	const type = criticalDisaster.registerFormType.value
	const dispatch = useDispatch()

	function customSetFiles(filesList) {
		const firstKey = typeof (data.index) === 'number' ? data.index : Number(data.index)
		const secondKey = 'evaluation'
		const copyFiles = {...files}
		copyFiles[firstKey][secondKey] = filesList
		setFiles(copyFiles)
		dispatch(setTabTempSaveCheck(false))
	}
	useEffect(() => {
		setSelectList(typeSelectList[criticalDisaster.registerFormType.value])
	}, [criticalDisaster.registerFormType.value])

    useEffect(() => {
		if (type >= 2) {
			const tempFrequency = watch(`frequency_${data.index}`)
			let numFre = tempFrequency
			if (typeof tempFrequency === 'object') {
				numFre = tempFrequency.value
			}
			if (typeof numFre !== 'number') {
				setValue(`multiResult_${data.index}`, '')
				return
			}
			setValue(`multiResult_${data.index}`, numFre)
			return
		}

        const tempFrequency = watch(`frequency_${data.index}`)
        const tempStrength = watch(`strength_${data.index}`)

        let numFre = tempFrequency
        let numStre = tempStrength

        if (typeof tempFrequency === 'object') {
            numFre = tempFrequency.value
        }
        if (typeof tempStrength === 'object') {
            numStre = tempStrength.value
        }

        if (typeof numFre !== 'number' || typeof numStre !== 'number') {
            setValue(`multiResult_${data.index}`, '')
            return
        }
        setValue(`multiResult_${data.index}`, numFre * numStre)
    }, [
        watch(`frequency_${data.index}`),
        watch(`strength_${data.index}`)
    ])

	return (
		<CardBody>
			<Row className='card_table top'>
				<Col xs='12'>
					<Row className='card_table table_row'>
						<Col xs='12' className='card_table col col_color text center' style={{borderRight:'0px'}}>유해 위험요인 {num}</Col>
					</Row>
				</Col>
			</Row>
			<Row className='card_table mid' >
				<Col xs='12'>
					<Row className='card_table table_row'>
						<Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>문제점</Col>
						<Col xs='9' className='card_table col text center'>
							<Row className='mx-0'>
								<Col className='px-2 py-2 border-x border-y'>
									<ImageFileUploaderMulti
										setFiles={customSetFiles}
										files={files[data.index]['evaluation']}
										fileNumLimit={2}
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
					<Row className='card_table table_row'>
						<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
							<div>유해</div><div>위험요인</div>
						</Col>
						<Col style={{display:'flex', alignItems:'center'}}>{data.inputResult}</Col>
					</Row>
				</Col>
			</Row>
			{
				(type === FREQUENCY_3X3 || type === FREQUENCY_5X5) &&
				<>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3' className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
									<div>위험성</div><div>평가</div>
								</Col>
								<Col xs='9' className='card_table col text center' style={{flexDirection:'column', padding:0}}>
									<Row style={{width:'100%', borderBottom:'1px solid #B9B9C3'}}><Col >현재 위험성</Col></Row>
									<Row style={{width:'100%'}}>
										<Col xs={4} style={{flexDirection:'column', borderRight:'1px solid #B9B9C3', padding:'1px 0px'}}><div>가능성</div><div>(빈도)</div></Col>
										<Col xs={4} style={{flexDirection:'column', borderRight:'1px solid #B9B9C3', padding:'1px 0px'}}><div>중대성</div><div>(강도)</div></Col>
										<Col xs={4} className='d-flex card_table text center' style={{padding:'1px 0px'}}>{'위험성'}</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
									<Controller
										name={`evaluation_${data.index}`}
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
								<Col xs='9'  className='card_table col text center' style={{flexDirection:'column', padding:0}}>
									<Row style={{width:'100%', height:'100%'}}>
										<Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #B9B9C3'}}>
											<Controller
												name={`frequency_${data.index}`}
												control={control}
												render={({ field: { value } }) => (
													<Select
														name={`frequency_${data.index}`}
														classNamePrefix='select'
														className={`react-select custom-react-select`}
														value={value}
														options={selectList}
														placeholder='선택'
														onChange={(e) => {
															returnResult(
																data.index,
																`frequency_${data.index}`, 
																`strength_${data.index}`, 
																e,
																control,
																setValue)
															dispatch(setTabTempSaveCheck(false))
														}}
														/>
												)}/>
										</Col>
										<Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center', borderRight:'1px solid #B9B9C3'}}>
											<Controller
												name={`strength_${data.index}`}
												control={control}
												render={({ field: { value } }) => (
													<Select
														name={`strength_${data.index}`}
														classNamePrefix='select'
														className='react-select custom-select-code custom-react-select'
														value={value}
														options={selectList}
														placeholder='선택'
														onChange={(e) => {
															returnResult(
																data.index, 
																`strength_${data.index}`, 
																`frequency_${data.index}`, 
																e,
																control,
																setValue)
															dispatch(setTabTempSaveCheck(false))
														}}/>
												)}/>
										</Col>
										<Col xs={4} style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
											<Controller
												name={`multiResult_${data.index}`}
												control={control}
												render={({ field: {value} }) => {
													if (watch(`multiResult_${data.index}`) === '') return (<div></div>)
													else return (
														<div style={{textAlign:'center', border:'none'}}>
															{value}{getStrGrade(type, getMultiResult(type, value))}
														</div>)
												}}/>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</>
			}
			{
				(type === STEP_3 || type === CHECKLIST) && 
				<>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3', padding:0}}>
									<div>위험성</div><div>수준</div>
								</Col>
								<Col xs='9'  className='card_table col text center' style={{flexDirection:'column'}}>
									위험성 평가
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='3'  className='card_table col text center' style={{flexDirection:'column', borderLeft:'1px solid #B9B9C3', borderRight:'1px solid #B9B9C3'}}>
									<Controller
										name={`frequency_${data.index}`}
										control={control}
										render={({ field: { onChange, value } }) => (
											<Select
												name={`frequency_${data.index}`}
												classNamePrefix='select'
												className='react-select custom-select-code custom-react-select'
												value={value}
												options={selectList}
												placeholder='선택'
												onChange={(e) => {
													setValue(`multiResult_${data.index}`, e.value)
													onChange(e)
													dispatch(setTabTempSaveCheck(false))
												}}/>
											)}/>
								</Col>
								<Col xs='9'  className='card_table col text center' style={{flexDirection:'column'}}>
									<Controller
										name={`evaluation_${data.index}`}
										control={control}
										render={({ field: { onChange, value } }) => <Input type='textarea' rows='1'
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
				</>
			}
		</CardBody>
	)
}

export default ContentEvaluation