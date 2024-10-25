import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment } from "react"
import { Controller, useForm } from 'react-hook-form'
import { Card, CardHeader, CardTitle, CardBody, Col, Form, Input, Row, CardFooter, Button, FormFeedback } from "reactstrap"
import * as yup from 'yup' 
import { API_SPACE_DETAIL_BUILDING, API_SPACE_BUILDING } from '../../../../constants'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import Breadcrumbs from '@components/breadcrumbs'
//import axios from 'axios'
import { axiosPostPutNavi } from '../../../../utility/Utils'
const BuildingRegister = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	const { state } = useLocation()
	const onClickBtn = () => {
		navigate(-1) // 바로 이전 페이지로 이동, '/main' 등 직접 지정도 당연히 가능
    }
	const defaultValues = {
		code : "", //건물 코드
		name : "", //건물 명
		comments : "" //비고

	}

	const validationSchema = yup.object().shape({
		code: yup.string().required('건물코드를 입력해주세요.').min(1, '1자 이상 입력해주세요'),
		name: yup.string().required('건물명을 입력해주세요.').min(1, '1자 이상 입력해주세요')
		// userName: yup.string().required('이름를 입력해주세요').min(3, '1자 이상 입력해주세요'),
		// email: yup.string().email().required('이메일 주소를 입력해주세요'),
		// password: yup.string().required('비밀번호를 입력해주세요').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, '최소 8글자 이상, 대문자, 특수문자 포함'),
		// confirmPassword: yup
		// 	.string()
		// 	.required('비밀번호를 입력해주세요')
		// 	.oneOf([yup.ref(`password`), null], '비밀번호가 일치하지 않습니다'),
		// phone: yup.string().required('전화번호를 입력해주세요')

	})
	const {
		control,
		handleSubmit,
		formState: { errors }
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})


	const onSubmit = data => {
		const formData = new FormData()
		formData.append('prop', state.prop_id)
		formData.append('code', data.code)
		formData.append('name', data.name)
		formData.append('comments', data.comments)

		axiosPostPutNavi('register', '건물', API_SPACE_BUILDING, formData, navigate, -1)
		// axios.post(API_SPACE_BUILDING, formData, {
		// 	headers: {
		// 		"Content-Type": "multipart/form-data"
		// 	}
		// }).then(res => {
		// 	if (res.status === 200) {
		// 		console.log(res.data)
		// 		alert("등록이 완료되었습니다.")
		// 		onClickBtn()
		// 	}
		// }).catch(res => {
		// 	console.log(res, "!!!!!!!!error")
		// })
	}
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='건물정보' />
				</div>
			</Row>
			<Row>
				<Col >
					<Card>
						<CardHeader>
							<CardTitle>
								건물정보등록
							</CardTitle>
						</CardHeader>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<CardBody>
								<Row className='card_table top' >
									<Col  xs='6'>
										<Row className='card_table table_row'>
											<Col xs='4'  className='card_table col_input col_color text center '>건물코드</Col>
											<Col xs='8' className='card_table col_input text start '>
												<Controller
													id='code'
													name='code'
													control={control}
													render={({ field }) => <Input bsSize='sm' placeholder={'건물코드를 입력해주세요.'} invalid={errors.code && true} {...field} />}
												/>
												{errors.code && <FormFeedback>{errors.code.message}</FormFeedback>}
											</Col>
										</Row>
									</Col>
									<Col xs='6'>
										<Row className='card_table table_row'>
											<Col xs='4' className='card_table col_input col_color text center '>건물명</Col>
											<Col xs='8' className='card_table col_input text start '>
												<Controller
													id='name'
													name='name'
													control={control}
													render={({ field }) => <Input bsSize='sm' placeholder={'건물명을 입력해주세요.'} invalid={errors.name && true} {...field} />}
												/>
												{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}
											</Col>
										</Row>
									</Col>
								</Row>
								<Row className='card_table mid' >
									<Col xs='12'>
										<Row className='card_table table_row'>
											<Col xs='2'  className='card_table col_input col_color text center '>비고</Col>
											<Col xs='10' className='card_table col_input text start '>
												<Controller
													id='comments'
													name='comments'
													control={control}
													render={({ field }) => <Input type='textarea' bsSize='sm'  invalid={errors.comments && true} {...field} />}
												/>
											</Col>
										</Row>
									</Col>
								</Row>
							</CardBody>
							<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
								<Fragment >
									<Button color="report" onClick={() => onClickBtn()}>
										취소
									</Button>
									<Button type='submit' className="ms-1" color="primary">
										확인
									</Button>							
								</Fragment>
							</CardFooter>
						</Form>
					</Card>
					
				</Col>
			</Row>		
		</Fragment>
	)
}

export default BuildingRegister