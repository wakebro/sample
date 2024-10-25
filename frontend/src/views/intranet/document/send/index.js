import Breadcrumbs from '@components/breadcrumbs'
import { isEmptyObject } from 'jquery'
import { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
	Button,
	Card, CardBody, CardTitle,
	Col,
	Form, Input,
	InputGroup,
	Label, Row
} from "reactstrap"
import Cookies from "universal-cookie"
import { API_DOC_RECEIVER, API_DOC_SEND, ROUTE_INTRANET_DOCUMENT } from "../../../../constants"
import axios from '../../../../utility/AxiosConfig'
import { axiosSweetAlert, getTableData, handleFileInputLimitedChange, sweetAlert } from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import AddModal from './AddModal'
import ListModal from "./ListModal"
import OriginTable from "./OriginTable"
import SendDataTable from "./SendDataTable"
import { columns } from '../../data'
import FileIconImages from '../../../apps/customFiles/FileIconImages'

const Send = () => {
	useAxiosIntercepter()
	const cookies = new Cookies()
	const userid = cookies.get('userId')
	const [files, setFiles] = useState([])
	const [selectedFiles, setSelectedFiles] = useState([])
	const [isOpen, setIsOpen] = useState(false)
	const [isOpenList, setIsOpenList] = useState(false)
	const [show, setShow] = useState(false)
	const navigate = useNavigate()
	const [submitResult, setSubmitResult] = useState(false)
	
	// filterDataList
	const [searchValue, setSearchValue] = useState()
	const [data, setData] = useState([])
	const [selectedRowWholeList, setSelectedRowWholeList] = useState(new Set()) // no filter 선택한 사용자
	const [keySelectedList, setKeySelectedList] = useState({}) // 필터 적용한 사용자
	const [groupReceivers, setGroupReceivers] = useState([])

	const openModal = () => setIsOpen(true)

	const openModalList = () => setIsOpenList(true)

	const getInit = () => {
		const param = {
			propertyId : ''
		}
		getTableData(API_DOC_RECEIVER, param, setData)
	}

	const handleSearch = (event) => {
		// new Search Value 추출
		const value = event.target.value || ''
		let filterDataTable = []
		const tempSelectedRows = new Set()

		// new Search Value에 해당하는 FilterDataTable 추출
		filterDataTable = data.filter(user => {
			const includes = 
			user.name.toLowerCase().includes(value.toLowerCase())
			return includes
		})

		filterDataTable.map(data => {
			if (selectedRowWholeList.has(data.id)) tempSelectedRows.add(data.id)
		})

		setKeySelectedList({
			...keySelectedList,
			[value]: {
				dataTable: filterDataTable,
				selectedRow: tempSelectedRows
			}
		})
		setSearchValue(value)
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		const formData = new FormData()
		formData.append('userid', userid)
		formData.append('property_id', cookies.get('property').value)
		formData.append('title', event.target.title && event.target.title.value)
		formData.append('doc_content', event.target.doc_content && event.target.doc_content.value)
		for (let i = 0; i < files.length; i++) {
			formData.append('doc_files', files[i])
		}
		formData.append('selectedRows', JSON.stringify([...selectedRowWholeList]))

		if (selectedRowWholeList.size === 0) {
			sweetAlert('', "보낼 대상을 선택해주세요.", 'warning')
		} else {
			axios.post(API_DOC_SEND, formData, {
				headers : {
					"Content-Type": "multipart/form-data"
				}
			}).then(() => {
				axiosSweetAlert('문서 발송 성공', '문서가 성공적으로 발송되었습니다.', 'success', 'center', setSubmitResult)
			}).catch(error => {
				// 응답 실패 시 처리
				console.error(error) 
			})
		}
	}

	const handleCancel = () => navigate(ROUTE_INTRANET_DOCUMENT)
	
	const handleFileInputChange = (e) => {
		handleFileInputLimitedChange(e, files, setFiles, 6, undefined, undefined, setSelectedFiles)
	}
	
	const onRemoveFile = (file) => {
		const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
		setSelectedFiles(updatedFiles)
		setFiles(updatedFiles)
	}

	useEffect(() => {
		setSearchValue('')
	}, [])

	useEffect(() => {
		if (groupReceivers.length > 0) {
			const copyKeySelectedList = [...keySelectedList[searchValue]['selectedRow']]
			const temp = new Set(groupReceivers.map(row => row.id))
			
			const unionId = new Set([...copyKeySelectedList, ...temp])
			setKeySelectedList({
				...keySelectedList,
				[searchValue]: {
					...keySelectedList[searchValue],
					selectedRow: unionId
				}
			})
			setShow(true)
		}
	}, [groupReceivers])

	useEffect(() => {
		if (data.length !== 0) {
			const data = {target : {value : searchValue}}
			handleSearch(data)
		}
	}, [data])

	useEffect(() => {
		if (!isEmptyObject(keySelectedList)) {
			const tempWholeList = new Set()
			const tempDeleteList = new Set()
			Object.keys(keySelectedList).map(key => {
				keySelectedList[key]['selectedRow'].forEach(id => tempWholeList.add(id))
				if (key !== '') {
					keySelectedList[key]['dataTable'].map(data => {
						if (!keySelectedList[key]['selectedRow'].has(data.id)) tempDeleteList.add(data.id)
					})
				}
			})
			// wholeList에는 있고 localList에는 없는 값 찾기
			const unionId = new Set([...tempWholeList].filter(data => !tempDeleteList.has(data)))
			setSelectedRowWholeList(unionId)
		}
	}, [keySelectedList])

	useEffect(() => {
		if (isOpenList) setShow(false)
	}, [isOpenList])

	useEffect(() => {
		if (submitResult) navigate(ROUTE_INTRANET_DOCUMENT)
	}, [submitResult])

	useEffect(() => getInit(), [])

	useEffect(() => {
		const inputElement = document.getElementById("doc_file")
		inputElement.value = ""
		
		const dataTransfer = new DataTransfer()
		for (let i = 0; i < files.length; i++) {
			dataTransfer.items.add(files[i])
		}
		inputElement.files = dataTransfer.files
	}, [files])
	
	return (
		<Fragment>
			<Breadcrumbs breadCrumbTitle='문서함' breadCrumbParent='인트라넷' breadCrumbActive='문서함' />
			<Card>
				<CardBody>
				<CardTitle className="mb-0" >
					문서 작성
				</CardTitle>
					<Form className="mail_form mt-2" onSubmit={handleSubmit} encType="multipart/form-data">
						<Row>
							<Col md={5} xs={12}>
								<div className="mb-2">
									<Label className="form-label mb-1" for="title">제목</Label>
									<Input id="title" name="title" maxLength={254} />
								</div>
								<div className="mb-1">
									<Label className="form-label" for="doc_file">첨부파일</Label>
									<Input type="file" id="doc_file" name="doc_file"  multiple onChange={handleFileInputChange}  />
								</div>
								<div className='form-control hidden-scrollbar mt-1 mb-2' style={{ height: '46.2px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflowY:'hidden' }}>
									{selectedFiles.length > 0 &&
										selectedFiles.map((file, idx) => {
											const ext = file.name.split('.').pop()
											return (
											  <span key={`file_${idx}`} className="mx-0 px-0">
												<FileIconImages
												  ext={ext}
												  file={file}
												  filename={file.name}
												  removeFunc={onRemoveFile}
												/>
											  </span>
											)
										})
									}
								</div>
							</Col>
							
							<Col md={7} xs={12} >
								<Row>
									<Col xs={12} lg={2} className="d-flex align-items-center ">
										<Label className="form-label" for="title" style={{whiteSpace:'nowrap'}}>받는 사람</Label>
									</Col>
									<Col xs={12} lg={5} className="d-flex align-items-center ">
										<Button size="sm" color="white" style={{borderColor: 'gray', whiteSpace:'nowrap', marginRight:'10%'}} onClick={openModal}>수신자 그룹 추가</Button>
										<Button size="sm" color="white" style={{borderColor: 'gray', whiteSpace:'nowrap'}} onClick={openModalList} >그룹 선택</Button>
									</Col>
									<Col xs={12} lg={5}>
										<InputGroup>
											<Input onChange={handleSearch} placeholder= {'이름을 검색해 보세요.'}/>
										</InputGroup>
									</Col>
								</Row>
								{ !isEmptyObject(keySelectedList) ? 
									show ? (
										<SendDataTable
											columns={columns.receiver}
											tableData={searchValue.length ? keySelectedList[searchValue]['dataTable'] : data}
											selectType={true}
											keySelectedList={keySelectedList}
											searchValue={searchValue}
											setKeySelectedList={setKeySelectedList}
										/>
										) : (
										<OriginTable
											columns={columns.receiver}
											tableData={searchValue.length ? keySelectedList[searchValue]['dataTable'] : data}
											selectType={true}
											keySelectedList={keySelectedList}
											searchValue={searchValue}
											setKeySelectedList={setKeySelectedList}
										/>
									)
									: <></>
								}
							</Col>
						</Row>
						
						<div className="mt-2 mb-2" style={{ width: '100%' }}>
							<Label className="form-label" for="doc_files">내용</Label>
							<Input
								type="textarea"
								id="doc_content"
								name="doc_content"
								style={{ minHeight: '14em', width: '100%' }}
								autoFocus/>
						</div>
						<div className="d-flex justify-content-end">
							<Button style={{ marginRight: '5px'}} color='report' onClick={handleCancel}>취소</Button>
							<Button type="submit" color="primary">보내기</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
			<AddModal
				formModal= {isOpen}
				setFormModal= {setIsOpen}/>
			<ListModal
				formModal= {isOpenList}
				setFormModal= {setIsOpenList}
				setGroupReceivers = {setGroupReceivers}/>
		</Fragment>
	)
}
export default Send