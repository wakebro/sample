import { Fragment, useEffect, useState } from "react"
import Breadcrumbs from '@components/breadcrumbs'
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Col, Form, Input, Row } from "reactstrap"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { API_DISASTER_WORKER_QNA_DETAIL, API_DISASTER_WORKER_QNA_REG, API_EMPLOYEE_DETAIL, API_SYSTEMMGMT_BASIC_INFO_PROPERTY, ROUTE_CRITICAL_DISASTER_WORKER_QNA } from "../../../../constants"
import { useForm } from "react-hook-form"
import WorkerQnaRowCol from "./WorkerQnaRowCol"
import * as moment from 'moment'
import { validationSchemaWorkerQna, workerQnaDefaultValue } from "../data"
import { axiosPostPutNaviAlertCustom, getObjectKeyCheck, getTableData, getTableDataCallback } from "../../../../utility/Utils"
import Cookies from "universal-cookie"
import { useAxiosIntercepter } from "../../../../utility/hooks/useAxiosInterceptor"
import { yupResolver } from "@hookform/resolvers/yup"
import InputFileUploader from "../../../apps/customFiles/InputFileUploader"


const WorkerQnaForm = () => {
    const { state } = useLocation()
    useAxiosIntercepter()
    const cookies = new Cookies()
    const activePropery = cookies.get('property').value
    const navigate = useNavigate()
    const {
        control,
		handleSubmit,
		formState: { errors },
        setValue
	} = useForm({
		defaultValues: workerQnaDefaultValue,
		resolver: yupResolver(validationSchemaWorkerQna)
	})
    // state
    const today = moment().format('YYYY-MM-DD')
    const [userData, setUserData] = useState([])
    const [mainProperty, setMainProperty] = useState({})
    const [sign, setSign] = useState('')
    // files, setFiles, showNames, setShowNames, pageType
    const [files, setFiles] = useState([])
    const [showNames, setShowNames] = useState([])

    const onSubmit = (data) => {
        const formData = new FormData()
        formData.append('title', data.title)
        formData.append('current_problem', data.currentProblem)
        formData.append('improvement', data.improvement)
        formData.append('property', activePropery)
        formData.append('user_data', JSON.stringify(userData))
        formData.append('today', today)

        let matchingIds = []
        if (state.type === 'modify') {
            matchingIds = showNames.map((id) => id.id)
        }
        if (files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                formData.append('doc_files', files[i])
              }
        } else {
            formData.append('doc_files', [''])
        }
        formData.append('old_files_id', matchingIds)

        const pageType = state.type
        const API = pageType === 'register' ? API_DISASTER_WORKER_QNA_REG : `${API_DISASTER_WORKER_QNA_DETAIL}/${state.id}`
        axiosPostPutNaviAlertCustom(pageType, '의견', API, formData, navigate, ROUTE_CRITICAL_DISASTER_WORKER_QNA, '소중한 의견 감사합니다.')
    }

    const handleCancel = () => {
        navigate(`${ROUTE_CRITICAL_DISASTER_WORKER_QNA}/detail/${state.id}`)
    }

    const setModify = (data) => {
        setValue('title', data.title)
        setValue('currentProblem', data.current_problem)
        setValue('improvement', data.improvement)
        setShowNames(data.qna_files)
    }

    useEffect(() => {
        getTableData(API_EMPLOYEE_DETAIL, {userId:cookies.get('userId')}, setUserData)
        if (state.type === 'modify') getTableDataCallback(`${API_DISASTER_WORKER_QNA_DETAIL}/${state.id}`, {}, setModify)
    }, [])

    useEffect(() => {
        getTableData(`${API_SYSTEMMGMT_BASIC_INFO_PROPERTY}/${activePropery}`, {}, setMainProperty)
        setSign(getObjectKeyCheck(userData, 'signature'))
    }, [userData])

    return (
        <Fragment>
            <Row>
				<div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='종사자의견등록' breadCrumbParent='종사자의견청취' breadCrumbActive={'종사자의견등록'} />
				</div>
			</Row>
            <Row>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Col>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    종사자의견등록
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                <WorkerQnaRowCol
                                    control={control}
                                    errors={errors}
                                    userData={userData}
                                    createDate={today}
                                    mainProperty={mainProperty}
                                    sign={sign}
                                />
                                <InputFileUploader
                                    files={files}
                                    setFiles={setFiles}
                                    showNames={showNames}
                                    setShowNames={setShowNames}
                                    pageType={state.type}
                                    label={true}
                                    limit={6}
                                />
                            </CardBody>
                            <CardFooter className="d-flex justify-content-end">
                                {state.type === 'register' ? <></> : <Button className="me-1" color="report" onClick={handleCancel}>취소</Button>}
                                <Button type="submit" color="primary" className="me-1">{state.type === 'register' ? '제출' : '수정'}</Button>
                                <Button className="me-1" tag={Link} to={ROUTE_CRITICAL_DISASTER_WORKER_QNA}>목록</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Form>
            </Row>
        </Fragment>
    )
}
export default WorkerQnaForm