import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
// import CustomDataTable from '../../../../components/CustomDataTable'
import PhotoDetailTable from "./PhotoTabTable"
import { API_SPACE_DETAIL_BUILDING_PHOTO, ROUTE_BASICINFO_AREA_BUILDING_PHOTO_REGISTER, ROUTE_BASICINFO_AREA_BUILDING_PHOTO_DETAIL } from '../../../../constants'
// import axios from "../../../../utility/AxiosConfig"
import { Link, useParams } from 'react-router-dom'
import Cookies from 'universal-cookie'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import { getTableData } from '../../../../utility/Utils'
import PreviewModal from "./PreviewModal"
import * as moment from 'moment'
const PhotoTab = () => {
	const {type} = useParams()
	useAxiosIntercepter()
	const [data, setData] = useState([])
	const [modal, setModal] = useState(false)
	const [imgPath, setImgPath] = useState('')
	// const [tableSelect, setTableSelect] = useState([])
	const dateFormat = (data) => {
		return moment(data).format('YYYY-MM-DD')
	}
	const getInit = () => {
		const param = {
			building_id :  type
		}
		getTableData(API_SPACE_DETAIL_BUILDING_PHOTO, param, setData)
	}
	const clickModal = (data) => {
		setImgPath(`/static_backend/${data.imgPath}${data.imgName}`)
		setModal(!modal)
	}
	const columns = [
		{
			name: '제목',
			sortable: true,
			sortField: 'name',
			cell: row => {
				if (row.main) {
					return <div><span style={{color : 'orange'}}>기본사진</span> <span>{row.name}</span></div>
				} else {
					return row.name
				}
			}
		},
		{
			name: '등록자',
			sortable: true,
			sortField: 'user',
			selector: row => row.user
		},
		{
			name: '등록일',
			sortable: true,
			sortField: 'create_datetime',
			selector: row => dateFormat(row.create_datetime)
		},
		{
			name: '미리보기',
			cell: row => { return <div><Button key={row.id} onClick={() => clickModal(row)} outline>미리보기</Button></div> }
		}
	]

	useEffect(() => {
		getInit()
	}, [])
	
	return (
		<Fragment>
			<Card>
				<CardHeader>
					<CardTitle>
						사진
					</CardTitle>
					<Button tag={Link} to={`${ROUTE_BASICINFO_AREA_BUILDING_PHOTO_REGISTER}/${type}`}  color='primary'>등록</Button>
				</CardHeader>
				<CardBody>
					<PhotoDetailTable 
						columns={columns} 
						tableData={data} 
						setTabelData={setData}
						type ={type}
						// setTableSelect={setTableSelect}	
						// selectType={true} 
						detailAPI={ROUTE_BASICINFO_AREA_BUILDING_PHOTO_DETAIL}
					/>
				</CardBody>
			</Card>
			<PreviewModal modal={modal} setModal={setModal} imgPath={imgPath}/>
		</Fragment>
	)
}

export default PhotoTab