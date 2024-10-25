import { setAuth, setAuths, setIsOpen, setName } from "@store/module/authUser"
import { selectListType } from "@utils"
import axios from "axios"
import { Fragment, useEffect } from "react"
import { X } from "react-feather"
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Modal, Row } from "reactstrap"
import { API_EMPLOYEE_DETAIL, API_SYSTEMMGMT_AUTH_EMPLOYEE, API_SYSTEMMGMT_AUTH_GROUP } from "../../../../constants"
import { axiosPostPutRedux } from "../../../../utility/Utils"

// 사용자에게 권한 상속을 위한 컴포넌트
const AddPermissionGroupAuth = () => {
	const authUser = useSelector((state) => state.authUser)
	const dispatch = useDispatch()

	const closeModal = () => {
		dispatch(setIsOpen(false))
	}

	const getGroupAuthList = () => {
		axios.get(API_SYSTEMMGMT_AUTH_GROUP, {params: {searchValue: ''}})
		.then(res => {
			const tempList = []
			res.data.map(row => tempList.push(selectListType('', row, ['group_name'], 'group_id')))
			dispatch(setAuths(tempList))
		})
	}

	const getUserId = (id) => {
		axios.get(API_EMPLOYEE_DETAIL, {params: {userId: id}})
		.then(res => {
			dispatch(setName(`${res.data.name} ${res.data.username}`))
			if (res.data.permission_group !== null) {
				dispatch(setAuth(selectListType('', res.data.permission_group, ['name'], 'id')))
			}
		})
	}

	const handleSubmit = () => {
		const formData = new FormData()
		formData.append('userId', authUser.id)
		formData.append('groupId', authUser.auth.value)

		axiosPostPutRedux('modify', '그룹권한관리', API_SYSTEMMGMT_AUTH_EMPLOYEE, formData, dispatch, setIsOpen, false)
	}

	useEffect(() => {
		if (authUser.id !== null && authUser.id !== undefined) {
			getGroupAuthList()
			getUserId(authUser.id)
			dispatch(setIsOpen(true))
		}
	}, [authUser.id])
	return (
		<Fragment>
			<Modal isOpen={authUser.isOpen} toggle={() => closeModal()} className='modal-dialog-centered modal-sm'>
				<Card style={{margin:'0'}}>
					<CardHeader>
						<CardTitle>{`그룹권한관리(${authUser.name})`}</CardTitle>
						<X style={{cursor:'pointer'}} onClick={() => closeModal()}/>
					</CardHeader>
					<CardBody style={{paddingBottom:'3%'}}>
						<Select
							classNamePrefix={'select'}
							className="react-select"
							options={authUser.auths}
							value={authUser.auth}
							onChange={(e) => dispatch(setAuth(e))}
						/>
					</CardBody>
					<CardFooter>
						<Row style={{flexDirection:'row-reverse'}}>
							<Col style={{display:'flex', justifyContent:'flex-end'}}>
								<Button color='report' onClick={() => closeModal()}>취소</Button>
								&nbsp;&nbsp;
								<Button color="primary" disabled={authUser.auth.value === null } onClick={() => handleSubmit()}>확인</Button>
							</Col>
						</Row>
					</CardFooter>
				</Card>
			</Modal>
		</Fragment>
	)
}

export default AddPermissionGroupAuth