import { Fragment, useState } from "react"
import { Row, Card, CardTitle, CardHeader, Button, CardBody, Col, TabContent } from 'reactstrap'
import Breadcrumbs from '@components/breadcrumbs'
// import { API_ENERGY_EXAMIN, API_GAUGE_GROUP_LIST } from "../../../constants"
// import { useLocation } from "react-router-dom"
// import { getTableData } from "../../../../utility/Utils"
// import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
// import axios from '../../../utility/AxiosConfig'
// import Cookies from 'universal-cookie'
// import * as moment from 'moment'
// import Flatpickr from "react-flatpickr"
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import Select from "react-select"
import '@styles/react/libs/tables/react-dataTable-component.scss'
import ChartTab from "./ChartTab"
import ExamineList from "./List"
import ExamineChart from "./Chart"
import { API_ENERGY_EXAMIN_CHART } from "../../../../constants"

const GaugeExaminChart = () => {
    const [active, setActive] = useState('dailyChart')
		
	return (
	<Fragment>
        <Row>
            <div className='d-flex justify-content-start'>
                <Breadcrumbs breadCrumbTitle='검침차트' breadCrumbParent='에너지관리' breadCrumbParent2='일일/월간검침' breadCrumbActive='검침차트'/>
            </div>
        </Row>
        <ChartTab
            active = {active}
            setActive = {setActive}    
        />
        { active === 'dailyChart' &&
            <ExamineChart
                type = 'daily'
            />
        }
        { active === 'dailyList' &&
            <ExamineList
                type = 'daily'
            />
        }
        { active === 'monthlyChart' &&
             <ExamineChart
                type = 'monthly'
            />

        }
        { active === 'monthlyList' &&
            <ExamineList
                type = 'monthly'
            />
        }

	</Fragment>
	)
}


export default GaugeExaminChart