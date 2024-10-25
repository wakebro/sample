import Breadcrumbs from '@components/breadcrumbs'
import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, Row, Spinner, TabContent, TabPane } from "reactstrap"
import { API_SYSTEMMGMT_AUTH_MENU, ROUTE_SYSTEMMGMT_AUTH_GROUP } from '../../../../../constants'
import { changeAuthMenuTabListList, changeList, changeProgress } from '../../../../../redux/module/authMenu'
import { selectListType, primaryColor } from '../../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../../utility/hooks/useAxiosInterceptor'
import CustomDataTable from '../../../basic/company/list/CustomDataTable'
import NavTab from '../../../basic/company/list/NavTab'
import { getCodeName } from '../../data'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

const AuthMenu = () => {
	useAxiosIntercepter()
	const [detailRow] = useState(useParams().id)
	const [navActive, setNavActive] = useState()
	const authMenu = useSelector((state) => state.authMenu)
	const dispatch = useDispatch()

	const getMainMenus = () => {
		axios.get(API_SYSTEMMGMT_AUTH_MENU, {})
		.then(res => {
			const temp = []
			res.data.map(row => {
				temp.push(selectListType('', row, ['name'], 'code'))
			})
			dispatch(changeAuthMenuTabListList(temp))
			setNavActive(temp[0].value)
		})
	}

	const updateDataTable = (data) => {
		const temp = []
		data.map(row => {
			temp.push({
				id: row.id,
				code: row.menu.code,
				name: row.menu.name,
				available_create : row.available_create,
				available_delete : row.available_delete,
				available_read : row.available_read,
				available_update : row.available_update
			})
		})
		dispatch(changeList(temp))
		dispatch(changeProgress(false))
	}

	const getDetailMenu = () => {
		dispatch(changeProgress(true))
		axios.get(`${API_SYSTEMMGMT_AUTH_MENU}/${navActive.substr(0, 2)}`, {
			params:{
				group:detailRow
			}
		})
		.then(res => {
			updateDataTable(res.data)
		})
	}

	const updateAvailables = (e) => {
		Swal.fire({
			title: '그룹권한관리 설정',
			html: '수정 내용이 바로 저장됩니다.\n저장하시겠습니까?',
			icon: 'warning',
			showCancelButton: true,
			showConfirmButton: true,
			heightAuto: false,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then(res => {
			if (res.isConfirmed === true) {
				dispatch(changeProgress(true))
				const code = e.target.className.split(' ')[0]
				const formData = new FormData()
				formData.append('id', e.target.id)
				formData.append('target', e.target.name)
				formData.append('result', e.target.checked)
				axios.put(`${API_SYSTEMMGMT_AUTH_MENU}/${code}`, formData)
				.then(res => {
					updateDataTable(res.data)
				})
			} else {
				getDetailMenu()
			}
		})
	}

	useEffect(() => {
		getMainMenus()
	}, [])

	useEffect(() => {
		if (navActive !== undefined) {
			getDetailMenu()
		}
	}, [navActive])

	const authColumn = [
		{
			name:'메뉴',
			cell: row => getCodeName(row, 'depth1')
		},
		{
			name:'서브메뉴',
			cell: row => getCodeName(row, 'depth2')
		},
		{
			name:'상세메뉴',
			cell: row => getCodeName(row, 'depth3')
		},
		{
			name:'보기',
			cell: row => <Input id={row.id} className={row.code} name="available_read" type="checkbox" onChange={(e) => updateAvailables(e) } defaultChecked={row.available_read}/>
		},
		{
			name:'수정',
			cell: row => <Input id={row.id} className={row.code} name="available_update" type="checkbox" onChange={(e) => updateAvailables(e) } defaultChecked={row.available_update}/>
		},
		{
			name:'삭제',
			cell: row => <Input id={row.id} className={row.code} name="available_delete" type="checkbox" onChange={(e) => updateAvailables(e) } defaultChecked={row.available_delete}/>
		},
		{
			name:'등록',
			cell: row => <Input id={row.id} className={row.code} name="available_create" type="checkbox" onChange={(e) => updateAvailables(e) } defaultChecked={row.available_create}/>
		}
	]

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='그룹권한관리' breadCrumbParent='시스템관리' breadCrumbParent2='권한관리' breadCrumbActive='그룹권한관리' />
				</div>
			</Row>
			<Row>
				<Col md={12}>
					<NavTab tabList={authMenu.authMenuTabList} active={navActive} setActive={setNavActive}/>
				</Col>
			</Row>
			{
				<TabContent activeTab={navActive}>
					{
						authMenu.authMenuTabList !== undefined && authMenu.authMenuTabList.map((tab, idx) => {
							return (
								<TabPane tabId={tab.value} key={idx}>
									<Card>
										<CardHeader>
											<CardTitle className="title">{tab.label}</CardTitle>
											{/* <Button>afe</Button> */}
											<Button tag={Link} to={ROUTE_SYSTEMMGMT_AUTH_GROUP}>목록</Button>
										</CardHeader>
										<CardBody>
											{
												authMenu.progress ? 
												<Card>
													<CardBody>
														<Row style={{justifyContent:'center'}}>
															<div style={{display:'flex', justifyContent:'center'}}>
																<Spinner color='warning' />
															</div>
														</Row>
													</CardBody>
												</Card>
												:
												<CustomDataTable
													columns={authColumn} 
													tableData={authMenu.list} 
													selectType={false}
													rowCnt={100}
												/>
											}
										</CardBody>
									</Card>
								</TabPane>
							)
						})
					}
				</TabContent>
			}
		</Fragment>
	)
}

export default AuthMenu