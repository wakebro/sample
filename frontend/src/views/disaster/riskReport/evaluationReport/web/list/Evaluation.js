import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setPageType, setTab } from '@store/module/criticalDisaster'
import { sweetAlert } from '@utils'

import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'
import { Button, Card, Col, Row } from 'reactstrap'
import { useParams } from "react-router-dom"

import { ROUTE_CRITICAL_DISASTER_EVALUATION, ROUTE_CRITICAL_DISASTER_REPORT_EXPORT } from '../../../../../../constants'
import { checkApp } from '../../../../../../utility/Utils'
import { pageTypeKor } from '../../../../../system/auth/data'
import { handleResetNToListBTN, tabObjList } from '../data'
import { EvaluationDetail } from './EvaluationDetail'
import { EvaluationForm } from './EvaluationForm'
import { FileText } from 'react-feather'

const Evaluation = () => {
	useAxiosIntercepter()
	const { state } = useLocation()
	const { id } = useParams() 
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const loginAuth = useSelector((state) => state.loginAuth)
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [isManager, setIsManager] = useState(false)

	const handleTab = (movetab) => {
		// func local tab은 이동할 tab
		const pageType = criticalDisaster.pageType
		const tabTempSaveCheck = criticalDisaster.tabTempSaveCheck
		const tabId = (criticalDisaster.tab === 'evaluation' || criticalDisaster.tab === 'counterplan') ? 'evaluationEvaluatorId' : `${criticalDisaster.tab}Id` 
		// 이동할 탭이 아니라 현재 탭을 체크해야함.
		if (pageType === 'detail' && (criticalDisaster[tabId] !== '' || tabTempSaveCheck)) { // detail에서는 id존재 유무로 구분
		// if (pageType === 'detail' && criticalDisaster[tabId] !== '') { // detail에서는 id존재 유무로 구분
			dispatch(setTab(movetab))
			return
		}
		if ((pageType === 'register' || pageType === 'modify') && tabTempSaveCheck) { // register, modify 일때는 임시 버튼 클릭으로 구분
			dispatch(setTab(movetab))
			return
		}
		// 경우의 수를 구분해야하는 이유는 modify일때 id는 존재 하지만 임시 버튼을 눌렀는지 체크 해야하기때문입니다.
		sweetAlert('임시 저장이 안되었습니다.', '임시 저장 후 다시 클릭해 주세요.', 'warning', 'center')
	}

	function gotoList () { navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list`) }

	/** 등록&수정일 때 SweetAlert 출력 후 페이지 이동 결정,
	 * 상세 일때는 바로 페이지 이동
	 */
	function handleGotoList() {
		if (criticalDisaster.pageType === 'detail') navigate(`${ROUTE_CRITICAL_DISASTER_EVALUATION}/list`)
		else handleResetNToListBTN(
			'현재 페이지를 떠나시겠습니까?',
			'저장되지 않은 내용은 모두 삭제됩니다.',
			gotoList
		)
	}

	function handleClick() {
		window.open(`${ROUTE_CRITICAL_DISASTER_REPORT_EXPORT}/${id}`, '_blank')
	}

	useEffect(() => {
		dispatch(setPageType(state.pageType))
		setIsManager(loginAuth.isManager)
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='위험성평가' breadCrumbParent='중대재해관리' breadCrumbActive={`위험성평가 ${pageTypeKor[criticalDisaster.pageType]}`}/>
					{ criticalDisaster.pageType === 'detail' && 
						<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleClick}>
							<FileText size={14}/>
							문서변환
						</Button.Ripple>
					}
				</div>
			</Row>
			<Row>
				<Col lg={8} md={8} xs={12}>
					<Row>
						{tabObjList.map(tab => {
							const tabId = (tab.value === 'evaluation' || tab.value === 'counterplan') ? 'evaluationEvaluatorId' : `${tab.value}Id` 
							const isDisabled = criticalDisaster.pageType === 'detail' && isManager === false && criticalDisaster[tabId] === ''
							if (checkApp && tab.value === 'counterplan') return
							return (
								<Col key={tab.value} xl='2' md ='4' xs='12' className="mb-1" style={{ paddingLeft: '1rem', display: 'flex' }}>
									<Button 
										color={
											criticalDisaster.tab === tab.value ? 
											'primary' 
											: 
											isDisabled ?
											'report'
											:
											'secondary'
										} 
										style={{width:'100%', padding:'0.7rem', minWidth:'100px'}} 
										disabled={isDisabled} 
										onClick={() => handleTab(tab.value)}
										>{tab.label}</Button>
								</Col>
							)
						})}
					</Row>
				</Col>
				{
					!checkApp && 
					<Col lg={4} md={8} xs={12} style={{display:'flex', justifyContent:'flex-end'}}>
						<Button style={{padding:'0.7rem', display:'flex', justifyContent:'center', height:'fit-content'}} outline onClick={() => handleGotoList()}>
							<div style={{height:'fit-content'}}>목록</div>
						</Button>
					</Col>
				}
			</Row>
			{ 
				(criticalDisaster.pageType === 'register') ?
					<EvaluationForm/>
				:
					<EvaluationDetail/>
			}
			{
				checkApp &&
				<Card style={{marginTop:'10px'}}>
					<Button outline onClick={() => handleResetNToListBTN(
													'현재 페이지를 떠나시겠습니까?',
													'저장되지 않은 내용은 모두 삭제됩니다.',
													gotoList
					)}>목록보기</Button>
				</Card>
			}
		</Fragment>
	)
}

export default Evaluation