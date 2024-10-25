import InputPasswordToggle from "@components/input-password-toggle"
import { useSkin } from "@hooks/useSkin"
// import { ReactComponent as Test } from '@src/assets/images/pages/test.svg'
import { setIsManager } from "@store/module/loginAuth"
import "@styles/react/pages/page-authentication.scss"
import { useEffect, useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import {
	Button,
	CardTitle,
	Col,
	Form,
	Input,
	Label,
	Row
} from "reactstrap"
import Cookies from 'universal-cookie'

import { sweetAlert } from '@utils'
import { useDispatch } from "react-redux"
import Swal from 'sweetalert2'
import { API_LOGIN, API_LOGOUT, IS_AUTH, ROUTE_LOGIN, ROUTE_REGISTER } from "../../constants"
import axios from '../../utility/AxiosConfig'
import { useAxiosIntercepter } from "../../utility/hooks/useAxiosInterceptor"
import ComplainModal from "./ComplainModal"
import { checkApp } from "../../utility/Utils"

const Login = () => {
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const { skin } = useSkin()
	const cookies = new Cookies()
	const [isRemember, setIsRemember] = useState(false)
	const [inputUser, setInputUser] = useState('')
	const [formModal, setFormModal] = useState(false)
	// const [inputs, setInputs] = useState({
	// 	employeeNumber: '123',
	// 	password: ''
	// })
	useAxiosIntercepter()

	const onChange = (e) => {
		setInputUser(e.target.value)
	}	

	const logout = () => {
		cookies.remove('userId')
		cookies.remove('propertiesLength')
		cookies.remove('property')
		cookies.remove('isAdmin')
		cookies.remove('isManager')
		axios.get(API_LOGOUT).then(() => { }).catch(() => { })
	}

	useEffect(() => {
		if (cookies.get('rememberID') !== undefined && cookies.get('rememberID') !== '') {
			setInputUser(cookies.get('rememberID'))
			setIsRemember(true)
		} else {
			setIsRemember(false)
		}
		logout()

		// 로그인 권한 없을시 출력
		if (Number(searchParams.get('error')) === 401) {
			Swal.fire({
				title: ``,
				html: `권한이 없습니다.\n관리자에게 문의하세요.`,
				icon: 'success',
				customClass: {
					confirmButton: 'btn btn-primary',
					actions: `sweet-alert-custom center`
				}
			}).then(() => {
				navigate(ROUTE_LOGIN)
			})
		}
	}, [])

	const handleSubmit = (event) => {
		event.preventDefault()
		// window.location.href = ROUTE_DASHBOARD
		// cookies.set('userId', event.target.username.value)
		// cookies.set('isAdmin', true)
		// window.location.href = API_LOGIN
		axios.post(API_LOGIN,
			{
				username: event.target.username.value,
				password: event.target.password.value
			}
		).then(() => {
			if (isRemember) {
				cookies.set('rememberID', event.target.username.value)
			} else {
				cookies.remove('rememberID')
			}
			// Login 성공 시 이동 url
			axios.get(IS_AUTH)
			.then(response => {
				dispatch(setIsManager(response.data['isManager'] || response.data['isManager'] === 'true'))
				cookies.set('userId', response.data['userId'])
				cookies.set('isAdmin', response.data['isAdmin'])
				cookies.set('isManager', response.data['isManager'])
				if (response.data['properties'].length > 1) {
					cookies.set('propertiesLength', response.data['properties'].length)
					// const temp_total = {value: 0, label: '전체'}
					// response.data['properties'].unshift(temp_total)
				} 
				// console.log(response.data)
				
				if (cookies.get('property') === undefined) cookies.set('property', response.data['properties'][0], {path: '/'})
				window.location.href = response.data['startUrl']
			})
		}).catch(() => {
			sweetAlert('', '아이디 또는 비밀번호를 잘못 입력하셨습니다.', 'warning', 'center')
		})
	}
	const openModal = (e) => {
		e.preventDefault()
		setFormModal(!formModal)
	}
	const illustration = skin === "dark" ? "main.png" : "main.png",
		source = require(`@src/assets/images/pages/${illustration}`).default,
		logo = require(`@src/assets/images/pages/APP_NAME.png`).default

	return (
		<div className="auth-wrapper auth-cover">
			<Row className="auth-inner m-0">
				<Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
				</Link>
				<Col className="d-none d-lg-flex align-items-center" lg="8" sm="12" style={{padding:'0px'}}>
					<div className="w-100 d-lg-flex align-items-center justify-content-center h-100" style={{backgroundImage: `url("${source}")`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%'}}>
						{/* <img className="img-fluid" src={source} alt="Login Cover" style={{width:'100%'}}/> */}
					</div>
				</Col>
				<Col
					className="d-flex align-items-center auth-bg px-2 p-lg-5"
					lg="4"
					sm="12"
				>
					<Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
						<CardTitle tag="h2" className="fw-bold mb-5" style={{display : 'flex', justifyContent:'center'}}>
							{/* {APP_NAME} */}
							<img className="img-fluid" src={logo} alt="Login Cover" style={{width:'70%'}}/>
						</CardTitle>
						<Form
							className="auth-login-form mt-2"
							onSubmit={handleSubmit}
						>
							<div className="mb-1">
								<Label className="form-label" for="username">
									아이디
								</Label>
								<Input
									id="username"
									name="username"
									onChange={onChange}
									value={inputUser}
									autoFocus
								/>
							</div>
							<div className="mb-1">
								<div className="d-flex justify-content-between">
									<Label className="form-label" for="password">
										패스워드
									</Label>
								</div>
								<InputPasswordToggle
									className="input-group-merge"
									id="password"
									name="password"
								/>
							</div>
							<Row className="d-flex mb-1" style={{justifyContent:'space-between'}}>
								{
									!checkApp &&
									<Col lg = '6' md = '6' xs = '12' className="d-flex">
										<Input type='checkbox' id='remember-me' onChange={e => setIsRemember(e.target.checked)} checked={isRemember} />
										<Label className='form-check-label ms-1 ' for='remember-me'>
											<span className="card_table text">아이디 기억하기</span>
										</Label>
									</Col >
								}
								<Col lg = '6' md = '6' xs = '12' className="creat_user_bt">
									<Link  to={ROUTE_REGISTER}>
										<span className="card_table text">새로운 계정 만들기</span>
									</Link>
								</Col>
							</Row>
							<Button type="submit" color="primary" block>
								로그인
							</Button>
							<div className="d-flex mt-1" style={{justifyContent:'space-between'}}>
								<div>
									<Link onClick={(e) => openModal(e)}>
										<span>시설불편 처리 요청</span>
									</Link>
								</div>
							</div>
						</Form>
					</Col>
				</Col>
			</Row>
			<ComplainModal formModal={formModal} setFormModal={setFormModal} />
		</div>
	)
}

export default Login
