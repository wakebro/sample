import { Fragment } from "react"
import { Card, CardBody, CardFooter, Col, Row, Button } from 'reactstrap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { customFileBadge, getObjectKeyCheck, signPreCheck, sweetAlert } from "../../../utility/Utils"
import { API_INSPECTION_PERFORMANCE_DETAIL, API_INSPECTION_PERFORMANCE_SIGN, ROUTE_INSPECTION_INSPECTION_LIST, ROUTE_CRITICAL_DISASTER_LIST } from '../../../constants'
import { OXChoiceList, scoreChoiceList, completeResultAlert, deleteAlert, fiveSelectList } from '../data'
import axios from "../../../utility/AxiosConfig"
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import Swal from 'sweetalert2'
import { useNavigate, useParams, Link, useLocation } from "react-router-dom"

const DetailSection = (props) => {
	useAxiosIntercepter()
	const { 
		getInit, sectionData, fileData, setUpdate, completable, 
		signList, signIdList, cookies, signListObj, signButton, 
		isInCharge, isSignPreSign, userSign, isMod, listApi
	} = props
	const { id } = useParams()
	const navigate = useNavigate()
	const state = useLocation()
    const activeUser = Number(cookies.get('userId')) // 현재 접속 유저 아이디

	const downLoad = (data) => {
		axios({
			url: data['file_path'],
			method: 'GET',
			responseType: 'blob'
		}).then((response) => {
			const url = window.URL.createObjectURL(new Blob([response.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download', `${data['name']}`)
			document.body.appendChild(link)
			link.click()
		}).catch((res) => {
			console.log(res)
		})
	}

	const deleteForm = () => {
		axios.delete(API_INSPECTION_PERFORMANCE_DETAIL, { data: { id: id }}).then(res => {
			if (res.status === 200) {
				completeResultAlert('삭제를', navigate, res.data, state)
			}
		}).catch(res => {
			console.log(res, "!!!!!!!!error")
		})
	}

	const deleteAlertCustom = () => {
		deleteAlert(() => deleteForm())
	}
	const updateForm = () => {
		setUpdate(true)
	}

	// 결재목록에 접속 유저의 아이디가 있다면 인덱스를 찾아서 넣고 아니라면 -1을 넣는다.
	// 0 : 아무것도 안된상태, 1 : 결재, 2: 전결

	const handleSign = () => {
		const activeUserIndex = signIdList.indexOf(cookies.get('userId'))
		const previousUserSigns = [ // 클릭한 박스의 왼쪽 박스 유저를 가져옴
			userSign[activeUserIndex - 1],
			userSign[activeUserIndex - 2],
			userSign[activeUserIndex - 3]
		]
		const preSignCheckResult = signPreCheck(activeUser, previousUserSigns)

		if (activeUserIndex === 0 || (getObjectKeyCheck(preSignCheckResult, 'result') !== '' && preSignCheckResult.result)) {
			Swal.fire({
                title: '알림',
                html: "확인을 클릭하면 더는 수정하실 수 없습니다.\n 해당 결재 내역을 저장하시겠습니까?",
                icon: 'warning',
				showCancelButton: true,
				cancelButtonText: '취소',
				confirmButtonText: '결재',
				customClass: {
					cancelButton: 'btn btn-report ms-1',
					confirmButton: 'btn btn-primary',
					container: 'space',
					actions: 'sweet-alert-custom right'
				}
			}).then(function (result) {
				if (result.value) {
					const copyList = [...signList]
                    for (const i in copyList) {
                        const numberI = Number(i)
                        if ((numberI === activeUserIndex) && (userSign[numberI]?.is_final === false)) {
                            copyList[numberI] = 1
                            break
                        } else if ((numberI !== activeUserIndex) && (userSign[numberI].view_order > userSign[activeUserIndex].view_order) && (userSign[numberI]?.is_final === false) && (userSign[numberI].type !== 3)) {
                            copyList[numberI] = 2
                            break
                        }
                    }
					const formData = new FormData()
					formData.append('id', id)
					formData.append('user_id', cookies.get('userId'))
					formData.append('sign_list', JSON.stringify(copyList))
					axios.put(API_INSPECTION_PERFORMANCE_SIGN, formData, {
					}).then(res => {
						if (res.status === 200) {
							if (res.status = '200') {
								Swal.fire({
									title: '결재 완료!',
									text: '결재가 진행 되었습니다',
									icon: 'success',
									customClass: {
										confirmButton: 'btn btn-success',
										actions: 'sweet-alert-custom right'
									}
								})
								getInit()
							}
						}
					}).catch(res => {
						console.log(res, "!!!!!!!!error")
					})
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					sweetAlert('결재 취소', '결재가 취소 되었습니다. 재 확인 해주세요.', 'info')
				}
			})
		} else if (activeUserIndex >= 0) {
			sweetAlert('결재 불가', `${signListObj[preSignCheckResult.index]} 결재가 진행 되지 않았습니다.`, 'warning')
		}
		// 필요예외처리
		// 로그인한 사람이 결재라인에 포함되어있는지 (이미 빌이 버튼에서 예외처리 진행중)
		// 로그인한 사람의 결재라인 전 사람이 결제를 했는지
			// 전 사람이 결재를 한 경우 -> 로그인사람이 결재를 안누르고 했다는 알럿 and 결재를 진행하겠다는 알럿 // 끝                   
			// 안했을경우 -> 전 사람이 결재를진행 안했다는 알럿 // 끝
		// 로그인한 사람이 결재를 했음(다음 결재자에 대한 전결)
			// 담당자가(결제진행완료) -> 1차 또는 다음 결재자에가 결제가 진행되지 않아서 전결처리한다는 결재 알럿창 띄움
	}

	const handleReturn = () => {
		Swal.fire({
			title: '알림',
			text: "해당 보고서를 회수하시겠습니까?.\n 결재 내역은 초기화 됩니다.",
			icon: 'info',
			showCancelButton: true,
			cancelButtonText: '취소',
			confirmButtonText: '회수',
			customClass: {
				cancelButton: 'btn btn-report ms-1',
				confirmButton: 'btn btn-primary',
				container: 'space',
				actions: 'sweet-alert-custom right'
			}
		}).then(function (result) {
			if (result.value) {
				const formData = new FormData()
				formData.append('id', id)
				formData.append('user_id', cookies.get('userId'))
				axios.put(API_INSPECTION_PERFORMANCE_DETAIL, formData, {
				}).then(res => {
					if (res.status === 200) {
						if (res.status = '200') {
							Swal.fire({
								title: '회수 완료!',
								text: '회수가 진행 되었습니다',
								icon: 'success',
								customClass: {
									confirmButton: 'btn btn-success',
									actions: 'sweet-alert-custom right'
								}
							})
							getInit()
						}
					}
				}).catch(res => {
					console.log(res, "!!!!!!!!error")
				})
			} else if (result.dismiss === Swal.DismissReason.cancel) {
				sweetAlert('회수 취소', '회수 취소 되었습니다. 재 확인 해주세요.', 'info')
			}
		})

	}

	const descriptionTemp = (data) => {
		if (data !== undefined) {
			if (data['questions'] !== undefined) {
				let check = false
				data['questions'].forEach((v) => {
					if (v['use_description']) {
						check = true
					}
				})
				if (check) {
					return (
						<Col>
							비고
						</Col>
					)
				}
			}
		}
	}
	const QaListTemp = (data) => {
		let check = false
		data['questions'].forEach((v) => {
			if (v['use_description']) {
				check = true
			}
		})
		return (
			data['questions'].map((v, i) => {
				let answer = ""
				if (v['is_choicable']) {
					answer = v['answer']
				} else {
					if (v['choice_type'] === 0) {
						if (v['answer'] !== null && v['answer'] !== "") {
							answer = scoreChoiceList.find(item => item.value === parseInt(v['answer'])).label
						}
					} else if (v['choice_type'] === 1) {
						if (v['answer'] !== null && v['answer'] !== "") {
							answer = OXChoiceList.find(item => item.value === parseInt(v['answer'])).label
						}
					} else if (v['choice_type'] === 2) {
						if (v['answer'] !== null && v['answer'] !== "") {
							answer = fiveSelectList.find(item => item.value === parseInt(v['answer'])).label
						}
					}
				}
				return (
					<Row style={{borderBottom : '1px solid #D8D6DE'}} key={v['title'] + i} >
						<Col className='mt-1 mb-1' lg={check ? 4 : 6} xs={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
							{v['title']}
						</Col>
						<Col className='mt-1 mb-1' lg={check ? 4 : 6} xs={check ? 4 : 6} style={{display:"flex", alignItems : 'center'}}>
							{answer}
						</Col>
						{v['use_description'] && 
						<Col className='mt-1 mb-1' lg={4} xs={4}>
							{v['description']}
						</Col>
						}
					</Row>		
				)
			})
		)
	}

	return (
		<Fragment>
				<Card>
					<CardBody>
						<Row>
							{
								sectionData.map((data, i) => {
									let check_hour = "\b"
									if (data['check_hour'] !== null) {
										if (data['check_hour'] < 10) {
											check_hour = `0${data['check_hour']}:00`
										} else {
											check_hour = `${data['check_hour']}:00`
										}
									}
									
									return (
										<Fragment key={i}>
											<Col  style={{marginTop : '1rem'}} lg='5' md='11'>
												<Row className='mt-1 mb-1'>
													<Col style={{fontFamily : 'Montserrat,sans-serif', fontWeight : '900'}}>
														{check_hour}
													</Col>
												</Row>
												<Row style={{borderBottom : '1px solid #D8D6DE'}}>
													<Col style={{fontFamily : 'Montserrat,sans-serif', fontWeight : '900'}}>
														{data['title']}
													</Col>
													<Col>
														점검결과
													</Col>
													{descriptionTemp(data)}
												</Row>
												{QaListTemp(data, i)}
											</Col>
											<Col lg='1' md='1'>
											</Col>
										</Fragment>
									)
								})
							}
						</Row>
					</CardBody>
					<CardBody style={{borderTop : '1px dashed #C1C1CB'}}>
						<Row>
							<Col>
								첨부파일 {fileData.length}개
							</Col>
						</Row>
						{
							fileData.map((data, i) => {
								return (
									<Row key={i} >
										<Col>
											<span onClick={() => downLoad(data)} style={{cursor:'pointer'}}>{customFileBadge(data['ext'])}{data['name']}</span>
										</Col>
									</Row>
								)
							})
						}
					</CardBody>
					<CardFooter style={{display:'flex', justifyContent : 'flex-end'}}>
						{ completable === 3 && isMod &&
							<>
								<Button type='button' color="danger" onClick={() => deleteAlertCustom()}>삭제</Button>
								<Button className="ms-1" type='button' color="primary" onClick={() => updateForm()}>수정</Button>
							</>
						}
						{ completable === 1 && signButton &&
							<>
								{ isSignPreSign && <Button className="ms-1" type='button' color="primary" onClick={() => handleSign()}>결재</Button>}
							</>
						}
						{ isMod && isInCharge && completable === 1 &&
							<>
								<Button className="ms-1" type='button' color="danger" onClick={() => handleReturn()}>회수</Button>
							</>
						}
						<Button 
							className="ms-1" 
							type='button'
							tag={Link}
							to={listApi}
							state={{type: state.state.type, scheduleId: state.state.scheduleId}}
						>목록</Button>
					</CardFooter>

				</Card>
		</Fragment>
	)
}
export default DetailSection