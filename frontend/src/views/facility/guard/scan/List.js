import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { setId, setPageType, setSubmitResult } from '@store/module/nfcWorker'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import axios from '@utility/AxiosConfig'
import { pickerDateChange, primaryColor } from '@utils/'

import * as moment from 'moment'
import { Fragment, useEffect, useState } from "react"
import { ArrowRight, Calendar } from "react-feather"
import Flatpickr from 'react-flatpickr'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, Col, InputGroup, InputGroupText, Row } from "reactstrap"
import Cookies from 'universal-cookie'
import { API_FACILITY_GUARD_SCAN, ROUTE_FACILITYMGMT_GUARD } from '../../../../constants'
import { NFC_COMPLETE, NFC_NOMAL, NFC_REFUSE, NFC_REQUEST, statusBadge } from '../data'
import { Korean } from "flatpickr/dist/l10n/ko.js"

const SacnList = () => {
	useAxiosIntercepter()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const cookies = new Cookies()
	const now = moment()
	const yesterday = moment().subtract(7, 'days')
	const [picker, setPicker] = useState(pickerDateChange([`${yesterday.format('YYYY-MM-DD')}`, now.format('YYYY-MM-DD')]))
	const [dataList, setDataList] = useState([])

	function reset() {
		dispatch(setId(null))
		dispatch(setPageType(''))
		dispatch(setSubmitResult(false))
	}

	function getDatas() {
		const params = {
			user: cookies.get('userId'),
			property: cookies.get('property').value,
			range: picker
		}
		axios.get(API_FACILITY_GUARD_SCAN, {params: params})
		.then(res => setDataList(res.data))
	}

	function handleRowClick (row) {
		const stateObj = {pageType:'detail'}
		navigate(`${ROUTE_FACILITYMGMT_GUARD}/scan-list/${row}`, {state:stateObj})
	}

	const WorkingTime = (status, tagTime, modifyTime) => {
		switch (status) {
			case NFC_NOMAL:
				return <div>{tagTime.substr(11)}</div>
			case NFC_REQUEST:
				return (
					<Col style={{display:'flex', flexDirection:'column'}}>
						<div xs={12} style={{textDecoration:'line-through'}}>{tagTime}</div>
						<div>
							<ArrowRight size={19}/>&nbsp;{modifyTime}
						</div>
					</Col>
				)
			case NFC_COMPLETE:
				return <div>{modifyTime.substr(11)}</div>
			case NFC_REFUSE:
				return <div>{tagTime.substr(11)}</div>
		}
	}

	const CheckLine = (props) => {
		const { id, day, weekday, location, tagTime, modifyTime, status } = props
		return (
			<>
				<CardBody style={{cursor:'pointer'}} onClick={() => handleRowClick(id)}>
					<Row>
						<Col xs={3}>
							<Row style={{color:'#B8B8B8', fontSize:'15px'}}>
								<Col xs={12}>{day}</Col>
								<Col xs={12}>{weekday}</Col>
							</Row>
						</Col>
						<Col xs={9}>
							<Row>
								<Col xs={12} style={{color:'#6E6B7B', fontSize:'16px', fontWeight:500}}>
									<Row><Col xs={12} style={{display:'flex', alignItems:'center'}}>
										{statusBadge[status]}
										&nbsp;&nbsp;
										<div>{location}</div>
									</Col></Row>
								</Col>
								<Col xs={12} style={{color:'#5E5873', fontSize:'15px', fontWeight:600}}>
									<Row><Col xs={12} style={{display:'flex'}}>
										{WorkingTime(status, tagTime, modifyTime)}
									</Col></Row>
								</Col>
							</Row>
						</Col>
					</Row>
				</CardBody>
				<hr style={{margin:0}}/>
			</>
		)
	}
	const CheckCardComponent = (props) => {
		const {date, lineList} = props
		return (
			<>
				<div style={{color:'#5E5873', fontFamily:'Montserrat', fontSize:'16px', fontWeight:'bold', margin:'1em 0'}}>{date}</div>
				<Card>
					{
						lineList.map((line, idx) => {
							return (
								<CheckLine
									key={idx}
									id={line.id}
									day={line.day}
									weekday={line.weekday}
									location={line.location}
									tagTime={line.tag_time}
									modifyTime={line.modify_time}
									status={line.status}
								/>
							)
						})
					}
				</Card>
			</>
		)
	}

	useEffect(() => {
		reset()
		getDatas()
	}, [picker])
	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<InputGroup>
						<InputGroupText style={{backgroundColor:primaryColor}}>
							<Calendar fill={primaryColor} style={{color:'white'}}/>
						</InputGroupText>
						<Flatpickr
							style={{backgroundColor:'#FFFFFF'}}
							value={picker}
							id='range-picker'
							className='form-control'
							onChange={date => { 
								if (date.length === 2) {
									const tempPickerList = pickerDateChange(date)
									setPicker(tempPickerList)
								}
							}}
							options={{
								mode: 'range',
								ariaDateFormat:'Y-m-d',
								locale: {
									rangeSeparator: ' to '
								},
								locale: Korean
							}}/>
					</InputGroup>
				</div>
			</Row>
			{
				dataList.length !== 0 && 
				dataList.map((data, idx) => {
					return (
						<CheckCardComponent key={idx}
							date={Object.keys(data)}
							lineList={Object.values(data)[0]}/>
					)
				})
			}
		</Fragment>
	)
}

export default SacnList