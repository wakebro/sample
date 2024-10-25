/* eslint-disable */
import axios from '@utility/AxiosConfig'
import { useAxiosIntercepter } from "@utility/hooks/useAxiosInterceptor"
import { sweetAlert } from '@utils'

import { Fragment, useEffect, useState } from 'react'
import { Calendar, Menu, Search, Star, Trash2 } from 'react-feather'
import { Col, Input, InputGroup, InputGroupText } from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import * as moment from 'moment'
import { API_DOC_MAILBOX } from "../../../constants"
import CustomDataTable from './CustomDataTable'
import { primaryColor, pickerDateNullChange } from '../../../utility/Utils'

import Flatpickr from 'react-flatpickr'
import { Korean } from "flatpickr/dist/l10n/ko.js"
import '@styles/react/libs/flatpickr/flatpickr.scss'

const Mails = ({datas, selectedTab, StarClick, setData, setCurrentPage, currentPage, handleToggleSidebar, userid, total_Count, detailAPI, TabChange, picker, setPicker}) => { 
	useAxiosIntercepter()
	const inboxColumns = [
		{
			name: '',
			style: { cursor: 'pointer' },
			width:'60px',
			cell: (row) => (
			<Star
				size={18}
				color= {row.star === true ? 'yellow' : 'gray'}
				onClick={() => StarClick(row)}/>)
		},
		{
			name: '보낸이',
			style: { cursor: 'pointer' },
			width:'100px',
			selector: (row) => row.sender
		},
		{
			name: '제목',
			style: { cursor: 'pointer' },
			selector: (row) => row.title
		},
		{
			name: '',
			style: { cursor: 'pointer' },
			selector: (row) => moment(row.date).format('YYYY-MM-DD HH:mm'),
			right:true
		}
	]
	const sentcolumns = [
		{
			name: '받는이',
			style: { cursor: 'pointer'},
			width:'150px',
			selector: row => {
				if (row.receiver) {
					if (row.receiver.length > 2) {
						const displayedReceivers = row.receiver.slice(0, 2).join(',')
						const remainingCount = row.receiver.length - 2
						return `${displayedReceivers} 외 ${remainingCount}명`
					}
					return row.receiver.join(', ')
				}
			}
		},
		{
			name: '제목',
			style: { cursor: 'pointer' },
			selector: row => row.title
		},
		{
			name: '',
			style: { cursor: 'pointer' },
			selector: (row) => moment(row.date).format('YYYY-MM-DD HH:mm'),
			right:true
		}
	]
	const trashColumns = [
		{
			name: '보낸이',
			width:'150px',
			style: { cursor: 'pointer' },
			selector: row => {
				if (row.name) {
					if (row.name.length > 2) {
						const displayedReceivers = row.name.slice(0, 2).join(',')
						const remainingCount = row.name.length - 2
						return `${displayedReceivers} 외 ${remainingCount}명`
					}
					return row.name.join(', ')
				}
			}
		},
		{
			name: '제목',
			style: { cursor: 'pointer' },
			selector: (row) => row.title
		},
		{
			name: '',
			style: { cursor: 'pointer' },
			selector: (row) => moment(row.date).format('YYYY-MM-DD HH:mm'),
			right:true
		}
	]
	const [showtrash, setShowtrash] = useState(false)
	const [tableSelect, setTableSelect] = useState([])
	const currentpage = currentPage + 1
	const [columns, setColumns] = useState(inboxColumns)
	const [search, setSearch] = useState('')

	const handleDeleteMail = () => {
		const mailIds = tableSelect.map(item => item.id)
		const MySwal = withReactContent(Swal)
		MySwal.fire({
			icon: "warning",
			html: "삭제시 복구가 불가능합니다. <br/>정말로 삭제하시겠습니까?",
			showCancelButton: true,
			showConfirmButton: true,
			cancelButtonText: "취소",
			confirmButtonText: '확인',
			confirmButtonColor : primaryColor,
			reverseButtons :true,
			customClass: {
				actions: 'sweet-alert-custom right',
				cancelButton: 'me-1'
			}
		}).then((res) => {
			if (res.isConfirmed) {
				axios.delete(API_DOC_MAILBOX, { data: { mail_ids: mailIds, userid: userid, selectedTab: selectedTab }})
				.then((res) => {
					if (res.status === 200) {
						const MySwal = withReactContent(Swal)
						MySwal.fire({
							title: `문서 삭제 완료`,
							html: `문서 삭제가 완료되었습니다.`,
							icon: 'success',
							customClass: {
								confirmButton: 'btn btn-primary',
								actions: `sweet-alert-custom center`
							}
						}).then(res => {
							if (res.isConfirmed === true) TabChange()
						})
					} else sweetAlert(`${page} 삭제 실패`, `${page} 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				}).catch(error => {
					console.error(error)
					sweetAlert(`문서 삭제 실패`, `문서 삭제가 실패했습니다.<br/>다시한번 확인 해주세요`, 'warning')
				})
			} else {
				MySwal.fire({
					icon: "info",
					html: "취소하였습니다.",
					showCancelButton: true,
					showConfirmButton: false,
					cancelButtonText: "확인",
					cancelButtonColor : primaryColor,
					reverseButtons :true,
					customClass: {
					actions: 'sweet-alert-custom right'
					}
				})
			}
		})
	}

	const handleSearch = () => {
		const params = {
			search:  search,
			selectedTab : selectedTab,
			page: currentpage,
			userid: userid,
			picker: pickerDateNullChange(picker)
		}
		axios.get(API_DOC_MAILBOX, { params })
		.then(response => {
			setData(response.data.tableData)
		}).catch(error => {
			console.error(error)
		})
	}

	useEffect(() => {
		setPicker([])
		setSearch('')
		if (selectedTab === 'inbox' && columns !== inboxColumns) setColumns(inboxColumns)
		if (selectedTab === 'sent' && columns !== sentcolumns) setColumns(sentcolumns)
		if (selectedTab === 'star' && columns !== inboxColumns) setColumns(inboxColumns)
		if (selectedTab === 'trash' && columns !== trashColumns) setColumns(trashColumns)
	}, [selectedTab])

	useEffect(() => {
		if (tableSelect.length > 0 && selectedTab !== 'star') setShowtrash(true)
		else setShowtrash(false)
	}, [tableSelect])

	useEffect(() => {
		handleSearch()
	}, [search, picker])

	return (
		<Fragment>
			<div className='email-app-list'>
				<div className='app-fixed-search d-flex align-items-center'>
					<div className='sidebar-toggle d-block d-lg-none ms-1' onClick={handleToggleSidebar}>
						<Menu size='21' />
					</div>
					<div className='d-flex align-content-center justify-content-between w-100' style={{ height: '50px' }}>
						<Col md={3}className='d-flex align-content-center'>
							<InputGroup>
								<InputGroupText>
									<Calendar color='#B9B9C3'/>
								</InputGroupText>
								<Flatpickr
									value={picker.length > 0 ? picker : ''}
									id='range-picker'
									className='form-control'
									placeholder='기간을 선택해주세요.'
									onChange={date => { if (date.length === 2) setPicker(date) } }
									options={{
									mode: 'range',
									ariaDateFormat:'Y-m-d',
									locale: {
										rangeSeparator: ' ~ '
									},
									locale: Korean
									}}
								/>
							</InputGroup>
						</Col>
						<InputGroup className='input-group-merge' >
							<InputGroupText style={{borderRadius:'0px'}}>
								<Search className='text-muted' size={14} />
							</InputGroupText>
							<div className="d-flex align-items-center">
								<Trash2
									style={{ display: showtrash === true ? 'block' : 'none', cursor:'pointer', marginLeft: '15px'}}
									size={18}
									color="gray"
									onClick={handleDeleteMail}/>
							</div>
							<Input
								id='email-search'
								placeholder='제목과 성함으로 검색 해주세요.'
								style={{borderRadius:'0px', display: showtrash === true ? 'none' : 'block'}}
								maxLength={250}
								value={search}
								onChange={event => setSearch(event.target.value)}/>
						</InputGroup>
					</div>
				</div>
						
				<div className='app-action' style={{borderBottom:'none'}}>
					<CustomDataTable
						columns={columns} 
						tableData={datas} 
						setTabelData={setData} 
						setTableSelect={setTableSelect}
						selectType={true}
						handleDeleteMail ={handleDeleteMail}
						selectedTab = {selectedTab}
						setCurrentPage={setCurrentPage}
						currentPage = {currentPage}
						total_Count={total_Count}
						detailAPI={detailAPI}/>
				</div>
		</div>
		</Fragment>
	)
}
export default Mails