import { Fragment, useState, useEffect } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_GAUGE_GROUP_LIST, API_ENERGY_EXAMIN_CHART } from "../../../../constants"
import { makeSelectList, getTableData } from "../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { monthList, yearList } from "./Data"
import axios from '../../../../utility/AxiosConfig'
import Cookies from 'universal-cookie'
import Select from "react-select"
import {
	Chart as ChartJS,
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController,
	Interaction
  } from 'chart.js'
import { Line } from 'react-chartjs-2'

  ChartJS.register(
		LinearScale,
		CategoryScale,
		BarElement,
		PointElement,
		LineElement,
		Legend,
		Tooltip,
		LineController,
		BarController
	)

const ExamineChart = (props) => {
		useAxiosIntercepter()
        const {type} = props
		const cookies = new Cookies()
        const property_id =  cookies.get('property').value
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
		const labelData = [] 
        if (type === 'daily') {
            title = '일일'
			examin_type = 'd'
			const selectmonth = month.value
            if (selectmonth === 1 || selectmonth === 3 || selectmonth === 5 || selectmonth === 7 || selectmonth === 8 || selectmonth === 10  || selectmonth === 12) {
                columnLength = 31
            } else if (selectmonth === 4 || selectmonth === 6 || selectmonth === 9 || selectmonth === 11) {
                columnLength = 30
            } else if (selectmonth === 2) {
                columnLength = 28
            }
			for (let i = 1; i <= columnLength; i++) {
				labelData.push(`${i}일`)
			}
        } else if (type === 'monthly') {
            title = '월간'
			examin_type = 'm'
			columnLength = 12
			for (let i = 1; i <= columnLength; i++) {
				labelData.push(`${i}월`)
		  	}
        }

		const handleSelectChange = (selectedOptions) => {
			if (selectedOptions.length <= 4) {
			  setYear(selectedOptions)
			}
		}

		const options = {
			maintainAspectRatio:false,
			plugins: {
				title: {
					display: false
				  },
				legend: {
					display:true,
					position: 'bottom',
					labels: {
						boxWidth: 8,
						marginBottom: 25,
						usePointStyle: true
				  	}
				},
				tooltip:{
					callbacks:{
						label: (context) => {
							console.log('context', context)
							const label = context.dataset.label
							return `${label} : ${context.formattedValue} ${context.dataset.unit}`
						}
					}
				}
			},
			responsive: true,
			interaction: {
				mode: 'index',
				intersect: false
			}
		}

		const defalutDataset = {
			labels: labelData,
			datasets: data
		}
		const getInit = () => {
			if (type === 'daily') {
				getTableData(API_ENERGY_EXAMIN_CHART, {gauge_group:gauge.value, prop_id:property_id, data_type: 'chart', examin_type: examin_type, month: month.value, years: year.map(item => item.value)}, setData)

			} else if (type === 'monthly') {
				getTableData(API_ENERGY_EXAMIN_CHART, {gauge_group:gauge.value, prop_id:property_id, data_type: 'chart', examin_type: examin_type, years: year.map(item => item.value)}, setData)
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
                            {title}검침차트
						</CardTitle>
					</CardHeader>
					<CardBody style={{ paddingTop: 0}}>
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
						<Row>
							<div  style={{height:'290px'}}>
								<Line
									options={options} data={defalutDataset}  
								/>
							</div>
						</Row>
					</CardBody>
				</Card>
	</Fragment>
	)
}


export default ExamineChart