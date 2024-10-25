import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from 'react-hook-form'
import { CardBody, Col, Form, Input, Row, CardFooter, Button, FormFeedback, InputGroupText, InputGroup } from "reactstrap"
import * as yup from 'yup' 
import { API_SPACE_DETAIL_BUILDING } from '../../../../constants'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Flatpickr from "react-flatpickr"
import * as moment from 'moment'
import { setStringDate, AddCommaOnChange, getCommaDel, axiosPostPut } from '../../../../utility/Utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const BuildingTabUpdate = (props) => {
	useAxiosIntercepter()
	const {data, update, setUpdate, type} = props
	const now = moment().format('YYYY-MM-DD')
	const [submitResult, setSubmitResult] = useState(false)

	const exclusiveRatio = (num) => {
		if (isNaN(num) || !Number.isFinite(num)) {
			return 0
		} else {
			return Math.round(num)
		}
	}

	const defaultValues = {
		name : data['name'], //건물명
		landlord : data['landlord'], //소유주
		designer : data['designer'], //설계자
		builder : data['builder'], // 시공사
		address : data['address'], //소재지
		area_total : data['area_total'], //연면적
		class_land : data['class_land'], //지목
		district : data['district'], //지역
		section : data['section'], //지구
		bl_area : data['bl_area'], //건축면적
		parcel : data['parcel'], //대지면적
		bl_to_land_ratio : data['bl_to_land_ratio'], //건폐율
		exclusive_ratio : exclusiveRatio(data['area_total'] / data['parcel']), //전용율 = 연면적/대지면적
		fl_area_ratio : data['fl_area_ratio'], //용적율
		usable_area : data['usable_area'], //전용 면적
		construction_type : data['construction_type'], //건축 구조
		roof_type : data['roof_type'], //지붕 형태
		count_fl : data['count_fl'], //층수 지상
		count_bf : data['count_bf'], //지하
		bl_height : data['bl_height'], //최고 높이 지상
		bl_depth : data['bl_depth'], //지하
		main_purpose : data['main_purpose'], //주용도
		bl_date : moment(data['bl_date']).format('YYYY-MM-DD'), //준공일
		parking_facility : data['parking_facility'], //주차설비
		elev_facility : data['elev_facility'], //승강설비
		elec_cap : data['elec_cap'], //수전 설비
		generator_cap : data['generator_cap'], //발전설비
		heating_facility : data['heating_facility'], //난방설비
		cooling_facility : data['cooling_facility'] //냉방설비

	}

	const validationSchema = yup.object().shape({
		name: yup.string().required('건물명을 입력해주세요.').min(1, '1자 이상 입력해주세요'),
		area_total : yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		bl_area : yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		parcel : yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		bl_to_land_ratio: yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		fl_area_ratio: yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		usable_area: yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		count_fl: yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		count_bf : yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		bl_height: yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			}),
		bl_depth: yup
			.string()
			.matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요')
			.transform((value, originalValue) => {
				if (originalValue === "") return '0'
				return value
			})
	})
	const {
		control,
		handleSubmit,
		formState: { errors },
		trigger
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})

	const onSubmit = data => {
		const formData = new FormData()
		formData.append('id', type)
		formData.append('type', 'building')
		Object.keys(defaultValues).map((key) => {
			if (key !== 'exclusive_ratio' && key !== 'area_total' && key !== 'bl_area') {
				formData.append(key, data[key])
			}
		})
		formData.append('area_total', getCommaDel(data.area_total))
		formData.append('bl_area', getCommaDel(data.bl_area))
		formData.append('parcel', getCommaDel(data.parcel))
		formData.append('bl_to_land_ratio', getCommaDel(data.bl_to_land_ratio))
		formData.append('fl_area_ratio', getCommaDel(data.fl_area_ratio))
		formData.append('usable_area', getCommaDel(data.usable_area))
		formData.append('count_fl', getCommaDel(data.count_fl))
		formData.append('count_bf', getCommaDel(data.count_bf))
		formData.append('bl_height', getCommaDel(data.bl_height))
		formData.append('bl_depth', getCommaDel(data.bl_depth))

		axiosPostPut('modify', "건물개요", API_SPACE_DETAIL_BUILDING, formData, setSubmitResult)
	}

	useEffect(() => {
		if (submitResult) {
			setUpdate(!update)
		}
	}, [submitResult])
	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<CardBody>
					<Row className='card_table top' >
						<Col  xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center'>건물명</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='name'
										name='name'
										control={control}
										render={({ field }) => <Input bsSize='sm' maxLength={450} invalid={errors.name && true} {...field} />
									}
									/>
									{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>소유주</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='landlord'
										name='landlord'
										control={control}
										render={({ field }) => <Input bsSize='sm' maxLength={45} invalid={errors.landlord && true} {...field} />}
									/>
									{errors.landlord && <FormFeedback>{errors.landlord.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>설계자</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='designer'
										name='designer'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.designer && true} {...field} />}
									/>
									{errors.designer && <FormFeedback>{errors.designer.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>시공사</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='builder'
										name='builder'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.builder && true} {...field} />}
									/>
									{errors.builder && <FormFeedback>{errors.builder.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>소재지</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='address'
								name='address'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.address && true} {...field} />}
							/>
							{errors.address && <FormFeedback>{errors.address.message}</FormFeedback>}
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>연면적</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='area_total'
										name='area_total'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.area_total && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('area_total')
													}} />
												<InputGroupText>{'m\xB2'}</InputGroupText>
												{errors.area_total && <FormFeedback>{errors.area_total.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>지목</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='class_land'
										name='class_land'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.class_land && true} {...field} />}
									/>
									{errors.class_land && <FormFeedback>{errors.class_land.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>지역</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='district'
										name='district'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.district && true} {...field} />}
									/>
									{errors.district && <FormFeedback>{errors.district.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>지구</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='section'
										name='section'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.section && true} {...field} />}
									/>
									{errors.section && <FormFeedback>{errors.section.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>건축 면적</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='bl_area'
										name='bl_area'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.bl_area && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('bl_area')
													}} />
												<InputGroupText>{'m\xB2'}</InputGroupText>
												{errors.bl_area && <FormFeedback>{errors.bl_area.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>대지 면적</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='parcel'
										name='parcel'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.parcel && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('parcel')
													}} />
												<InputGroupText>{'m\xB2'}</InputGroupText>
												{errors.parcel && <FormFeedback>{errors.parcel.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>건폐율</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='bl_to_land_ratio'
										name='bl_to_land_ratio'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.bl_to_land_ratio && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('bl_to_land_ratio')
													}} />
												<InputGroupText>%</InputGroupText>
												{errors.bl_to_land_ratio && <FormFeedback>{errors.bl_to_land_ratio.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>전용율</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='exclusive_ratio'
										name='exclusive_ratio'
										control={control}
										render={({ field : {value} }) => <div>{value} %</div>}
									/>
									{errors.exclusive_ratio && <FormFeedback>{errors.exclusive_ratio.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>용적률</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='fl_area_ratio'
										name='fl_area_ratio'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.fl_area_ratio && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('fl_area_ratio')
													}}/>
												<InputGroupText >%</InputGroupText>
												{errors.fl_area_ratio && <FormFeedback>{errors.fl_area_ratio.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>전용 면적</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='usable_area'
										name='usable_area'
										control={control}
										render={({ field: {onChange, value} }) => (
											<Col className='card_table col text center' style={{flexDirection:'column'}}>
												<Input 
													bsSize='sm' 
													invalid={errors.usable_area && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('usable_area')
													}}/>
												{errors.usable_area && <FormFeedback>{errors.usable_area.message}</FormFeedback>}
											</Col>
										)}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>건축 구조</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='construction_type'
										name='construction_type'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.construction_type && true} {...field} />}
									/>
									{errors.construction_type && <FormFeedback>{errors.construction_type.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table row'>
								<Col xs='4' className='card_table col col_color text center '>지붕 형태</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='roof_type'
										name='roof_type'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.roof_type && true} {...field} />}
									/>
									{errors.roof_type && <FormFeedback>{errors.roof_type.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>층수 (지상/지하)</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Row>
										<Col lg='5' xs = '12'>
											<div style={{display : 'flex', alignItems : 'center'}}>
												<Controller
													id='count_fl'
													name='count_fl'
													control={control}
													render={({ field: {onChange, value} }) => (
														<InputGroup className='input-group-merge ' size='sm'>
															<Input 
																bsSize='sm' 
																invalid={errors.count_fl && true} 
																value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
																onChange={(e) => {
																	AddCommaOnChange(e, onChange)
																	trigger('count_fl')
																}}/> 
															<InputGroupText >층</InputGroupText>
															{errors.count_fl && <FormFeedback>{errors.count_fl.message}</FormFeedback>}
														</InputGroup>
													)}
												/>
											</div>
										</Col>
										<Col lg='2' style={{display : 'flex', alignItems : 'center'}}>
											<span >/</span>
										</Col>
										<Col lg='5' xs = '12'>
											<div style={{display : 'flex', alignItems : 'center'}}>
												<Controller
													id='count_bf'
													name='count_bf'
													control={control}
													render={({ field: {onChange, value} }) => (
														<InputGroup className='input-group-merge ' size='sm'>
															<Input 
																bsSize='sm' 
																invalid={errors.count_bf && true} 
																value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
																onChange={(e) => {
																	AddCommaOnChange(e, onChange)
																	trigger('count_bf')
																}}/>
															<InputGroupText >층</InputGroupText>
															{errors.count_bf && <FormFeedback>{errors.count_bf.message}</FormFeedback>}
														</InputGroup>
													)}
												/>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>최고높이 (지상/지하)</Col>
								<Col xs='8' className='card_table col_input start '>
									<Row>
										<Col  lg='5' xs ='12'>
											<div style={{display : 'flex', alignItems : 'center'}}>
												<Controller
													id='bl_height'
													name='bl_height'
													control={control}
													render={({ field: {onChange, value} }) => (
														<InputGroup className='input-group-merge ' size='sm'>
															<Input 
																bsSize='sm' 
																invalid={errors.bl_height && true} 
																value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
																onChange={(e) => {
																	AddCommaOnChange(e, onChange)
																	trigger('bl_height')
																}}/>
															<InputGroupText >m</InputGroupText>
															{errors.bl_height && <FormFeedback>{errors.bl_height.message}</FormFeedback>}
														</InputGroup>
													)}
												/>
											</div>
										</Col>
										<Col lg='2' style={{display : 'flex', alignItems : 'center'}}>
												<span >/</span>
										</Col>
										<Col  lg='5' xs ='12'>
											<div style={{display : 'flex', alignItems : 'center'}}>
												<Controller
													id='bl_depth'
													name='bl_depth'
													control={control}
													render={({ field: {onChange, value} }) => (
														<InputGroup className='input-group-merge ' size='sm'>
															<Input 
																bsSize='sm' 
																invalid={errors.bl_depth && true} 
																value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
																onChange={(e) => {
																	AddCommaOnChange(e, onChange)
																	trigger('bl_depth')
																}}/>
															<InputGroupText >m</InputGroupText>
															{errors.bl_depth && <FormFeedback>{errors.bl_depth.message}</FormFeedback>}
														</InputGroup>
													)}
												/>
											</div>
										</Col>
									</Row>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
					<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>주용도</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='main_purpose'
										name='main_purpose'
										control={control}
										render={({ field }) => <Input bsSize='sm' invalid={errors.main_purpose && true} {...field} />}
									/>
									{errors.main_purpose && <FormFeedback>{errors.main_purpose.message}</FormFeedback>}
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>준공일</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='bl_date'
										name='bl_date'
										control={control}
										render={({field : {onChange, value}}) => <Flatpickr
													value={value}
													id='range-picker'
													className='form-control'
													placeholder={`${now}`}
													onChange={(data) => {
														const newData = setStringDate(data)
														onChange(newData)
													}}
													options={{
														mode: 'single', 
														maxDate: now,
														ariaDateFormat:'Y-m-d',
														locale: Korean
														}}/>
													}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>주차 설비</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='parking_facility'
								name='parking_facility'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.parking_facility && true} {...field} />}
							/>
							{errors.parking_facility && <FormFeedback>{errors.parking_facility.message}</FormFeedback>}
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>승강 설비</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='elev_facility'
								name='elev_facility'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.elev_facility && true} {...field} />}
							/>
							{errors.elev_facility && <FormFeedback>{errors.elev_facility.message}</FormFeedback>}
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>수전 설비</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='elec_cap'
								name='elec_cap'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.elec_cap && true} {...field} />}
							/>
							{errors.elec_cap && <FormFeedback>{errors.elec_cap.message}</FormFeedback>}
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>발전 설비</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='generator_cap'
								name='generator_cap'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.generator_cap && true} {...field} />}
							/>
							{errors.generator_cap && <FormFeedback>{errors.generator_cap.message}</FormFeedback>}
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>난방 설비</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='heating_facility'
								name='heating_facility'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.heating_facility && true} {...field} />}
							/>
							{errors.heating_facility && <FormFeedback>{errors.heating_facility.message}</FormFeedback>}
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='2'  className='card_table col col_color text center '>냉방 설비</Col>
						<Col xs='10' className='card_table col_input text start '>
							<Controller
								id='cooling_facility'
								name='cooling_facility'
								control={control}
								render={({ field }) => <Input bsSize='sm' invalid={errors.cooling_facility && true} {...field} />}
							/>
							{errors.cooling_facility && <FormFeedback>{errors.cooling_facility.message}</FormFeedback>}
						</Col>
					</Row>
				</CardBody>
				<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
					<Fragment >
						<Button color="report" onClick={() => setUpdate(!update)}>
							취소
						</Button>
						<Button type='submit' className="ms-1" color="primary">
							확인
						</Button>							
					</Fragment>
				</CardFooter>
			</Form>
		</Fragment>
	)
}
export default BuildingTabUpdate