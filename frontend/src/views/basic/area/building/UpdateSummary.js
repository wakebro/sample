import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { Fragment } from "react"
import { Col, Row, Form, Input, CardFooter, Button, CardBody, FormFeedback} from 'reactstrap'
import { BuildingSummaryList } from "../data"
import FileUploaderSingle from "./FileUploaderSingle"
import { Controller, useForm } from 'react-hook-form'
import { API_SPACE_SUMMARY_DETAIL_BUILDING, ROUTE_BASICINFO_AREA_BUILDING_PHOTO} from '../../../../constants'
import { useNavigate, useParams } from "react-router-dom"
// import {  } from "react-router-dom"
import * as yup from 'yup'
const UpdateSummary = (props) => { // 안쓰는 컴포넌트
	useAxiosIntercepter()
	// const [locationKeys, setLocationKeys] = useState([])
	const {files, setFiles, data, setUpdate, update, getHistory} = props
	const navigate = useNavigate()
	const {type} = useParams()
	const defaultValues = {
		name : data['name'],
		district : data['district'],
		main_purpose : data['main_purpose'],
		contact_name : data['contact_name'],
		contact_phone : data['contact_phone'],
		prop_group : data['prop_group'],
		address : data['address']
	}

	const validationSchema = yup.object().shape({
		name: yup.string().required('건물명을 입력해주세요').min(1, '1자 이상 입력해주세요')
		// district: yup.string().required('지역명을 입력해주세요').min(1, '1자 이상 입력해주세요')
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

	const cancleClick = () => {
		setUpdate(!update)
		getHistory()
	}

	const onSubmit = datas => {
		const formData = new FormData()
		formData.append('id', data.id)
		formData.append('name', datas.name)
		formData.append('district',  datas.district)
		formData.append('main_purpose', datas.main_purpose)
		formData.append('contact_name', datas.contact_name)
		formData.append('contact_phone', datas.contact_phone)
		formData.append('prop_group', datas.prop_group)
		formData.append('address', datas.address)
		formData.append('images',  files[0])
		

		axios.put(API_SPACE_SUMMARY_DETAIL_BUILDING, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}).then(res => {
			if (res.status === 200) {
				setUpdate(!update)
				navigate(`${ROUTE_BASICINFO_AREA_BUILDING_PHOTO}/${type}`)
				// getHistory()
			}
		}).catch(res => {
			console.log(res, "!!!!!!!!error")
		})
	}
	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<CardBody >
					<FileUploaderSingle
						setFiles={setFiles}
						files={files}
					/>
					{
						BuildingSummaryList.map((tab, idx) => {
							const title = tab.value
							return (
								<Row key={idx} className={idx === 0 ? "card_table top mt-1" : (idx === 6 ? 'card_table mid mb-2' : 'card_table mid')}>
									<Col>
										<Row className='card_table row'>
											<Col xs = '3' className="card_table col_color col">
												{tab.label}
											</Col>
											<Col xs = '9' className="card_table col">
												<Controller
													id={title}
													name={title}
													control={control}
													render={({ field }) => <Input bsSize='sm' placeholder={tab.label} invalid={errors[title] && true} {...field}/>}
												/>
												{errors[title] && <FormFeedback>{errors[title].message}</FormFeedback>}
											</Col>
										</Row>
									</Col>
								</Row>
							)
						})
					}		
				</CardBody>
				<CardFooter style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
				
					<Button color="report" onClick={() => cancleClick()}>
						취소
					</Button>
					<Button type='submit' className="ms-1" color="primary">
						확인
					</Button>
			
				</CardFooter>	
			</Form>	
		</Fragment>
	)
}

export default UpdateSummary
