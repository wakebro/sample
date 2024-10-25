import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useState, useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import Breadcrumbs from '@components/breadcrumbs'
import { Button, CardBody, CardFooter, Col, Row, Form, Input, Label, Card, CardHeader, CardTitle, FormFeedback } from "reactstrap"
import { API_SPACE_DETAIL_BUILDING_PHOTO } from '../../../../constants'
import * as yup from 'yup' 
import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { ReactComponent as Close } from '../../../../assets/images/close.svg'
import BuildingBasicInfoCard from "./BuildingBasicInfoCard"
import Tab from "./Tab"
import Cookies from 'universal-cookie'
import { axiosPostPut, getTableData, sweetAlert } from '../../../../utility/Utils'
import { useNavigate, useParams } from "react-router-dom"

const PhotoTabRegister = () => {
	useAxiosIntercepter()
	const navigate = useNavigate()
	// const { state } = useLocation()
	const {type} = useParams()
	const cookies = new Cookies()
	const [images, setImages] = useState([])
	const [imageName, setImageName] = useState('')
	const [userData, setUserData] = useState([])
	const [submitResult, setSubmitResult] = useState(false)

	const defaultValues = {
		name : '', //제목
		is_main : false,
		file_name : []
	}
	
	const onChangeFile = (e) => {
        setImages([])
        const files = e.target.files
        
        let checkError = false
        const readerList = []
        for (let key = 0; key < files.length; key++) {
            const fileName = files[key].name
			setImageName(fileName)
            if (fileName.includes(',')) {
				sweetAlert('', "이미지 이름에 ',' 은 못들어갑니다.", 'warning', 'center')
                checkError = true
                break
            }

            const fileSize = files[key].size
            const maxData = 20 * 1024 * 1024
            if (fileSize > maxData) {
				sweetAlert('', "20MB를 초과한 이미지가 포함됐습니다.", 'warning', 'center')
                checkError = true
                break
			}

            const reader = new FileReader()
            reader.readAsDataURL(files[key])
            readerList.push(reader)
        }

        if (!checkError) {
            readerList.forEach(function(reader) {
                reader.onload = function () {
                    setImages(images => [...images, reader.result])  // 이미지 파일 자체가 들어감
                }
            })
        }
	}

	const renderFilePreview = file => {
		if (file !== null) {
			if (file.type !== undefined) {
				return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='25' width='25' />
			} else {
				return <img className='rounded' alt={file.name} src={file} height='25' width='25' />
			}
		}
	}

	const onRemoveFile = (image) => {
		setImages(images.filter(e => e !== image))
	}

	const validationSchema = yup.object().shape({
		name: yup.string().required('건물명을 입력해주세요.')
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
		formData.append('building_id', type)
		formData.append('name', data.name)
		formData.append('is_main', data.is_main)
		formData.append('images', images)
		formData.append('imgName', imageName)

		axiosPostPut('register', "건물 사진", API_SPACE_DETAIL_BUILDING_PHOTO, formData, setSubmitResult)
	}

	useEffect(() => {
		getTableData(API_SPACE_DETAIL_BUILDING_PHOTO, {user:cookies.get('userId')}, setUserData)
	}, [])

	useEffect(() => {
		if (submitResult) {
			navigate(-1)		
		}
	}, [submitResult])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='건물정보' />
				</div>
			</Row>
			<Row style={{height : '100%'}}>
				<Col md='4'>
					<BuildingBasicInfoCard />
				</Col>
				<Col>
					<Row>
						<Tab md='5' id={type} active='photo'></Tab>
					</Row>
					<Row>
						<Card>
							<CardHeader>
								<CardTitle>
									사진
								</CardTitle>
							</CardHeader>
							<Form onSubmit={handleSubmit(onSubmit)}>
								<CardBody>
									<Row className='card_table top' >
										<Col  xs='12'>
											<Row className='card_table table_row'>
												<Col xs='2'  className='card_table col col_color text center '>제목</Col>
												<Col xs='10' className='card_table col text start '>
													<Controller
														id='name'
														name='name'
														control={control}
														render={({ field }) => (
															<Col className='card_table col text center' style={{flexDirection:'column'}}>
																<Input bsSize='sm' invalid={errors.name && true} {...field} />
																{errors.name && <FormFeedback>{errors.name.message}</FormFeedback>}	
															</Col>
														)}
													/>
												</Col>
											</Row>
										</Col>
									</Row>
									<Row className='card_table mid' >
										<Col xs='12'>
											<Row className='card_table table_row'>
												<Col xs='2'  className='card_table col col_color text center'>등록자</Col>
												<Col xs='10' className='card_table col text start'>{userData && `${userData.username}(${userData.name})`}</Col>
											</Row>
										</Col>
									</Row>
									<Row className='card_table mid' >
										<Col xs='12' >
											<Row className='card_table table_row' >
												<Col xs='2'  className='card_table col col_color text center '>이미지</Col>
												<Col xs='10' className='card_table col text start ' >
													<div style={{width:'100%'}}>
														{/* <div className='d-flex align-items-center justify-content-center flex-column'  style={{backgroundColor: '#DCDCDC', borderRadius : '6px'}}>
															<h5 className='mt-1'>이미지 없음</h5>
														</div> */}
														<div>
															<Controller
																id='is_main'
																name='is_main'
																control={control}
																render={({ field : {onChange, value} }) => (
																	<Col className='form-check mt-1'>
																		<Input id='use_is_regist_true' type='radio' value={value} checked={value}
																		onClick={() => {								
																			onChange(!value)
																		}} 
																		readOnly	
																		/>
																		<Label className='form-check-label' for='use_is_regist_true'>
																			기본사진설정
																		</Label>
																		
																	</Col>
																)} 
																	
															/>
														</div>
														<div>
															<Label className='mt-1'>
																첨부파일
															</Label>
															<Input name='file' type='File' accept="image/jpg, image/jpeg, image/png" onChange={onChangeFile} />
														</div>
														<div className="form-control hidden-scrollbar mt-1" style={{height: '40px', display: 'flex', alignItems: 'center'}}>
															{
																images.length > 0 &&
																images.map((image, idx) => {
																	return <div key={`email_${idx}`} style={{position: 'relative', paddingRight: '10px'}}>
																				<div style={{position: 'absolute', width: '100%', height: '100%'}}>
																					<div style={{display:'flex', flexDirection:'row-reverse', paddingRight: '4px'}}>
																						<Close onClick={() => onRemoveFile(image)} style={{cursor: 'pointer'}} />
																					</div>
																				</div>
																				{renderFilePreview(image)}
																			</div>
																})
															}
														</div>

													</div>
													
												
												</Col>
											</Row>
										</Col>
									</Row>
								</CardBody>
								<CardFooter style={{display : 'flex', justifyContent : 'end', alignItems : 'end'}}>
									<Button color="report" onClick={() => navigate(-1)}>
										취소
									</Button>
									<Button type='submit' className="ms-1" color="primary">
										확인 
									</Button>	
								</CardFooter>
							</Form>
						</Card>
					</Row>
				</Col>
			</Row>

		</Fragment>
	)
}

export default PhotoTabRegister