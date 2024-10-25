/* eslint-disable */
import { Fragment } from "react"
import { Table } from "reactstrap"
import { getObjectKeyCheck } from "../../../../../utility/Utils"
import { FrequencyTableHeader, StepCheckTableHeader } from "../EvaluationItem"

// 빈도 강도
const Frequency = (props) => { // 빈도강도
    const { 
        index, indexValue
    } = props

    return (
        <Fragment>
            <tr>
                <td className="risk-report select-p-x text-center">
                    {index+1}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'inputDetail')}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'selectDanger').label}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'frequency').label}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'strength').label}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'inputResult')}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'inputReason')}
                </td>
            </tr>
        </Fragment>
    )
}

// 체크리스트 / 단계
const StepCheckListItem = (props) => { // 3단계, 체크리스트
    const { index, indexValue } = props

    return (
        <Fragment>
            <tr>
                <td className="risk-report select-p-x text-center">
                    {index+1}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'inputResult')}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'frequency').label}
                </td>
                <td className="risk-report select-p-x text-center">
                    {getObjectKeyCheck(indexValue, 'inputReason')}
                </td>
            </tr>
        </Fragment>
    )
}

// 항목 요소 list
const EvaluationItemDetail = (props) => {
    const { itemList, type } = props // 추후 useForm 내려 받아서 관리
    return (
        <Fragment>
            <Table responsive className="mb-2 electric-table">
                <thead>
                    { type ==='frequency' ? 
                        <FrequencyTableHeader
                            pageType={'detail'}
                        />
                        :
                        <StepCheckTableHeader
                            pageType={'detail'}
                        />
                    }
                </thead>
                <tbody>
                    {itemList.map((value, index) => {
                        return (
                            <Fragment key={value}>
                                { type ==='frequency' ? 
                                    <Frequency
                                        index={index}
                                        indexValue={value}
                                        itemList={itemList}
                                    />
                                    :
                                    <StepCheckListItem
                                        index={index}
                                        indexValue={value}
                                        itemList={itemList}
                                    />
                                }
                            </Fragment>
                        )
                    })}
                </tbody>
            </Table>
        </Fragment>
    )
}

export default EvaluationItemDetail