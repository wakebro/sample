import Breadcrumbs from '@components/breadcrumbs'
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setDataTableList, setIsOpen, setMainClass, setMainClassList, setMidClass, setMidClassList, setSubClass } from '@store/module/basicPnrClass'
import axios from 'axios'
import { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'reactstrap'
import { API_BASICINFO_PARTNER_CLASS } from '../../../../constants'
import { setCode, setName, setPageType } from '../../../../redux/module/basicPnrClass'
import { axiosManualHtmlDeleteRedux } from '../../../../utility/Utils'
import { getCodeName } from '../../../system/auth/data'
import CustomDataTable from '../../../system/basic/company/list/CustomDataTable'
import AddModal from './AddModal'
import TotalLabel from '../../../../components/TotalLabel'

const ClassIndex = () => {
	useAxiosIntercepter()
	const basicPnrClass = useSelector((state) => state.basicPnrClass)
	const dispatch = useDispatch()

	const getClasses = () => {
		axios.get(API_BASICINFO_PARTNER_CLASS, {
			params: {class :  ''}
		})
		.then(res => {
			dispatch(setDataTableList(res.data))
		})
	}

	const reset = () => {
		dispatch(setMainClass(''))
		dispatch(setMidClass(''))
		dispatch(setSubClass(''))
		dispatch(setCode(null))
		dispatch(setPageType('register'))
		dispatch(setMainClassList([]))
		dispatch(setMidClassList([]))
		dispatch(setName(''))
		getClasses()
	}

	const handelDelete = (code) => {
        const html = '하위 분류와 분류된 협력업체 기록이 삭제되며<br/> 복구가 불가능합니다. <br/><br/>정말로 삭제하시겠습니까?<br/>'
		axiosManualHtmlDeleteRedux('협력업체분류', html, `${API_BASICINFO_PARTNER_CLASS}/${code}`, reset, null, null)
	}

	useEffect(() => {
		if (!basicPnrClass.isOpen) {
			reset()
		}
	}, [basicPnrClass.isOpen])

	const columns = [
		{
			name: '대분류',
			cell: row => getCodeName(row, 'depth1')
		},
		{
			name: '중분류',
			cell: row => getCodeName(row, 'depth2')
		},
		{
			name: '소분류',
			cell: row => getCodeName(row, 'depth3')
		},
		{
			name: '',
			cell: row => { 
				return (
					<Fragment key={row.id}>
						<Row>
							<Col>
								<Button size='sm' color='primary' outline onClick={() => dispatch(setCode(row.code))}>수정</Button>
							</Col>
							<Col>
								<Button size='sm' onClick={() => handelDelete(row.code)}>삭제</Button>
							</Col>
						</Row>
					</Fragment> 
				)
			}
		}
	]
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='협력업체분류' breadCrumbParent='기본정보' breadCrumbParent2='협력업체관리' breadCrumbActive='협력업체분류' />
				</div>
			</Row>
			<Row>
				<Col>
					<Card>
						<CardHeader>
							<CardTitle>협력업체분류</CardTitle>
							<Button color='primary'
								onClick={() => dispatch(setIsOpen(true))}>등록</Button>
						</CardHeader>
						<CardBody>
							<TotalLabel 
								num={3}
								data={basicPnrClass.dataTableList.length}
							/>
							<CustomDataTable
								columns={columns}
								tableData={basicPnrClass.dataTableList}
								selectType={false}
								rowCnt={1000}
							/>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<AddModal/>
		</Fragment>
	)
}

export default ClassIndex