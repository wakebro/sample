import Breadcrumbs from '@components/breadcrumbs'
// import axios from 'axios'
import { Fragment, useEffect, useState } from "react"
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Input, InputGroup, Row, TabContent, TabPane } from "reactstrap"
import { API_INSPECTION_COMPLAIN_DETAIL, API_INSPECTION_COMPLAIN_DETAIL_EXPORT  } from '../../../../constants'
// import { getTableData } from '../../../../utility/Utils'
import { useAxiosIntercepter } from '../../../../utility/hooks/useAxiosInterceptor'
import NavTab from './NavTab'
import ProgressDetail from './ProgressDetail'
import OtherDetails from './OtherDetail'
import { useParams } from "react-router-dom"
import { getTableData } from '../../../../utility/Utils'
import { FileText } from 'react-feather'
import axios from 'axios'
import Cookies from 'universal-cookie'

const Complain_Detail = () => {
	useAxiosIntercepter()
	const [navActive, setNavActive] = useState('progress')
    const params = useParams()
	const complain_id = params.id
	const [data, setData] = useState([])
    const cookies = new Cookies()

    const BasicInfoTabList = [
        {label : '진행현황', value : 'progress'},
        {label : '작업자', value : 'worker'},
        {label : '자재', value : 'material'},
        {label : '공구비품', value : 'toolequipment'}
    ]

    const handleExport = () => {
        axios.get(API_INSPECTION_COMPLAIN_DETAIL_EXPORT, {params: {complain_id: complain_id, property_id: cookies.get('property').value}})
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
        if (navActive !== undefined) {

            if (window.location.pathname !== localStorage.getItem('pathname')) {
                localStorage.clear()
                localStorage.setItem('pathname', window.location.pathname)
                setNavActive(BasicInfoTabList[0].value)
            } else {
                // setNavActive(localStorage.getItem('navTab'))
                setNavActive(BasicInfoTabList[0].value)
            }
            getTableData(API_INSPECTION_COMPLAIN_DETAIL, {complain_id : complain_id }, setData)
        }
    }, [])

	return (
		<Fragment>
			<Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='작업현황관리' breadCrumbParent='점검관리' breadCrumbActive='작업현황관리' />
                    <Button.Ripple outline className={'btn-sm ms-auto mb-2'} style={{minWidth:'100px'}} onClick={handleExport}>
                        <FileText size={14}/>문서변환
                    </Button.Ripple>
				</div>
			</Row>
			<Row>
				<Col sm={12} md={6} lg={4}>
					<NavTab tabList={BasicInfoTabList} active={navActive} setActive={setNavActive}/>
				</Col>
			</Row>
			<TabContent activeTab={navActive}>
            { navActive === 'progress' &&
                <ProgressDetail
                    data={data}
                    complain_id = {complain_id}
                    setData = {setData}
                />
            }
            {(navActive === 'worker' || navActive === 'material' || navActive === 'toolequipment') &&
                <OtherDetails
                    state = {navActive}
                    data = {data}
                    complain_id = {complain_id}
                />
            }

			</TabContent>
		</Fragment>
	)
}

export default Complain_Detail