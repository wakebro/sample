import { yupResolver } from '@hookform/resolvers/yup'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import "@styles/react/pages/page-authentication.scss"
import { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
	Button, Col, Form, FormFeedback, Input,
	Modal, ModalBody,
	ModalHeader,
	Row
} from "reactstrap"
import Cookies from "universal-cookie"
import * as yup from 'yup'
import { API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, API_DOC_RECEIVER, API_DOC_RECEIVER_GROUP } from '../../../../constants'
import axios from "../../../../utility/AxiosConfig"
import { getTableData, makeSelectList, primaryHeaderColor, sweetAlert } from "../../../../utility/Utils"
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import EmployeeFilter from "./EmployeeFilter"
import ModalAddTable from './ModalAddTable'

const AddModal = (props) => {
	useAxiosIntercepter()

	const columns = [
		{
			name: '직종',
			sortable: true,
			selector: row => row.employee_class
		},
		{
			name: '직급',
			sortable: true,
			selector: row => row.position
		},
		{
			name: '이름(아이디)',
			sortable: true,
			selector: row => row.name,
			width:'35%'
		}
	]

	const {formModal, setFormModal} = props
	const [data, setData] = useState([])
	const [tableSelect, setTableSelect] = useState([])
	const [receiverCount, setReceiverCount] = useState(0)
	const [show, setShow] = useState(false)
	const cookies = new Cookies()
	const userid = cookies.get('userId')
	const property_id = 0 // 전체
	const [employeeClassList, setEmployeeClassList] = useState([])
	// const [employeeClass, setEmployeeClass] = useState({label:'직종', value:''}) //그룹의 직종
	const [selectClass, setSelectClass] = useState({label: '직종 전체', value:''}) // 필터의 직종
	const [selectLevel, setSelectLevel] = useState({label: '직급 전체', value:''})
	const [selectProperty, setSelectProperty] = useState({label: '사업소 전체', value:''})
	const [searchParams, setSearchParams] = useState('')

	// 직원 정보 받아오는 func
	const getInit = () => {
		const param = {
			employeeClass : selectClass.value,
			employeeLevel : selectLevel.value,
			search : searchParams,
			propertyId : selectProperty.value
		}
		getTableData(API_DOC_RECEIVER, param, setData)
	}
	
	const changeSearch = () => {
		getInit()
	}

	
	const validationSchema = yup.object().shape({
		title: yup.string().required('제목을 입력해주세요').min(1, '1자 이상 입력해주세요')

	})
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm({
		resolver: yupResolver(validationSchema)
	})

	const onSubmit = data => {
		if (tableSelect.length === 0) {
			sweetAlert('', "수신자를 선택해주세요", 'warning', 'center')
			return false
		}
		const formData = new FormData()
		formData.append('title', data.title) //그룹명
		formData.append('description', data.description) //비고
		formData.append('user_id', userid)
		formData.append('tableSelect', JSON.stringify(tableSelect))

		axios.post(API_DOC_RECEIVER_GROUP, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}).then(res => {
			if (res.status === 200) {
				setFormModal(!formModal)
				sweetAlert('', "수신자 그룹이 추가되었습니다", 'success', 'center')
			}
		}).catch(res => {
			console.log(res, "!!!!!!!!error")
		})

		reset()
		setFormModal(!formModal)
	}
	
	const customToggle = () => {
		setFormModal(!formModal)
		reset()
		setTableSelect([])
		setSelectProperty({label: '사업소 전체', value:''})
	}

	useEffect(() => {
		setReceiverCount(tableSelect.length)
	}, [tableSelect])
	
	useEffect(() => {
		setShow(true)
	}, [data])

	useEffect(() => {
		getInit()
	}, [])

	//그룹의 직종정보 받아오기
	useEffect(() => {
		getInit()
		setReceiverCount(0)
		axios.get(API_BASICINFO_FACILITY_TOOLEQUIPMENT_EMPLOYEE_CLASS, { params: {property_id: property_id} })
		.then(
			resEmployeeClass => {
			makeSelectList(true, '', resEmployeeClass.data, employeeClassList, setEmployeeClassList, ['name'], 'id')
		})
	}, [])

	return (
		
		<Modal isOpen={formModal} toggle={() => customToggle()} className='modal-dialog-centered modal-lg'>
			<Form id='secondForm' onSubmit={handleSubmit(onSubmit)}>
				<ModalHeader><span style={{fontSize: '20px'}}>수신자 그룹 추가</span></ModalHeader>
				<ModalBody>
				<EmployeeFilter 
					selectClass={selectClass} 
					setSelectClass={setSelectClass} 
					selectLevel={selectLevel} 
					setSelectLevel={setSelectLevel}
					searchParams={searchParams}
					setSearchParams={setSearchParams}
					changeSearch={changeSearch}
					selectProperty={selectProperty}
					setSelectProperty={setSelectProperty}
				/>
					
					{show &&
						<Row>
							<ModalAddTable className= 'mt-2'
								columns={columns}
								tableData={data}
								setTabelData={setData}
								setTableSelect={setTableSelect}
								tableSelect={tableSelect}
								selectType={true}/>
						</Row>
					}	
					<Row className="card_table mx-0 mt-2">
						<Col xs='12' md='6'>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_ts text center 'style={{ backgroundColor: primaryHeaderColor}}>그룹명</Col>
								<Col xs='8' className='card_table col text start border-xt' style={{flexDirection:'column'}}>
								<Controller
									id='title'
									name='title'
									control={control}
									render={({ field }) => (
										<Fragment>
											<Input invalid={errors.title && true} {...field} />
											{errors.title && <FormFeedback className='custom-form-feedback'>{errors.title.message}</FormFeedback>}
										</Fragment>
									)}/>

								</Col>
							</Row>
						</Col>
						<Col>
							<Row className='card_table table_row'>
								<Col xs='4'  className='card_table col col_ts text center ' style={{ backgroundColor: primaryHeaderColor}}>그룹인원</Col>
								<Col xs='8' className='card_table col text start border-xt'>
								{`총 ${receiverCount} 명`}
								</Col>
							</Row>
						</Col>
					</Row>
				<Row className="card_table mx-0 border-b">  
					<Col xs='12' md='12'>
						<Row className='card_table table_row'>
							<Col xs='4' md='2'  className='card_table col col_ts text center' style={{whiteSpace: 'nowrap', backgroundColor: primaryHeaderColor}}>비고</Col>
							<Col xs='8' md='10' className='card_table col text start border-xt'>
							<Controller
								id='description'
								name='description'
								control={control}
								render={({ field }) => <Input type='textarea' invalid={errors.description && true} {...field} />}/>
								{errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}

							</Col>
						</Row>
					</Col>
				</Row>

				<Col className='d-flex justify-content-end mt-3 mb-1' style={{paddingRight: '3%'}}>
					<Button color='report' style={{marginTop: '1%', marginRight: '1%'}} onClick={customToggle}>취소</Button>
					<Button type='submit' color='primary' style={{marginTop: '1%'}}>저장</Button>
				</Col>
				</ModalBody>
			</Form>
		</Modal>
	)
}

export default AddModal
