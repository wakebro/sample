import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useState, useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { CardBody, Col, Form, Input, Row, CardFooter, Button, Label, InputGroupText, InputGroup } from "reactstrap"
import * as yup from 'yup' 
import { API_SPACE_DETAIL_BUILDING } from '../../../../constants'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Flatpickr from "react-flatpickr"
import * as moment from 'moment'
import { setStringDate, AddCommaOnChange, getCommaDel, axiosPostPut } from '../../../../utility/Utils'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const EtcTabUpdate = (props) => {
	useAxiosIntercepter()
	const {data, update, setUpdate, type} = props
	const now = moment().format('YYYY-MM-DD')
	const [submitResult, setSubmitResult] = useState(false)
	
	const defaultValues = {
		is_regist : data['is_regist'], //등기부여
		buy_date : data['buy_date'], //건물취득일
		land_buy_date : data['land_buy_date'], //대지취득일
		sale_date : data['sale_date'], // 매각일자
		manage_start_date : data['manage_start_date'], //관리개시일
		pa_land_price : data['pa_land_price'], //공시지가
		fl_area : data['fl_area'], //지상층면적
		bf_area : data['bf_area'], //지하층면적
		rentable_area : data['rentable_area'], //임대가능면적
		garden_area : data['garden_area'], //조경면적
		book_value_price : data['book_value_price'], //장부가
		base_rate : data['base_rate'], //임대가 환산율
		use_fl_4 : data['use_fl_4'], //4층사용
		use_fl_13 : data['use_fl_13'], //13층사용
		front_road_width : data['front_road_width'], //전면도로폭
		back_load_width : data['back_load_width'], //후면도로폭
		side_road_width : data['side_road_width'], //측면도로폭
		parking_unit_indoor : data['parking_unit_indoor'], //옥내주차대수
		ph : data['ph'], //옥탁유무
		parking_unit_outdoor : data['parking_unit_outdoor'], //옥외주차대수
		el_unit : data['el_unit'], //E/L 대수
		es_unit : data['es_unit'], //E/S 대수
		comments : data['comments'] //비고
	}

	const validationSchema = yup.object().shape({
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
		formData.append('type', 'Etc')

		Object.keys(defaultValues).map((key) => {
			if (key !== 'exclusive_ratio') {
				formData.append(key, data[key])
			}
		})
		formData.append('pa_land_price', getCommaDel(data.pa_land_price))
		formData.append('fl_area', getCommaDel(data.fl_area))
		formData.append('bf_area', getCommaDel(data.bf_area))
		formData.append('rentable_area', getCommaDel(data.rentable_area))
		formData.append('garden_area', getCommaDel(data.garden_area))
		formData.append('book_value_price', getCommaDel(data.book_value_price))
		formData.append('front_road_width', getCommaDel(data.front_road_width))
		formData.append('back_load_width', getCommaDel(data.back_load_width))
		formData.append('side_road_width', getCommaDel(data.side_road_width))
		formData.append('parking_unit_indoor', getCommaDel(data.parking_unit_indoor))
		formData.append('el_unit', getCommaDel(data.el_unit))
		formData.append('es_unit', getCommaDel(data.es_unit))
		
		axiosPostPut('modify', "기타정보", API_SPACE_DETAIL_BUILDING, formData, setSubmitResult)
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
								<Col xs='4'  className='card_table col col_color text center '>등기부여</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='is_regist'
										name='is_regist'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_is_regist_true' value={true} type='radio' checked={value === true}
												onChange={() => {									
													onChange(true)
												}}/>
												<Label className='form-check-label' for='use_is_regist_true'>
													유
												</Label>
											</Col>
									)}/>
									<Controller
										id='is_regist'
										name='is_regist'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_is_regist_false' value='false'type='radio' checked={value === false}
												onChange={() => {
													onChange(false)
												}}/>
												<Label className='form-check-label' for='use_is_regist_false'>
													무
												</Label>
											</Col>
									)}/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>건물취득일</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='buy_date'
										name='buy_date'
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
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>대지취득일</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='land_buy_date'
										name='land_buy_date'
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
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>매각일자</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='sale_date'
										name='sale_date'
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
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>관리개시일</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='manage_start_date'
										name='manage_start_date'
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
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>공시지가</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='pa_land_price'
										name='pa_land_price'
										control={control}
										render={({ field: {onChange, value} }) => (
											<Col className='card_table col text center' style={{flexDirection:'column'}}>
												<Input 
													bsSize='sm' 
													invalid={errors.pa_land_price && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('pa_land_price')
													}}/>
													{errors.pa_land_price && <FormFeedback>{errors.pa_land_price.message}</FormFeedback>}
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
								<Col xs='4'  className='card_table col col_color text center '>지상층면적</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='fl_area'
										name='fl_area'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.fl_area && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('fl_area')
													}}/>
												<InputGroupText >{'m\xB2'}</InputGroupText>
												{errors.fl_area && <FormFeedback>{errors.fl_area.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>지하층면적</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='bf_area'
										name='bf_area'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.bf_area && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('bf_area')
													}}/>
												<InputGroupText >{'m\xB2'}</InputGroupText>
												{errors.bf_area && <FormFeedback>{errors.bf_area.message}</FormFeedback>}
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
								<Col xs='4'  className='card_table col col_color text center '>임대가능면적</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='rentable_area'
										name='rentable_area'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.rentable_area && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('rentable_area')
													}}/>
												<InputGroupText >{'m\xB2'}</InputGroupText>
												{errors.rentable_area && <FormFeedback>{errors.rentable_area.message}</FormFeedback>}
											</InputGroup>		
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>조경면적</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='garden_area'
										name='garden_area'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.garden_area && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('garden_area')
													}}/>
												<InputGroupText >{'m\xB2'}</InputGroupText>
												{errors.garden_area && <FormFeedback>{errors.garden_area.message}</FormFeedback>}
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
								<Col xs='4'  className='card_table col col_color text center '>장부가</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='book_value_price'
										name='book_value_price'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.book_value_price && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange, true)
														trigger('book_value_price')
													}}/>
												<InputGroupText >원</InputGroupText>
												{errors.book_value_price && <FormFeedback>{errors.book_value_price.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>임대가 환산율</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='base_rate'
										name='base_rate'
										control={control}
										render={({ field }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input disabled bsSize='sm' invalid={errors.base_rate && true} {...field} />
												<InputGroupText >%</InputGroupText>
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
								<Col xs='4'  className='card_table col col_color text center '>4층 사용</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										name='use_fl_4'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_use_fl_4_true' value={true} type='radio' checked={value === true}
												onChange={() => {									
													onChange(true)
												}}/>
												<Label className='form-check-label' for='use_use_fl_4_true'>
													유
												</Label>
											</Col>
									)}/>
									<Controller
										name='use_fl_4'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_use_fl_4_false' value='false'type='radio' checked={value === false}
												onChange={() => {
													onChange(false)
												}}/>
												<Label className='form-check-label' for='use_use_fl_4_false'>
													무
												</Label>
											</Col>
									)}/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4' className='card_table col col_color text center '>13층 사용</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										name='use_fl_13'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_use_fl_13_true' value={true} type='radio' checked={value === true}
												onChange={() => {									
													onChange(true)
												}}/>
												<Label className='form-check-label' for='use_use_fl_13_true'>
													유
												</Label>
											</Col>
									)}/>
									<Controller
										name='use_fl_13'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_use_fl_13_false' value='false'type='radio' checked={value === false}
												onChange={() => {
													onChange(false)
												}}/>
												<Label className='form-check-label' for='use_use_fl_13_false'>
													무
												</Label>
											</Col>
									)}/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>전면도로폭</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='front_road_width'
										name='front_road_width'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.front_road_width && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('front_road_width')
													}}/>
												<InputGroupText >m</InputGroupText>
												{errors.front_road_width && <FormFeedback>{errors.front_road_width.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table row'>
								<Col xs='4' className='card_table col col_color text center '>후면도로폭</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='back_load_width'
										name='back_load_width'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.back_load_width && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('back_load_width')
													}}/>
												<InputGroupText >m</InputGroupText>
												{errors.back_load_width && <FormFeedback>{errors.back_load_width.message}</FormFeedback>}
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
								<Col xs='4'  className='card_table col col_color text center '>측면도로폭</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='side_road_width'
										name='side_road_width'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.side_road_width && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('side_road_width')
													}}/>
												<InputGroupText >m</InputGroupText>
												{errors.side_road_width && <FormFeedback>{errors.side_road_width.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>옥내주차대수</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='parking_unit_indoor'
										name='parking_unit_indoor'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.parking_unit_indoor && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('parking_unit_indoor')
													}}/>
												<InputGroupText >대</InputGroupText>
												{errors.parking_unit_indoor && <FormFeedback>{errors.parking_unit_indoor.message}</FormFeedback>}
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
								<Col xs='4'  className='card_table col col_color text center '>옥탑유무</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										name='ph'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_ph_true' value={true} type='radio' checked={value === true}
												onChange={() => {									
													onChange(true)
												}}/>
												<Label className='form-check-label' for='use_ph_true'>
													유
												</Label>
											</Col>
									)}/>
									<Controller
										name='ph'
										control={control}
										render={({ field : {onChange, value} }) => (
											<Col className='form-check'>
												<Input id='use_ph_false' value='false'type='radio' checked={value === false}
												onChange={() => {
													onChange(false)
												}}/>
												<Label className='form-check-label' for='use_ph_false'>
													무
												</Label>
											</Col>
									)}/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table row'>
								<Col xs='4' className='card_table col col_color text center '>옥외주차대수</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='parking_unit_outdoor'
										name='parking_unit_outdoor'
										control={control}
										render={({ field }) => <InputGroup className='input-group-merge ' size='sm'>
										<Input bsSize='sm' invalid={errors.parking_unit_outdoor && true} {...field} />
										<InputGroupText >대</InputGroupText>
									</InputGroup>
									
									}
									/>
									
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_color text center '>E/L 대수</Col>
								<Col xs='8' className='card_table col_input text start '>
									<Controller
										id='el_unit'
										name='el_unit'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.el_unit && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('el_unit')
													}}/>
												<InputGroupText >대</InputGroupText>
												{errors.el_unit && <FormFeedback>{errors.el_unit.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
						<Col xs='6'>
							<Row className='card_table row'>
								<Col xs='4' className='card_table col col_color text center '>E/S 대수</Col>
								<Col xs='8' className='card_table col_input start '>
									<Controller
										id='es_unit'
										name='es_unit'
										control={control}
										render={({ field: {onChange, value} }) => (
											<InputGroup className='input-group-merge ' size='sm'>
												<Input 
													bsSize='sm' 
													invalid={errors.es_unit && true} 
													value={typeof value === 'number' ? value.toLocaleString('ko-KR') : value}
													onChange={(e) => {
														AddCommaOnChange(e, onChange)
														trigger('es_unit')
													}}/>
												<InputGroupText>대</InputGroupText>
												{errors.es_unit && <FormFeedback>{errors.es_unit.message}</FormFeedback>}
											</InputGroup>
										)}
									/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='12'>
							<Row className='card_table table_row'>
								<Col xs='2'  className='card_table col col_color text center '>비고</Col>
								<Col xs='10' className='card_table col_input text start '>
									<Controller
										id='comments'
										name='comments'
										control={control}
										render={({ field }) => <Input  type='textarea' invalid={errors.el_unit && true} {...field} />}
									/>
								</Col>
							</Row>
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

export default EtcTabUpdate