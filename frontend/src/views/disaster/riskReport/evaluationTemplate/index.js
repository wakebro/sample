import { Button, Col, Row } from "reactstrap"
import Breadcrumbs from '@components/breadcrumbs'
import { Fragment, useEffect } from "react" //, useState
import { tabList } from "../evaluationTemplate/data" // patternPageType, 
import { useAxiosIntercepter } from '@hooks/useAxiosInterceptor'
import { useDispatch, useSelector } from 'react-redux'
// import { useLocation } from 'react-router'
import { setTemplateTab } from '@store/module/criticalDisaster'
import EvaluationTemplateList from "./list/EvaluationTemplateList"
import EvaluationTemplateCode from "./templateCode/EvaluationTemplateCode"

// 위험성 평가 양식 index component
const EvaluationTemplate = () => {
	useAxiosIntercepter()
    
    // tab을 위한 리덕스
	const criticalDisaster = useSelector((state) => state.criticalDisaster)
	const dispatch = useDispatch()
	const handleTab = (tab) => dispatch(setTemplateTab(tab))

    useEffect(() => {
		console.log(tabList)
	}, [tabList])
    return (
        <Fragment>
            <Row>
                <div className='d-flex justify-content-start'>
                    <Breadcrumbs breadCrumbTitle='위험성평가양식' breadCrumbParent='중대재해관리' breadCrumbParent2='위험성평가' breadCrumbActive='위험성평가양식' />
                </div>
            </Row>
            {/* 탭 */}
            <Row>
                <Col lg={8} md={9} xs={12}>
                    <Row>
                        {tabList && tabList.map(tab => {
                            return (
                                <Col lg={3} md={3} key={tab.value} className="mb-1">
                                    {console.log(tab)}
                                    <Button 
                                        color={criticalDisaster.templateTab === tab.value ? 'primary' : 'report'} 
                                        style={{width:'100%', padding:'0.7rem'}} 
                                        onClick={() => handleTab(tab.value)}>
                                            {tab.label}
                                    </Button>
                                </Col>
                            )
                        })}
                        {/* map end */}
                    </Row>
                </Col>
            </Row>
            { criticalDisaster.templateTab === 'list' ?
                <EvaluationTemplateList/>
                :
                <EvaluationTemplateCode/>
            }
        </Fragment>
    )
}
export default EvaluationTemplate