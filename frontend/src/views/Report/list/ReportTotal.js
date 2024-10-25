import * as moment from 'moment'
import Cookies from 'universal-cookie'
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useState, useEffect } from "react"
import { Row, Button} from "reactstrap"
import ReportTap from './ReportTap'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useAxiosIntercepter } from '../../../utility/hooks/useAxiosInterceptor'
import ReportCardList from './ReportCardList'
import { useLocation } from 'react-router'
import { API_REPORT_LIST, ROUTE_REPORT_OPERATE_EXPORT } from '../../../constants'
import { getTableData, pickerDateChange } from '../../../utility/Utils'
import { FileText } from 'react-feather'

const InspectionReportList = () => {
    useAxiosIntercepter()
    const cookies = new Cookies()
    const activeUser = Number(cookies.get("userId"))
    const { state } = useLocation()
    const [active, setActive] = useState('total')
    const [pastActive, setPastActive] = useState('')

    const [data, setData] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const now = moment().subtract(0, 'days')
    const yesterday = moment().subtract(7, 'days')
	const [picker, setPicker] = useState([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])

    const [selectId, setSelectId] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [lineIsOpen, setLineIsOpen] = useState(false)
    const [checked, setChecked] = useState(false)


    const handleClick = () => {
        const changePicker = pickerDateChange(picker)
    	localStorage.setItem("start_date", changePicker[0])
    	localStorage.setItem("end_date", changePicker[1])
    	localStorage.setItem("main_purpose", active)
		window.open(ROUTE_REPORT_OPERATE_EXPORT, '_blank')
	}

    useEffect(() => {
        if (state !== null) {
            setActive(state.type)
        }
    }, [state])

    useEffect(() => {
        localStorage.removeItem('start_date')
        localStorage.removeItem('end_date')
        localStorage.removeItem('main_purpose')
        localStorage.removeItem('reportData')
        if ((pastActive !== '' && pastActive !== active)) {
            setPicker([yesterday.format('YYYY-MM-DD'), now.format('YYYY-MM-DD')])
            setSearchValue('')
            setData([])
            setChecked(false)
            setPastActive('')
        }
        getTableData(
            API_REPORT_LIST, 
            {
                property:cookies.get('property').value, 
                user: activeUser, 
                picker:pickerDateChange(picker), 
                search:searchValue, 
                type:active, 
                checked:checked
            }, 
            setData
        )
    }, [active, pastActive, checked])

    return (
        <Fragment>
			<Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='보고서' breadCrumbParent='보고서 관리' breadCrumbActive='보고서'/>
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleClick}>
                        <FileText size={14}/>
                        문서변환
                    </Button.Ripple>
                </div>
			</Row>
            <Row className='report-width'>
                <ReportTap lg='7' md='12' xs='12' active={active} setActive={setActive} setPastActive={setPastActive}/>
            </Row>
            <ReportCardList 
                cookies={cookies}
                data={data}
                setData={setData}
                active={active}
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                picker={picker}
                setPicker={setPicker}
                selectId={selectId}
                setSelectId={setSelectId}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                lineIsOpen={lineIsOpen}
                setLineIsOpen={setLineIsOpen}
                checked={checked}
                setChecked={setChecked}
            />
        </Fragment>
    )

}
export default InspectionReportList