import { Col, FormFeedback, Input, Row } from "reactstrap"
import { getObjectKeyCheck } from "../../../../utility/Utils"
import { Controller } from "react-hook-form"

const WorkerQnaRowCol = (props) => {
    const { control, errors, userData, createDate, mainProperty, sign } = props

    return (
        <Row className="mx-0 mb-2">
            <Col>
                <Row>
                    <Col xs={3} className="d-flex card_table col_color text center border-y risk-report text-bold">
                        제목&nbsp;
                        <div className='essential_value'/>
                    </Col>
                    <Col className="d-flex flex-column card_table top">
                        <Controller
                            control={control}
                            name={'title'}
                            render={({field: {onChange, value}}) => (
                                <Input
                                    value={value}
                                    onChange={onChange}
                                    invalid={errors.title && true}
                                />
                            )}
                        />
                        {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
                    </Col>
                </Row>
                <Row>
                    <Col md={3} xs={6} className="d-flex card_table col_color border-b text center risk-report text-bold">
                        사업소 소속
                    </Col>
                    <Col className="card_table mid text center risk-report text-normal">
                        {`${getObjectKeyCheck(mainProperty, 'name')} (${getObjectKeyCheck(mainProperty, 'code')})`}
                    </Col>
                    <Col md={3} xs={6} className="d-flex card_table col_right border-b text center risk-report text-bold">
                        작성일자
                    </Col>
                    <Col className="card_table mid text center risk-report text-normal">
                        {createDate}
                    </Col>
                </Row>
                <Row>
                    <Col md={3} xs={6} className="d-flex card_table col_color border-b text center risk-report text-bold">
                        성명
                    </Col>
                    <Col className="card_table mid text center risk-report text-normal">
                        {getObjectKeyCheck(userData, 'name')}
                    </Col>
                    <Col md={3} xs={6} className="d-flex card_table col_right border-b text center risk-report text-bold">
                        서명
                    </Col>
                    <Col className="card_table mid text center risk-report text-normal">
                        { sign === null ||  sign === '' ?
                            '이미지 없음'
                            :
                            <img src={`/static_backend/${sign}`} className="sign-image"/>
                        }
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="border-left d-flex card_table col col_color border-b text center risk-report text-bold">
                        {'현재상황 (안전/보건/유해/위험/시설/장소 내용)'}&nbsp;
                        <div className='essential_value'/>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-column border-left card_table mid">
                        <Controller
                            control={control}
                            name={'currentProblem'}
                            render={({field: {onChange, value}}) => (
                                <Input 
                                    type="textarea"
                                    value={value}
                                    onChange={onChange}
                                    invalid={errors.currentProblem && true}
                                    style={{minHeight:'200px'}}
                                />
                            )}
                        />
                        {errors.currentProblem && <FormFeedback>{errors.currentProblem.message}</FormFeedback>}
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} className="d-flex card_table col col_color border-b text center risk-report text-bold">
                        {'개선 건의(제안) 사항'}&nbsp;
                        <div className='essential_value'/>
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-column border-left card_table mid">
                        <Controller
                            control={control}
                            name={'improvement'}
                            render={({field: {onChange, value}}) => (
                                <Input 
                                    type="textarea"
                                    value={value}
                                    onChange={onChange}
                                    invalid={errors.improvement && true}
                                    style={{minHeight:'200px'}}
                                />
                            )}
                        />
                        {errors.improvement && <FormFeedback>{errors.improvement.message}</FormFeedback>}
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default WorkerQnaRowCol