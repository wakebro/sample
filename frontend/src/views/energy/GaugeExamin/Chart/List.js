import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import {API_ENERGY_EXAMIN_CHART, API_GAUGE_GROUP_LIST } from "../../../../constants"
import CustomDataTable from "./CustomDataTable"
import { getTableData, makeSelectList } from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import axios from '../../../../utility/AxiosConfig'
import Cookies from 'universal-cookie'
// import * as moment from 'moment'
// import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { monthList, yearList, conditionalRowStyles } from "./Data"
import Select from "react-select"

const ExamineList = (props) => {
		useAxiosIntercepter()
		const cookies = new Cookies()
        const property_id =  cookies.get('property').value
        const {type} = props
		const [data, setData] = useState([])
		const currentDate = new Date()
		const currentYear = currentDate.getFullYear()
		const currentMonth = currentDate.getMonth() + 1
		const [month, setMonth] = useState({ label: `${currentMonth}월`, value: currentMonth })
		const [year, setYear] = useState([{ label: `${currentYear}년`, value: currentYear }])
        const [gauge, setGauge] = useState({label: '전체', value:''})
        const [gaugeList, setGaugeList] = useState([{label: '전체', value:''}])

		let examin_type = ''
	
        let title = ''
        let columnLength = 0
        if (type === 'daily') {
            title = '일일'
            const selectmonth = month.value
            if (selectmonth === 1 || selectmonth === 3 || selectmonth === 5 || selectmonth === 7 || selectmonth === 8 || selectmonth === 10  || selectmonth === 12) {
                columnLength = 31
            } else if (selectmonth === 4 || selectmonth === 6 || selectmonth === 9 || selectmonth === 11) {
                columnLength = 30
            } else if (selectmonth === 2) {
                columnLength = 28
            }
			examin_type = 'd'
        } else if (type === 'monthly') {
            title = '월간'
            columnLength = 12
			examin_type = 'm'
        }

		const getList = (index, type) => {
			if (type === 'daily') {
				return `${index + 1 < 10 ? '0' : ''}${index + 1}`
			} else if (type === 'monthly') {
				return `${index + 1}월`
			}
		}

        const basicColumns = [
            {
                name: '계랑기',
				cell: row => row.gauge_group && row.gauge_group,
                width: '200px',
				conditionalCellStyles: conditionalRowStyles

            },
            {
                name: '계기',
				cell: row => row.gauge && row.gauge,
                //minWidth: '120px',
				conditionalCellStyles: conditionalRowStyles

            },
            // 01부터 31까지의 컬럼 추가
			...Array.from({ length: columnLength }, (_, index) => ({
				name: getList(index, type),
				cell: row => {
					const columnIndex = `${index + 1 < 10 ? '0' : ''}${index + 1}`
					const value = row.examin_data && row.examin_data.find(item => item[columnIndex])
					if (value) {
						if (value[columnIndex] === 'None') {
							return '-'
						} else {
							return value[columnIndex].toLocaleString('ko-KR')
						}
					  }
					  
					  return ''
				},
				conditionalCellStyles: conditionalRowStyles

			}))
        ]

		const handleSelectChange = (selectedOptions) => {
			if (selectedOptions.length <= 4) {
			  setYear(selectedOptions)
			}
		  }

		const getInit = () => {
			if (type === 'daily') {
				getTableData(API_ENERGY_EXAMIN_CHART, {gauge_group:gauge.value, prop_id:property_id, data_type: 'list', examin_type: examin_type, month: month.value, years: year.map(item => item.value)}, setData)

			} else if (type === 'monthly') {
				getTableData(API_ENERGY_EXAMIN_CHART, {gauge_group:gauge.value, prop_id:property_id, data_type: 'list', examin_type: examin_type, years: year.map(item => item.value)}, setData)
			}
		}

		useEffect(() => {
			axios.get(API_GAUGE_GROUP_LIST, { params: {property_id: property_id, employee_class_id:'', searchValue:'' } })
            .then(
                res => {
                    makeSelectList(true, '', res.data, gaugeList, setGaugeList, ['code'], 'id')
            })
			getInit()
		}, [])

		useEffect(() => {
			getInit()
		}, [month, year, gauge])

	return (
		<Fragment>
				<Card>
					<CardHeader>
						<CardTitle>
                            {title}검침리스트
						</CardTitle>
					</CardHeader>
					<CardBody style={{paddingBottom:'3%'}}>
						<Row style={{ display: 'flex'}}>
							<Col md='3' className="mb-1">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
									<Col xs='3' md='3' style={{ alignItems: 'center', paddingRight: 0, marginLeft:'5px'}}>계량기</Col>
										<Select
											name='gauge'
											classNamePrefix={'select'}
											className="react-select custom-select-gauge custom-react-select"
											options={gaugeList}
											value={gauge}
											defaultValue={gaugeList[0]}
											onChange={(e) => setGauge(e)}
										/>
								</div>
							</Col>
							<Col md='7' className="mb-1">
							<div style={{ display: 'flex', alignItems: 'center' }}>
									<Col style={{ paddingLeft: '1%' }}>
										<Select 
											id='year'
											isMulti={true}
											autosize={true}
											className='react-select'
											classNamePrefix='select'
											options={yearList}
											defaultValue={yearList[0]}
											value={year}
											onChange={handleSelectChange}
											placeholder='년도를 선택해주세요.'
										/>
									</Col>
								</div>
							</Col>
							{type === 'daily' &&
							   <Col md='2' className="mb-1">
							   <div style={{ display: 'flex', alignItems: 'center' }}>
									   <Col style={{ paddingLeft: '1%' }}>
										   <Select 
											   id='month'
											   autosize={true}
											   className='react-select'
											   classNamePrefix='select'
											   options={monthList}
											   defaultValue={monthList[0]}
											   value={month}
											   onChange={(e) => setMonth(e)}
										   />
									   </Col>
								   </div>
							   </Col>
							}
                        
						</Row>
						<Row style={{ display: 'flex'}}>
							<Col style={{textAlign:'right', color:'#ACACAC'}}>
								<div>
									입력된 값이 없는 경우 리스트 상 - 표시됩니다.
								</div>
							</Col>
						</Row>
						<Row>
                            <Col>
							<CustomDataTable
								tableData={data}
								columns={basicColumns}
							/>
                            </Col>
						</Row>
					</CardBody>
				</Card>
	</Fragment>
	)
}


export default ExamineList