import { Button, Col, Card, CardHeader, CardTitle, Row, CardBody, Label, InputGroup, Input } from "reactstrap"
import { useEffect, useState } from "react"
import { templateColumns, templatePageType, templateTypeObjList } from "../data"
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { useSelector } from 'react-redux' //useDispatch
import '@styles/react/libs/flatpickr/flatpickr.scss'
import Flatpickr from 'react-flatpickr'
import * as moment from 'moment'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import TypeModal from "../../../../apps/customModal/DefaultSelectModal"
import { API_DISASTER_TEMPLATE_LIST, ROUTE_CRITICAL_DISASTER_EVALUATION } from "../../../../../constants"
import { checkOnlyView, getTableData, pickerDateChange } from "../../../../../utility/Utils"
import Cookies from "universal-cookie"
import TenantCustomDataTable from "../../../../basic/area/tenant/list/TenantCustomTable"
import { CRITICAL_EVALUATION_TEMPLATE } from "../../../../../constants/CodeList"
import { Korean } from "flatpickr/dist/l10n/ko.js"
import TotalLabel from "../../../../../components/TotalLabel"

const EvaluationTemplateList = () => {
    // 검색 기능 추가
    useAxiosIntercepter()
    
    // tab을 위한 리덕스
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
    const loginAuth = useSelector((state) => state.loginAuth)
	//const dispatch = useDispatch()
    const cookies = new Cookies()

    const [isOpen, setIsOpen] = useState(false)

    // date
    const today = moment()
    const past = moment().subtract(1, 'years')
	const [picker, setPicker] = useState([past.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')])
    const [search, setSearch] = useState('')
    const [type, setType] = useState('')
    const [data, setData] = useState([])

    const handleModal = () => {
        setIsOpen(true)
    }

    const getListData = () => {
        const param = {
            property: cookies.get('property').value,
            picker: pickerDateChange(picker),
            search: search
        }
		getTableData(API_DISASTER_TEMPLATE_LIST, param, setData)
    }
    useEffect(() => {
        getListData()
	}, [])
    console.log(data)
    return (
        <>
            <Row>
                <Col>
                    <Card>
                        <CardHeader>
                            <CardTitle>위험성평가 양식 {templatePageType[criticalDisaster.templateTab]}</CardTitle>
                            <Button
                                hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_create')}
                                color="primary"
                                onClick={handleModal}
                            >등록</Button>
                        </CardHeader>
                        <CardBody>
                            <Row>
                                <Col lg={7} md={12} xs={12}>
                                    <Row>
                                        <Col lg={6} md={6} xs={12} className="mb-1 d-flex flex-row">
                                            <div className="col-auto me-1" style={{marginTop: '9px'}}>{"기간"}</div>
                                            <Flatpickr
                                                id='range-picker'
                                                className='form-control'
                                                value={picker}
                                                onChange={date => { if (date.length === 2) setPicker(date) } }
                                                options={{
                                                    mode: 'range',
                                                    ariaDateFormat:'Y-m-d',
                                                    locale: {
                                                        rangeSeparator: ' ~ '
                                                    },
                                                    locale: Korean
                                                    }}
                                                placeholder={`${today.format('YYYY-MM-DD')}~`}
                                            />
                                        </Col>
                                        <Col lg={6} md={6} xs={12} className="mb-1">
                                            <InputGroup>
                                                <Input
                                                    value={search} 
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder= '위험성평가 양식 제목을 검색해보세요.'
                                                    onKeyDown={e => {
                                                        if (e.key === 'Enter') {
                                                            getListData()
                                                        }
                                                    }}
                                                />
                                                <Button
                                                    onClick={getListData}
                                                >
                                                    검색
                                                </Button>
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <TotalLabel 
                                num={3}
                                data={data.length}
                            />
                            <Row className="mb-2">
                            {data &&
                                <TenantCustomDataTable
                                    columns={templateColumns} 
                                    tableData={data} 
                                    setTabelData={setData} 
                                    selectType={false}
                                    onRowClicked
                                    detailAPI={`${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`}
                                />
                            }
                            </Row>
                            <TypeModal
                                headerTitle={'위험성 평가 방법'}
                                headerHelpText={'위험성 평가 방법을 선택해주세요.'}
                                selectTitle={'평가 방법'}
                                data={templateTypeObjList}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                navAPI={`${ROUTE_CRITICAL_DISASTER_EVALUATION}/template/register`}
                                type={type}
                                setType={setType}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    )
}
export default EvaluationTemplateList