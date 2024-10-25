import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect, useState } from "react"
import { FileText } from "react-feather"
import {
	Button, Card, CardBody,
	CardHeader,
	CardTitle, Col,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Row
} from 'reactstrap'
import CustomDataTable from '../../../../components/CustomDataTable'
import ModalTable from '../../../../components/ModalTable'
import { API_EXPORT_BUILDING, API_SPACE_BUILDING, ROUTE_BASICINFO_AREA_BUILDING_BUILDINGINDEX, ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD } from '../../../../constants'
import { useAxiosIntercepter } from '@utility/hooks/useAxiosInterceptor'
import { getTableData } from '@utils'
import axios from 'axios'
import Cookies from 'universal-cookie'
import CustomHelpCircle from '../../../apps/CustomHelpCircle'
import TotalLabel from '../../../../components/TotalLabel'
// import { Link } from 'react-router-dom'

const BuildingInfoIndex = () => {
	useAxiosIntercepter()
	const [data, setData] = useState([])
	const [modal, setModal] = useState(false)
	const [tableSelect, setTableSelect] = useState([])
	
	const cookies = new Cookies()
	const getInit = () => {
		const param = {
			property :  cookies.get('property').value
		}
		getTableData(API_SPACE_BUILDING, param, setData)
	}

	const exportXlsx = () => {
		const temp = []
		tableSelect.map((item) => {
			temp.push(item.id)
		})
		if (temp.length !== 0) {
			axios.get(API_EXPORT_BUILDING, {
				params: {
					prop_id :  cookies.get('property').value,
					building_id : temp
				}
			})
			.then((res) => {
				setModal(!modal)
				axios({
					url: res.data.url,
					method: 'GET',
					responseType: 'blob'
				}).then((response) => {
					const url = window.URL.createObjectURL(new Blob([response.data]))
					const link = document.createElement('a')
					link.href = url
					link.setAttribute('download', `${res.data.name}`)
					document.body.appendChild(link)
					link.click()
				}).catch((res) => {
					console.log(res)
				})
			})
			.catch(res => {
				console.log(res)
			})
		}
	}
	const columns = [
		{
			name: '건물',
			sortable: true,
			sortField: 'name',
			selector: row => row.name
		},
		{
			name: '연면적',
			sortable: true,
			sortField: 'area_total',
			selector: row => row.area_total
		},
		{
			name: '지상/지하',
			sortable: true,
			sortField: 'count_flbf',
			cell: row => { return <div >지상 {row.count_fl}층 /지하 {row.count_bf}층</div> }
		},
		{
			name: '주소',
			sortable: true,
			sortField: 'address',
			selector: row => row.address
		}
	]
	const exportColumn = [
		{
			name: '건물',
			sortable: false,
			sortField: 'name',
			selector: row => row.name
		}
	]

	useEffect(() => {
		getInit()
	}, [])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='건물정보' breadCrumbParent='기본정보' breadCrumbParent2='공간정보관리' breadCrumbActive='건물정보' />
					<Button.Ripple className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={() => setModal(!modal)}>
						<FileText size={14}/>
						문서변환
					</Button.Ripple>
				</div>
			</Row>
			<Row>
				<Col >
					<Card>
						<CardHeader>
							<CardTitle>
								건물정보
								<CustomHelpCircle
									id={'buildingHelp'}
									content={'건물은 시스템관리에서 등록 가능합니다.'}
								/>
							</CardTitle>
							{/* 아직은 지우지 말아주세요 bill */}
							{/* <Button color='primary' tag={Link} 
								to={ROUTE_SYSTEMMGMT_BASIC_SPACE_ADD}
								state={{pageType:'register', key: 'building'}}
							>등록</Button> */}
							{/* 사용하지 않음 */}
							{/* <Button hidden={checkOnlyView(loginAuth, BASIC_INFO_AREA_BUILDING, 'available_create')} tag={Link} to={ROUTE_BASICINFO_AREA_BUILDING_REGISTER} state={{prop_id : cookies.get('property').value}} color='primary'>등록</Button> */}
						</CardHeader>
						<CardBody>
							<TotalLabel 
								num={3}
								data={data.length}
							/>
							<CustomDataTable 
								columns={columns} 
								tableData={data} 
								setTabelData={setData} 
								// setTableSelect={setTableSelect}	
								// selectType={true} 
								// detailAPI={ROUTE_BASICINFO_AREA_BUILDING_DETAIL}
								detailAPI={ROUTE_BASICINFO_AREA_BUILDING_BUILDINGINDEX}
							/>
						</CardBody>
						
					</Card>
					
				</Col>
			</Row>
			<Modal isOpen={modal} toggle={() => setModal(!modal)} className='modal-dialog-centered'>
				<ModalHeader  toggle={() => setModal(!modal)}><span style={{fontSize: '20px'}}>문서변환</span></ModalHeader>
				<ModalBody>
					<ModalTable 
						columns={exportColumn} 
						tableData={data} 
						setTabelData={setData} 
						setTableSelect={setTableSelect}	
						selectType={true}
						pagination = {false}
					/>
				</ModalBody>
				<ModalFooter>
					<Button onClick={() => exportXlsx()} color='primary' >
						확인
					</Button>
				</ModalFooter>
			</Modal>	
		</Fragment>
	)
}

export default BuildingInfoIndex
