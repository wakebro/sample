import { Fragment, useState, useRef, useEffect  } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, Input, InputGroup } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
import { API_ENERGY_EXAMIN, API_GAUGE_GROUP_LIST, API_ENERGY_EXAMIN_EXPORT } from "../../../constants"
import { checkOnlyView, makeSelectList, sweetAlert } from "../../../utility/Utils"
import { useParams } from 'react-router'
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import axios from '../../../utility/AxiosConfig'
import Cookies from 'universal-cookie'
import * as moment from 'moment'
import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { FileText } from 'react-feather'
import 'handsontable/dist/handsontable.full.min.css'
import { registerAllModules } from 'handsontable/registry'
import { HotTable } from '@handsontable/react'
import { registerLanguageDictionary, koKR } from 'handsontable/i18n'
import '@styles/react/libs/tables/HandsonTable Nopicker.scss'
import Select from "react-select"
import ReactPaginate from 'react-paginate'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { axiosDeletCallBack } from "../data"
import { useSelector } from "react-redux"
import { ENERGY_DAILY, ENERGY_MONTHLY } from "../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../components/TotalLabel"

registerLanguageDictionary(koKR)
registerAllModules()

const GaugeExamin = () => {
		useAxiosIntercepter()
        const loginAuth = useSelector((state) => state.loginAuth)
        const cookies = new Cookies()
        const property_id =  cookies.get('property').value
		const [data, setData] = useState([])
        const { part } = useParams()
        const hotRef = useRef(null)
        const [gauge, setGauge] = useState({label: '전체', value:''})
        const [gaugeList, setGaugeList] = useState([{label: '전체', value:''}])
        const [currentPage, setCurrentPage] = useState(0)
        const [totalCount, setTotalCount] = useState(0)
        
        let examin_type = ''
        let examin_type_value = ''
        let breadCrumbTitle = ''
        let breadCrumbActive = ''
        let defaultPicker = []
        let readonly = true
        if (part === 'daily') {
            examin_type = '일일'
            examin_type_value = 'd'
            breadCrumbTitle = '일일검침'
            breadCrumbActive = '일일검침'
            defaultPicker = [
                moment().subtract(7, 'days').format('YYYY-MM-DD'),
                moment().format('YYYY-MM-DD')
                ]
            readonly = true
        } else if (part === 'monthly') {
            examin_type = '월간'
            examin_type_value = 'm'
            breadCrumbTitle = '월간검침'
            breadCrumbActive = '월간검침'
            defaultPicker = [
            moment().subtract(1, 'years').format('YYYY-MM-DD'),
			moment().format('YYYY-MM-DD')
            ]
            readonly = false
        }
        const [picker, setPicker] = useState(defaultPicker)
        const formatDate = (date) => {
			return moment(date).format("YYYY-MM-DD")
		}

        const handlePagination = (page) => {
            setCurrentPage(page.selected)
        }

        const getExamin = () => {
            axios.get(API_ENERGY_EXAMIN, {params: {examin_type: examin_type_value, prop_id: property_id, picker: picker, gauge_group: gauge.value, currentPage: currentPage + 1}})
            .then(res => {
                setData(res.data.data)
                setTotalCount(res.data.total_count)
            })
        }

        const handleDeleteClick = () => {
            const hot = hotRef.current.hotInstance
            const hotdata = hot.getData()
            const checked_ids = []
            for (let i = 0; i < hotdata.length; i++) {
                const row = hotdata[i]
                const isChecked = row[0]
                if (isChecked) {
                    const id = data[i].id
                    checked_ids.push(id)
                }
            }
            if (checked_ids.length <= 0) return
            axiosDeletCallBack('검침량', API_ENERGY_EXAMIN, {data: {checked_ids: checked_ids }}, getExamin)
        }

        const handleExport = () => {
            axios.get(API_ENERGY_EXAMIN_EXPORT, {params: {examin_type: examin_type_value, prop_id: property_id, picker: picker, gauge_group: gauge.value}})
            .then((res) => {
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

		useEffect(() => {
            axios.get(API_GAUGE_GROUP_LIST, { params: {property_id: property_id, employee_class_id:'', searchValue:'' } })
            .then(res => {
                makeSelectList(true, '', res.data, gaugeList, setGaugeList, ['code'], 'id')
            })
            getExamin()
        }, [])

        useEffect(() => {		
            getExamin()
        }, [gauge, picker, currentPage])

        const NoDataComponent = () => (
            <div style={{margin:'3%'}} className="hand-no-data">데이터가 없습니다.</div>
        )

	return (
		<Fragment>
			<>
				<Row>
					<div className='d-flex justify-content-start'>
						<Breadcrumbs breadCrumbTitle={breadCrumbTitle} breadCrumbParent='에너지관리' breadCrumbParent2='일일/월간검침'  breadCrumbActive={breadCrumbActive}/>
                        <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                            <FileText size={14}/>
                            문서변환
                        </Button.Ripple>
                    </div>
				</Row>
				<Card>
					<CardHeader>
						<CardTitle>
                        {examin_type}검침
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
							<Col md='4' className="mb-1">
								<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
									<Col xs='3' md='2' style={{ alignItems: 'center', paddingRight: 0, marginLeft:'5px'}}>기간</Col>
								<Flatpickr
									value={picker}
									id='range-picker'
									className='form-control'
									placeholder='2022/02/09~2023/03/03'
									onChange={(dates) => setPicker(dates.map(formatDate))} // 날짜를 'yyyy-mm-dd' 형식으로 변환
									options={{
									mode: 'range',
									ariaDateFormat:'Y-m-d',
									locale: {
										rangeSeparator: ' ~ '
									},
                                    locale: Korean,
									defaultValue: picker // 초기값 설정

									}}
								/>								
								</div>
							</Col>
                            <Col className="d-flex justify-content-end align-items-start">
                                <Button hidden={checkOnlyView(loginAuth, examin_type === '일일' ? ENERGY_DAILY : ENERGY_MONTHLY, 'available_delete')}
                                    outline style={{ alignItems: 'right', marginRight: '1%'}} onClick={ handleDeleteClick }>삭제</Button>
                            </Col>
						</Row>
                        <TotalLabel 
                            num={3}
                            data={data.length}
                        />
                        <div className="d-flex form-control hidden-scrollbar mt-1 flex-column" style={{ width: '100%', display: 'flex', padding: 0, border: 'none' }}>
                            <HotTable
                                id='hot-table'
                                className="react-dataTable-Handson htCenter htMiddle"
                                ref={hotRef}
                                language={koKR.languageCode}
                                beforeRefreshDimensions={() => true}
                                colHeaders={['', '직종', '계량기명', '계기명', '검침일', '검침양', `${examin_type}사용량`, '단위']}
                                data={data}
                                startRows={1}
                                columns={[
                                    {
                                        data: 'available',
                                        type: 'checkbox'
                                    },
                                    {
                                        data: 'gauge.gauge_group.employee_class.code',
                                        readOnly: true
                                    },
                                    {
                                        data: 'gauge.gauge_group.code',
                                        readOnly: true

                                    },
                                    {
                                        data: 'gauge.code',
                                        readOnly: true

                                    },
                                    {
                                        data: 'examin_date',
                                        readOnly: readonly,
                                        type: 'date',
                                        dateFormat: 'YYYY-MM-DD',
                                        correctFormat: true,
                                        datePickerConfig: {
                                            i18n: {
                                              months: [
                                                "1월",
                                                "2월",
                                                "3월",
                                                "4월",
                                                "5월",
                                                "6월",
                                                "7월",
                                                "8월",
                                                "9월",
                                                "10월",
                                                "11월",
                                                "12월"
                                              ],
                                              weekdays: [
                                                "일요일",
                                                "월요일",
                                                "화요일",
                                                "수요일",
                                                "목요일",
                                                "금요일",
                                                "토요일"
                                              ],
                                              weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"]
                                            }
                                        }
                                    },
                                    {
                                        data: 'examin_value',
                                        type: 'numeric',
                                        className:'htRight htMiddle',
                                        numericFormat: {
                                            pattern: '0,0' 
                                        }
                                    },
                                    {
                                        data: 'usage',
                                        type: 'numeric',
                                        readOnly: true,
                                        className:'htRight htMiddle',
                                        numericFormat: {
                                            pattern: '0,0' 
                                        }
                                    },
                                    {
                                        data: 'gauge.unit',
                                        readOnly: true

                                    }

                                ]}
                            
                                minSpareRows={0}
                                contextMenu={false}
                                width='100%'
                                height='auto'
                                stretchH="all"
                                colWidths={[20, 50, undefined, undefined, undefined, undefined, undefined, 30]}
                                rowHeights={40}
                                columnHeaderHeight={40}
                                licenseKey="non-commercial-and-evaluation"
                                afterChange={(changes, source) => {
                                    if (source === 'edit' || source === 'Autofill.fill') {
                                        // gauge_examin의 id 값으로 변경
                                        changes.map(change => {
                                            const [row, prop, oldValue, newValue] = change
                                            const RowId = data[row].id
                                            if (prop !== 'available') {
                                                const formData = new FormData()
                                                formData.append('changes', [[RowId, prop, oldValue, newValue]])
                                                axios.put(API_ENERGY_EXAMIN, formData, {
                                                    headers: {
                                                        "Content-Type": "multipart/form-data"
                                                    }
                                                }).then((res) => {
                                                    console.log(res, 'status.ok')
                                                    getExamin()
                                                }).catch(res => {
                                                    console.log(res, "!!!!!!!!error")
                                                })
                                            }

                                        })
                                    }
                                }}
                                beforeChange={(changes, source) => {
                                    if (source === 'edit' || source === 'Autofill.fill') {
                                        for (let i = 0; i < changes.length; i++) {
                                            const [row, prop, oldValue, newValue] = changes[i]
                                            
                                            if ((prop === 'usage' || prop === 'examin_value') && isNaN(newValue)) {
                                                changes[i] = [row, prop, oldValue, oldValue]
                                                sweetAlert('', '숫자를 입력해주세요', 'warning', 'center')
                                            }
                                            if (prop === 'examin_date') {
                                                const dateRegex = /^\d{4}-\d{2}-\d{2}$/
                                                if (!dateRegex.test(newValue) || newValue.substr(0, 7) !== oldValue.substr(0, 7)) {
                                                    changes[i] = [row, prop, oldValue, oldValue]
                                                    sweetAlert('', '올바른 날짜 형식을 입력해주세요(같은 월끼리만 변경 가능합니다)', 'warning', 'center')
                                                }
                                            }
                                        } 

                                    }
                                }}
                            />
						</div>
                        {(data.length === 0) && <NoDataComponent/>}
                        <div>                      
                            <ReactPaginate
                            nextLabel=''
                            breakLabel='...'
                            previousLabel=''
                            pageRangeDisplayed={2}
                            marginPagesDisplayed={1}
                            forcePage={currentPage}
                            activeClassName='active'
                            pageClassName='page-item'
                            breakClassName='page-item'
                            nextLinkClassName='page-link'
                            pageLinkClassName='page-link'
                            breakLinkClassName='page-link'
                            previousLinkClassName='page-link'
                            nextClassName='page-item next-item'
                            previousClassName='page-item prev-item'
                            containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-center mt-1'
                            onPageChange={page => handlePagination(page)}
                            pageCount={Math.ceil(totalCount / 10) || 1}
                            />
                        </div>
					</CardBody>
				</Card>
			</>
	</Fragment>
	)
}


export default GaugeExamin