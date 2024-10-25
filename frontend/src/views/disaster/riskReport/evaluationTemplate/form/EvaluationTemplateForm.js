import Breadcrumbs from '@components/breadcrumbs'
import { yupResolver } from '@hookform/resolvers/yup'
import { Fragment, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap"
import * as yup from 'yup'
import { API_DISASTER_TEMPLATE_DETAIL, API_DISASTER_TEMPLATE_EVALUATION_LIST, API_DISASTER_TEMPLATE_REG, ROUTE_CRITICAL_DISASTER_EVALUATION } from "../../../../../constants"
import { axiosPostPutNaviCustom, checkSelectValueObj, getObjectKeyCheck, getTableData, getTableDataCallback, sweetAlert } from "../../../../../utility/Utils"
import { useAxiosIntercepter } from "../../../../../utility/hooks/useAxiosInterceptor"
import PropertyGroupCheckTable from "../../../../apps/cutomTable/PropertyGroupCheckTable"
import EvaluationItem from "../EvaluationItem"
import { evaluationTypeBadge } from "../data"
import { typeSelectList } from '../../evaluationReport/web/data'

// backend model name object
const inputName = {
    inputDetail: 'element_first',
    selectDanger: 'element_second',
    frequency: 'result_first',
    strength: 'result_second',
    inputResult: 'required_description',
    inputRiskreason: 'required_description',
    inputReason: 'option_description'
}
// backend axios form
const backendForm = (data, itemList, formData) => {
    const copyItemList = [...itemList]

    copyItemList.forEach((value, index) => { // 항목 순서
        const tempItem = {}
        for (const row of Object.entries(data)) { // index를 찾고 달라지면 break 걸면 성능이 좀더 좋아짐.
            const tempLabel = row[0].split('_')[0]
            const tempIndex = row[0].split('_')[1]
            const tempValue = row[1]
            if (tempIndex !== String(value)) continue // 검색을 위한 조건문
            // select input 체크
            if (tempLabel.includes('select') || tempLabel.includes('frequency') || tempLabel.includes('strength')) { 
                tempItem[inputName[tempLabel]] = tempValue?.value
                continue
            }
            tempItem[inputName[tempLabel]] = tempValue ? tempValue : ''
        }
        tempItem['view_order'] = index // 입력순서 지키기 위한 변수
        formData.append('items', JSON.stringify(tempItem))
    })
}// backendForm end

const EvaluationTemplateForm = () => {
    useAxiosIntercepter()
    const { state } = useLocation()
    const pageType = state.type.value <= 1 ? 'frequency' : 'step'
    const pageTypeValue = state.type.value
    const navigate = useNavigate()
    const [detailData, setDetailData] = useState(null)

    // options state
    const [dangerSelectList, setDangerSelectList] = useState([])
    const [dangerScoreList, setDangerScoreList] = useState([])

    const [itemList, setItemList] = useState([])
    const [itemsYup, setItemsYup] = useState(yup.object().shape({
        templateTitle: yup.string().required('위험성 평가 양식 제목을 입력해주세요.')
    }))

    const [selectError, setSelectError] = useState({})

    const {
		control,
        unregister,
        handleSubmit,
        setValue,
		formState: { errors }
	} = useForm({
		defaultValues : {},
		resolver: yupResolver(itemsYup)
	})

    // 등록시 보낼 사업소 set 
    const [checkList, setCheckList] = useState(new Set())

    const regModTemlate = (data) => { // submit func
        const check = checkSelectValueObj(control, selectError, setSelectError)
		if (!check) { return false }

        if (checkList.size <= 0) {
            sweetAlert('사업소 미선택', '해당 양식을 사용할 사업소를 선택해주세요.', 'warning', 'center')
            return
        }

        const formData = new FormData()
        formData.append('title', data.templateTitle) // 제목
        for (const prop of checkList) { // 사업소
            formData.append('property_list', prop)
        }
        formData.append('type', pageTypeValue) // 양식 타입
        delete data['templateTitle'] // 항목 순회를 위한 삭제
        backendForm(data, itemList, formData) // itemlist backend form trans
        const id = getObjectKeyCheck(state, 'id')
        const regModType = id !== '' ? 'modify' : 'register'
        const API = id !== '' ? `${API_DISASTER_TEMPLATE_DETAIL}/${id}` : API_DISASTER_TEMPLATE_REG

        axiosPostPutNaviCustom(regModType, '위험성평가양식', API, formData, navigate, `${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`)
    }
    
    useEffect(() => {
        if (getObjectKeyCheck(state, 'id') !== '') {
            getTableData(`${API_DISASTER_TEMPLATE_DETAIL}/${getObjectKeyCheck(state, 'id')}`, {}, setDetailData)
        } else {
            setItemList([...Array(10).keys()])
        }
        getTableDataCallback(API_DISASTER_TEMPLATE_EVALUATION_LIST, {}, (data) => {
            const copyDanger = data.danger
            // 데이터 형식 변경
    
            const tempDanger = []
    
            for (const danger of copyDanger) {
                const temp = {label: danger.name, value: danger.id}
                tempDanger.push(temp)
            }
    
            setDangerSelectList(tempDanger)
        })
        setDangerScoreList(typeSelectList[pageTypeValue]) // 위험성 평가 점수 options
    }, [])

    useEffect(() => {
        if (getObjectKeyCheck(state, 'regModType') !== 'modify') return
        setValue('templateTitle', getObjectKeyCheck(detailData, 'title'))
        setCheckList(new Set(getObjectKeyCheck(detailData, 'property_list')))

        const tempItems = getObjectKeyCheck(detailData, 'items')
        const itemsLen = tempItems.length
        setItemList([...Array(itemsLen).keys()])

        const tempDangerScoreList = [...typeSelectList[pageTypeValue]]
        for (const index in tempItems) {
            for (const row of Object.entries(tempItems[index])) {
                if (row[0].includes('selectDanger')) {
                    const tempSelect = dangerSelectList.filter((value) => value.value === row[1].value)
                    setValue(`${row[0]}_${index}`, tempSelect[0] ? tempSelect[0] : '')
                    continue
                }
                if (row[0].includes('frequency') || row[0].includes('strength')) {
                    const tempSelect = tempDangerScoreList.filter((value) => value.value === row[1].value)
                    setValue(`${row[0]}_${index}`, tempSelect[0] ? tempSelect[0] : '')
                    continue
                }
                setValue(`${row[0]}_${index}`, row[1])
            }
        }
    }, [detailData])

    return (
        <Fragment>
            <Row>
				<div className='d-flex justify-content-start'>
					<Breadcrumbs breadCrumbTitle='위험성평가양식등록' breadCrumbParent='중대재해관리' breadCrumbParent2='위험성평가' breadCrumbActive='위험성평가양식등록'/>
				</div>
			</Row>
            <Form onSubmit={handleSubmit(regModTemlate)}>
                <Row>
                    <Col>
                        <Card>
                            {/* 제목 */}
                            <CardHeader>
                                <Row className='w-100'>
                                    <Col md={9} xs={9}>
                                        <Controller
                                                name="templateTitle"
                                                control={control}
                                                render={({ field: { onChange, value } })  => (
                                                    <>
                                                        <Input
                                                            className='risk-report title-input'
                                                            invalid={errors.templateTitle && true}
                                                            placeholder='위험성 평가 양식의 제목을 입력해주세요.'
                                                            bsSize='lg'
                                                            onChange={onChange}
                                                            value={value !== undefined ? value : ''}
                                                        />
                                                        {errors.templateTitle && <FormFeedback>{errors.templateTitle.message}</FormFeedback>}
                                                    </>
                                            )}/>
                                    </Col>
                                    <Col xs={3} className="d-flex align-items-center" style={{padding:0}}>
                                        {evaluationTypeBadge[pageTypeValue]}
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-4">
                                    <Col>
                                        <Label className="mb-1 risk-report text-lg-bold d-flex align-items-center">
                                            사업소 선택&nbsp;
                                            <div className='essential_value'/>
                                        </Label>
                                        <PropertyGroupCheckTable
                                            checkList={checkList}
                                            setCheckList={setCheckList}
                                            purpose='template'
                                        />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <EvaluationItem
                                            control={control}
                                            errors={errors}
                                            unregister={unregister}
                                            itemsYup={itemsYup}
                                            setItemsYup={setItemsYup}
                                            itemList={itemList}
                                            setItemList={setItemList}
                                            type={pageType}
                                            selectError={selectError}
                                            setSelectError={setSelectError}
                                            setValue={setValue}
                                            dangerSelectList={dangerSelectList}
                                            dangerScoreList={dangerScoreList}
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                            <CardFooter className="d-flex justify-content-end">
                                <Button type="submit" color="primary" className="me-1">
                                    저장
                                </Button>
                                <Button 
                                    tag={Link} 
                                    to={`${ROUTE_CRITICAL_DISASTER_EVALUATION}/template`}
                                >
                                    목록
                                </Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
            </Form>
        </Fragment>
    )
}

export default EvaluationTemplateForm