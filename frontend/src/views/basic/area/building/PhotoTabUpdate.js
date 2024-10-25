import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Fragment, useState, useEffect } from "react"
import { Controller, useForm } from 'react-hook-form'
import { Button, CardBody, CardFooter, Col, Row, Form, Input, Label, FormFeedback } from "reactstrap"
import { API_SPACE_DETAIL_BUILDING_PHOTO_DETAIL } from '../../../../constants'
// import axios from "../../../../utility/AxiosConfig"
import * as yup from 'yup' 
import { yupResolver } from '@hookform/resolvers/yup'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { ReactComponent as Close } from '../../../../assets/images/close.svg' 
import { useNavigate } from 'react-router'
import { axiosPostPut, sweetAlert } from '../../../../utility/Utils'

const PhotoTabUpdate = (props) => {
	useAxiosIntercepter()
	const { data, update, setUpdate, type} = props
	const navigate = useNavigate()
	const [images, setImages] = useState([])
	const [imageName, setImageName] = useState('')
	const [submitResult, setSubmitResult] = useState(false)

	const defaultValues = {
		name : data['building_attachment']['name'], //제목
		is_main : data['is_main'],
		file_name : data['file_name']
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
		formState: { errors },
		trigger
	} = useForm({
		defaultValues,
		resolver: yupResolver(validationSchema)
	})

	const onSubmit = data => {
		const formData = new FormData()
		formData.append('id', type)
		formData.append('name', data.name)
		formData.append('is_main', data.is_main)
		if (imageName !== '' && images.length > 0) {
			formData.append('img', images)
			formData.append('imgName', imageName)
		}
		axiosPostPut('modify', "건물 사진", API_SPACE_DETAIL_BUILDING_PHOTO_DETAIL, formData, setSubmitResult)
	}

	useEffect(() => {
		if (submitResult) {
			navigate(-1)		
		}
	}, [submitResult])
	return (
		<Fragment>
			<Form onSubmit={handleSubmit(onSubmit)}>
				<CardBody>
					<Row className='card_table top' >
						<Col  xs='12'>
							<Row className='card_table table_row'>
								<Col xs='2'  className='card_table col col_color text center '>제목</Col>
								<Col xs='10' className='card_table col text start'>
									<Controller
										id='name'
										name='name'
										control={control}
										render={({ field: {onChange, value} }) => (
											<Col className='card_table col text center' style={{flexDirection:'column'}}>
												<Input 
													bsSize='sm' 
													invalid={errors.name && true} 
													value={value}
													onChange={(e) => {
														onChange(e.target.value)
														trigger('name')
													}} />
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
								<Col xs='2'  className='card_table col col_color text center '>등록자</Col>
								<Col xs='10' className='card_table col text start '>{data !== undefined && data['building_attachment']['user']}</Col>
							</Row>
						</Col>
					</Row>
					<Row className='card_table mid' >
						<Col xs='12' >
							<Row className='card_table table_row' >
								<Col xs='2'  className='card_table col col_color text center '>이미지</Col>
								<Col xs='10' className='card_table col text start ' >
									<div style={{width:'100%'}}>
										{ data['file_name'] !== undefined 
											?
											<div className='d-flex align-items-center justify-content-center' style={{height : '520px'}}>
												<img src={`/static_backend/${data.path}${data.file_name}`} style={{height:"100%", width: '100%', objectFit:'scale-down'}}></img>
											</div>
											:	
											<div className='d-flex align-items-center justify-content-center flex-column'  style={{backgroundColor: '#DCDCDC', borderRadius : '6px'}}>
												<h5 className='mt-1'>이미지 없음</h5>
											</div>
										}
										<div>
											<Controller
												id='is_main'
												name='is_main'
												control={control}
												render={({ field : {onChange, value} }) => (
													<Col className='form-check mt-1'>
														<Input id='use_is_regist_true' type='checkbox' value={value} checked={value}
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
					<Button color="report" onClick={() => setUpdate(!update)}>
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

export default PhotoTabUpdate