import axios from 'axios'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { useLocation } from "react-router-dom"
import { Fragment, useState, useRef, useEffect } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Row } from 'reactstrap'
import { API_INSPECTION_PERFORMANCE_EXPORT, API_INSPECTION_PERFORMANCE_REPORT } from '../../../constants'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import PerformanceFilter from './PerformanceFilter'
import { debounce } from 'lodash'
import 'handsontable/dist/handsontable.full.min.css'
import { registerAllModules } from 'handsontable/registry'
import { HotTable } from '@handsontable/react'
import { registerLanguageDictionary, koKR } from 'handsontable/i18n'
import '@styles/react/libs/tables/HandsonTable.scss'

import { columnHeader, columnWidths } from '../data'
import { getTableData } from '../../../utility/Utils'
import { FileText } from 'react-feather'
import TotalLabel from '../../../components/TotalLabel'
registerLanguageDictionary(koKR)
registerAllModules()
const TABLET_WINDOW_WIDTH = 425

const yearList = []
const currentYear = new Date().getFullYear()
const startYear = 1970
for (let year = currentYear; year >= startYear; year--) {
    yearList.push({ label: `${year}년`, value: `${year}` })
}

const Performance = () => {
	const cookies = new Cookies()
	const hotRef = useRef(null)
	const state = useLocation()
	const [searchValue, setSearchValue] = useState('')
	const [classList, setClassList] = useState([{label: '전체', value:''}])
	const [classSelect, setClassSelect] = useState({label: '전체', value:''})
    /* eslint-disable */
	const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })
    /* eslint-disable */
	const [sizeState, setSizeState] = useState(320)
    const handleResizeWindow = debounce(() => {
		if (window.innerWidth <= 425) {
			setSizeState(100)
		} else {
			setSizeState(320)
		}
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }, 200)

	const [data, setData] = useState([])
	const [year, setYear] = useState(yearList[0])
	const getInit = () => {
		const param = {
			prop_id :  cookies.get('property').value,
			search_value : searchValue,
			class_select : classSelect.value,
			type : state.type !== undefined  ? 'disaaster' :  'inspection',
			year : year.value
		}
		getTableData(API_INSPECTION_PERFORMANCE_REPORT, param, setData)
	}
	/* eslint-disable */
	const customTotalRenderer = function(instance, td, row, col, prop, value, cellProperties) {
		if (data.length !== 0) {
			if (row >= data.length - 4) {
				if (col === 1) {
					td.className = 'handson-custom back-color start'
				} else if (col === 0) {
					td.className = 'handson-custom back-color'
				} else {
					td.className = 'handson-custom back-color end'
				}
				if (col === 14) {
					td.innerHTML = `총 ${value.toLocaleString('ko-KR')}건`
					if (row === data.length - 2) {
						td.innerHTML = `총 (${value.toLocaleString('ko-KR')})건`
					} else if (row === data.length - 1) {
						td.innerHTML = `${value}%`
					}
				} else if (col === 0 || col === 1) {
					td.innerHTML = value
				} else {
					td.innerHTML = `${value}건`
					if (row === data.length - 2) {
						td.innerHTML = `(${value})건`
					} else if (row === data.length - 1) {
						td.innerHTML = `${value}%`
					}
				}
			} else {
				if (col === 1) {
					td.className = 'handson-custom start'
				} else if (col === 14 || col === 15) {
					td.className = 'handson-custom end'
				} else {
					td.className = 'handson-custom'
				}

				if (col === 15) {
					td.innerHTML = `${value}%`
				} else {
					td.innerHTML = value
				}
			}
		}
	}

	const handleExport = () => {
        axios.get(API_INSPECTION_PERFORMANCE_EXPORT, 
			{params: {
				property_id: cookies.get('property').value, 
				search_value: searchValue, 
				class_select : classSelect.value, 
				year: year.value, 			
				type : state.type !== undefined  ? 'disaaster' :  'inspection'
		}})
        .then((res) => {
			console.log(res)
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
	
	const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="hand-no-data">데이터가 없습니다.</div>
	)

	useEffect(() => {
		if (window.innerWidth <= TABLET_WINDOW_WIDTH) {
			setSizeState(100)
		} else {
			setSizeState(320)
		}
        window.addEventListener('resize', handleResizeWindow)
        return () => {
            window.removeEventListener('resize', handleResizeWindow)
        }
    }, [])

	// 랜더링시 데이터 출력
	useEffect(() => {
		getInit()
	}, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='점검실적조회' breadCrumbParent='점검관리' breadCrumbParent2='자체점검' breadCrumbActive='점검실적조회' />
					<Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
						<FileText size={14}/>
						문서변환
					</Button.Ripple>
				</div>
			</Row>
			<Row >
				<Card >
					<CardHeader>
						<CardTitle>
							점검실적조회
						</CardTitle>
					</CardHeader>
					<CardBody className='mb-1'>
							<PerformanceFilter 
								searchValue={searchValue} 
								setSearchValue={setSearchValue} 
								year={year} 
								setYear={setYear} 
								classSelect={classSelect}
								setClassSelect={setClassSelect} 
								classList ={classList}
								setClassList ={setClassList}
								handleSearch={getInit}
								yearList={yearList}
							/>
							<TotalLabel 
								num={3}
								data={data.length - 4}
							/>
							<HotTable
								id='hot-table'
								className="react-dataTable-Handson zindex"
								ref={hotRef}
								readOnly = {true}
								columnSorting ={true}
								language={koKR.languageCode}
								colHeaders={columnHeader}
								data={data}
								columns={[		
									{
										data: 'class',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'name',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Jan',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Feb',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Mar',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Apr',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'May',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Jun',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Jul',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Aug',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Sep',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Oct',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Nov',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'Dec',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'total',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: false, // disable indicator for the first column,
											headerAction: false
										}
									},
									{
										data: 'per',
										renderer: customTotalRenderer,
										columnSorting: {
											indicator: true, // disable indicator for the first column,
											sortEmptyCells: true,
											headerAction: true, // clicks on the first column won't sort
											/* eslint-disable */
											compareFunctionFactory: function(sortOrder, columnMeta) {
												return function(value, nextValue) {
													if (value !== null && nextValue !== null) {
														if (value === nextValue) {
															return 0 // 같은 값이면 순서 유지
														}
														if (sortOrder === 'asc') {
															return value < nextValue ? -1 : 1 // 오름차순 정렬
														} else {
															return value > nextValue ? -1 : 1 // 내림차순 정렬
														}
													}
												}
											}
											/* eslint-enable */
										}
	
									}
								]}
								mergeCells={data.length !== 0 && [
									{ row: data.length - 4, col: 0, rowspan: 4, colspan: 1 }, 
									{ row: data.length - 4, col: 14, rowspan: 1, colspan: 2 },
									{ row: data.length - 3, col: 14, rowspan: 1, colspan: 2 },
									{ row: data.length - 2, col: 14, rowspan: 1, colspan: 2 },
									{ row: data.length - 1, col: 14, rowspan: 1, colspan: 2 }
								]}
								contextMenu={true}
								width='100%'
								height='auto'
								stretchH="all"
								colWidths={columnWidths}
								rowHeights={40}
								columnHeaderHeight={40}
								licenseKey="non-commercial-and-evaluation"
							/>
							{(data.length === 0) && <NoDataComponent/>}
					</CardBody>
				</Card>
			</Row>
		</Fragment>
	)
}
export default Performance