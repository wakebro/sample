import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row} from "reactstrap"
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { ChevronRight } from 'react-feather'
import { 
    API_DASHBOARD_CHECKLIST_TABLE, 
    API_DASHBOARD_EDULIST_TABLE,
    ROUTE_EDUCATION_TIMELINE
} from "@src/constants"
import { useState, useEffect } from "react"
import { getTableData } from '@utils'
import Cookies from 'universal-cookie'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { primaryHeaderColor } from "../../../utility/Utils"
import { ROUTE_INSPECTION_REG } from "../../../constants"
import CustomHelpCircle from "../../apps/CustomHelpCircle"

// dashboard table custom style
export const dashboardCustomStyles = {
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: 'none'
			},
			// backgroundColor: '#FF9F4333',
            backgroundColor: primaryHeaderColor,
			border: '0.5px solid #B9B9C3',
			display: 'flex',
			justifyContent: 'center',
			fontSize: '16px',
            fontFamily: 'Pretendard-Regular'
		}
	},
	cells: {
		style: {
			// 첫번째 cell에만 좌측 테두리 출력
			'&:first-child': {
				borderLeft: 'none'
			},
			border: '0.5px solid #B9B9C3',
			display: 'flex',
			justifyContent: 'center',
			fontSize: '15px'
		}
	},
	rows: {
		style: {
			cursor: 'default', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '35px',
			maxHeight: '100%'
		}
	}
}

// 점검 테이블 컬럼
const inspecColumns = [
    {
        name: '날짜',
        selector: row => row.date,
        sortable: true
    },
    {
        name: '직종',
        selector: row => row.empClass,
        sortable: true
    },
    {
        name: '점검명',
        selector: row => row.inspectName,
        sortable: true
    }
]
// 교육 테이블 컬럼
const eduColumns = [
    {
        name: '날짜',
        selector: row => row.date,
        sortable: true
    },
    {
        name: '종류',
        selector: row => row.eduType,
        sortable: true
    },
    {
        name: '교육명',
        selector: row => row.eduName,
        sortable: true
    },
    {
        name: '교육인원',
        selector: row => row.eduPeopleNum,
        sortable: true
    }
]

// 대시 보드 line chart component
const DashBoardTable = () => {
    //axios csrf
    useAxiosIntercepter()

    // 테이블 데이터 state
    const [checkList, setCheckList] = useState([])
    const [eduList, setEduList] = useState([])
    const cookies = new Cookies()

    // 화면이 랜더링 될때 사업소를 넘기고 데이터를 받아옴.
    useEffect(() => {
        const param = {
            property : cookies.get('property').value
        }
        // 점검 과 교육 리스트 데이터
        getTableData(API_DASHBOARD_CHECKLIST_TABLE, param, setCheckList)
        getTableData(API_DASHBOARD_EDULIST_TABLE, param, setEduList)
	}, [])

    const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)

    const NoIconComponent = () => (
		<></>
	)

    return (
        <>
            <Col ls={6}>
                {/* <Card style={{minHeight: '320px'}}> */}
                <Card style={{minHeight: '320px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            점검 리스트
                            <CustomHelpCircle
                                id={'checkListTable'}
                                content={'당일 부터 점검 해야할 점검목록을 볼 수 있습니다.'}
                            />
                        </CardTitle>
                        <Row>
                            <Col>
                                <Button className="px-1" color='primary' 
                                    tag={Link}
                                    to={`${ROUTE_INSPECTION_REG}/mg`}
                                >
                                    바로가기 <ChevronRight style={{width: '14', height: '14'}}/>
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="px-0 py-0">
                        <DataTable
                            persistTableHead
                            data={checkList}
                            columns={inspecColumns}
                            className='react-dataTable'
                            customStyles={dashboardCustomStyles}
                            noDataComponent={<NoDataComponent/>}
                            sortIcon={<NoIconComponent/>}
                        />
                    </CardBody>
                </Card>
            </Col>
            <Col ls={6}>
                {/* <Card style={{minHeight: '320px'}}> */}
                <Card style={{minHeight: '320px'}}>
                    <CardHeader>
                        <CardTitle className="dashboard-custom-title">
                            교육 리스트
                            <CustomHelpCircle
                                id={'eduListTable'}
                                content={'당일 부터 시작하는 교육 목록을 볼 수 있습니다.'}
                            />
                        </CardTitle>
                        <Row>
                            <Col>
                                <Button className="px-1" color='primary' 
                                    tag={Link}
                                    to={`${ROUTE_EDUCATION_TIMELINE}`}
                                >
                                    바로가기 <ChevronRight style={{width: '14', height: '14'}}/>
                                </Button>
                            </Col>
                        </Row>
                    </CardHeader>
                    <CardBody className="px-0 py-0" style={{height:'100%', width: '100%'}}>
                        <DataTable
                            persistTableHead
                            data={eduList}
                            columns={eduColumns}
                            className='react-dataTable'
                            customStyles={dashboardCustomStyles}
                            noDataComponent={<NoDataComponent/>}
                            sortIcon={<NoIconComponent/>}
                        />
                    </CardBody>
                </Card>
            </Col>
        </>
    )
}
export default DashBoardTable
//tag={Link} to={`${ROUTE_EDUCATION_SAFETY_DETAIL}/${data.id}`}