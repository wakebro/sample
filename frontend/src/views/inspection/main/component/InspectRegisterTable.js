import { Card, CardBody, CardHeader, CardTitle } from "reactstrap"
import DataTable from 'react-data-table-component'
import { useAxiosIntercepter } from '@src/utility/hooks/useAxiosInterceptor'
import { useState, useEffect } from "react"
import Cookies from 'universal-cookie'
import { getTableData } from '@utils'
import { 
  API_INSPECTION_COMPLAIN_LIST,
  ROUTE_INSPECTION_COMPLAIN_DETAIL
} from "@src/constants"
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { useNavigate } from "react-router-dom"
import { primaryHeaderColor } from "../../../../utility/Utils"
import CustomHelpCircle from "../../../apps/CustomHelpCircle"


// InspectRegisterTable style
export const inspectRegisterCustomStyles = {
  tableWrapper: {
		style: {
			display: 'table',
			height: '100%',
      maxWidth: '100%'
		}
	},
	headCells: {
		style: {
			'&:first-child': {
				borderLeft: 'none'
			},
			backgroundColor: primaryHeaderColor,
			border: '0.5px solid #B9B9C3',
			display: 'flex',
			justifyContent: 'center',
      fontSize: '14px',
      fontFamily: 'Pretendard-Regular',
      paddingLeft:'5px',
      paddingRight:'5px'
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
			fontSize: '14px',
      fontFamily: 'Pretendard-Regular',
      paddingLeft:'5px',
      paddingRight:'5px'
		}
	},
	rows: {
		style: {
			cursor: 'default', // 마우스 포인터를 원하는 형태로 변경합니다.
			minHeight: '40px',
			maxHeight: '100%'
		}
	}
}

//InspectRegisterTable 컬럼
const inspectColumns = [
    {
      name: '번호',
      selector: row => row.id,
      sortable: true,
      width: '14%'
    },
    {
      name: '접수일시',
      selector: row => row.requestDate,
      sortable: true,
      width: '21%'
    },
    {
      name: '직종',
      selector: row => row.empClass,
      sortable: true,
      width: '16%'
    },
    {
      name: '접수내용',
      selector: row => row.complainContent,
      sortable: true,
      width: '34%'
    },    
    {
      name: '상태',
      selector: row => row.complainStatus,
      sortable: true,
      width: '15%'
    }
]

const InspectRegisterTable = () => {
  //axios csrf
  useAxiosIntercepter()

  //navi
	const navigate = useNavigate()

  // 사업소 데이터를 위한 쿠키 선언
  const cookies = new Cookies()

  // 테이블 데이터 state
  const [complainList, setComplainList] = useState([])

  const NoDataComponent = () => (
		<div style={{margin:'3%'}} className="no-data-message">데이터가 없습니다.</div>
	)
  const NoIconComponent = () => (
		<></>
	)
  

  const handleRowClick = (row) => {
		if (ROUTE_INSPECTION_COMPLAIN_DETAIL !== undefined) {
			// window.location.href = `${detailAPI}/${row.id}`
			navigate(`${ROUTE_INSPECTION_COMPLAIN_DETAIL}/${row.id}`)
		} 
	}

  // 화면이 랜더링 될때 사업소를 넘기고 데이터를 받아옴.
  useEffect(() => {
    const param = {
      prop_id : cookies.get('property').value,
      component_type: 'main'
    }
    // 점검 
    getTableData(API_INSPECTION_COMPLAIN_LIST, param, setComplainList)
  }, [])

  return (
    <Card style={{minHeight:'550px'}}>
      <CardHeader className="pb-0">
          <CardTitle className="px-0">
              불편신고 업무 현황
              <CustomHelpCircle
                id={'registerTable'}
                content={'현재의 불편신고 업무 현황을 알 수 있습니다.'}
              /> 
          </CardTitle>
      </CardHeader>
      <CardBody className="px-0 pb-0" style={{height:'100%', width: '100%'}}>
        <DataTable
          persistTableHead
          data={complainList}
          columns={inspectColumns}
          customStyles={inspectRegisterCustomStyles}
          noDataComponent={<NoDataComponent/>}
          sortIcon={<NoIconComponent/>}
          onRowClicked={handleRowClick}
          style={{height:'100%', width: 'auto'}}
          />
      </CardBody>
    </Card>
  )
}
export default InspectRegisterTable