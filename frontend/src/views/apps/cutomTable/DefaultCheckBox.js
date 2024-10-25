import { Col, Input, Label, Row } from "reactstrap"
import { getObjectKeyCheck, getHeight } from "../../../utility/Utils"
import { useEffect, useState } from "react"

const DefaultCheckBox = (props) => {
    const { 
        xs, md, lg,
        data, 
        checkedItemHandler, 
        nameClick,
        checkList,
        groupCheckList,
        propGroupActive,
        propertyList,
        purpose,
        dpPropertyList,
        setDpPropertyList
    } = props

    // check box 이벤트 핸들러
    const checkHandler = (value, target, group) => {
        checkedItemHandler(value, target.checked, group)
    }

    const handleRadioboxClick = (row, value) => {
		const copyDataList = [...dpPropertyList]
		copyDataList.map(data => {
			if (data.value === row.value) data.is_only_view = value
		})
		setDpPropertyList(copyDataList)
	}

    if (nameClick) { // 사업소 그룹 일때
        const [active, setActive] = useState('')
        const localList = propertyList.filter((prop) => prop.property_group === data.value) // 해당 그룹의 사업소
        const maxlength = data.value === 0 ? propertyList.length : localList.length // 해당 그룹의 최대 사업소 갯수
        const currLength = data.value === 0 ?  // 해당 그룹의 선택된 사업소 갯수
            propertyList.filter((prop) => (checkList.has(prop.value))).length 
            : 
            localList.filter((prop) => (checkList.has(prop.value))).length

        // 이름 클릭시 active 표시
        useEffect(() => {
            if (propGroupActive === data.value) { // 현재의 액티브 id와 해당 컴포넌트의 사업소 그룹 id가 같다면 active표시
                setActive('group-active')
                return
            }
            setActive('')// 아니라면 공란으로 active 표시 풀기
        }, [propGroupActive])

        return (
            <Col xs={xs} md={md} lg={lg} className="my-0 py-0">
                <div className={`group ${active}`} onClick={nameClick}>
                    <Input type="checkbox" className="custom-checkbox form-check-input:checked" id={data.value} name="inputProperty" checked={groupCheckList.has(data.value)}  onChange={(e) => checkHandler(data.value, e.target, data.property_group)}/>
                    <span>
                        <span className={`me-2 card_table text number`}> {getObjectKeyCheck(data, 'label')}</span>
                        <span>{`(${currLength} / ${maxlength})`}</span>
                    </span>
                </div>
            </Col>
        )
    // 사업소 그룹 end 
    } else {
        if (purpose === 'auth') {
            return (
                <Col xs={9} md={9} className="card_table overflow-Y mid text start risk-report text-bold" style={{height:getHeight(purpose)}}>
                        {
                            dpPropertyList.length > 0 ? dpPropertyList.map((data, index) => (
                                <Row key={index}>
                                    <Col xs={4} md={4} className="card_table mid border-bottom-right text start" style={{padding:'10px'}}>
                                        <Input type="checkbox" id={data.value} name="inputProperty" checked={checkList.has(data.value)}  onChange={(e) => checkHandler(data.value, e.target, data.property_group)}/>
                                        <span className="card_table text number"> {getObjectKeyCheck(data, 'label')}</span>
                                    </Col>
                                    <Col xs={4} md={4} className="card_table mid border-bottom-right text center" style={{padding:'10px'}}>
                                        <Row style={{justifyContent:'center'}} className='demo-inline-spacing'>
                                            <Col style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                <Input id='is_only_view_true' value={true} type='radio' 
                                                checked={data.is_only_view === true}
                                                disabled={ !(checkList.has(data.value)) }
                                                onChange={() => handleRadioboxClick(data, true)}
                                                />
                                                <Label className='form-check-label' for='is_only_view_true' style={{paddingLeft:'1rem'}}>
                                                    내용 조회
                                                </Label>
                                            </Col>
                                            <Col style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                                                <Input id='is_only_view_false' value={false} type='radio' 
                                                checked={data.is_only_view === false}
                                                disabled={ !(checkList.has(data.value)) }
                                                onChange={() => handleRadioboxClick(data, false)}
                                                />
                                                <Label className='form-check-label' for='is_only_view_true' style={{paddingLeft:'1rem'}}>
                                                    모든 기능
                                                </Label>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xs={4} md={4} className="card_table mid border-bottom-right text start" style={{padding:'10px'}}>
                                        <div style={{width:'100%'}}>{data.address}</div>
                                    </Col>
                                </Row>
                            ))
                            :
                            <></>
                        }
                </Col>
            )
        } else {
            return (
                <Col xs={9} md={9} className="card_table overflow-Y mid border-bottom-right-radius text start risk-report text-bold">
                    {
                        dpPropertyList.length > 0 ? dpPropertyList.map((data, index) => (
                            index % 4 === 0 && (
                                <Row className="my-1" key={index}>
                                    <Col xs={xs} md={md} lg={lg}>
                                        <Input type="checkbox" id={data.value} name="inputProperty" checked={checkList.has(data.value)}  onChange={(e) => checkHandler(data.value, e.target, data.property_group)}/>
                                        <span className="card_table text number"> {getObjectKeyCheck(data, 'label')}</span>
                                    </Col>
                                    {getObjectKeyCheck(dpPropertyList[index + 1], 'label') !== '' &&
                                        <Col xs={xs} md={md} lg={lg}>
                                            <Input type="checkbox" id={dpPropertyList[index + 1].value} name="inputProperty" checked={checkList.has(dpPropertyList[index + 1].value)}  onChange={(e) => checkHandler(dpPropertyList[index + 1].value, e.target, dpPropertyList[index + 1].property_group)}/>
                                            <span className="card_table text number"> {getObjectKeyCheck(dpPropertyList[index + 1], 'label')}</span>
                                        </Col>
                                    }
                                    {getObjectKeyCheck(dpPropertyList[index + 2], 'label') !== '' &&
                                        <Col xs={xs} md={md} lg={lg}>
                                            <Input type="checkbox" id={dpPropertyList[index + 2].value} name="inputProperty" checked={checkList.has(dpPropertyList[index + 2].value)}  onChange={(e) => checkHandler(dpPropertyList[index + 2].value, e.target, dpPropertyList[index + 2].property_group)}/>
                                            <span className="card_table text number"> {getObjectKeyCheck(dpPropertyList[index + 2], 'label')}</span>
                                        </Col>
                                    }
                                    {getObjectKeyCheck(dpPropertyList[index + 3], 'label') !== '' &&
                                        <Col xs={xs} md={md} lg={lg}>
                                            <Input type="checkbox" id={dpPropertyList[index + 3].value} name="inputProperty" checked={checkList.has(dpPropertyList[index + 3].value)}  onChange={(e) => checkHandler(dpPropertyList[index + 3].value, e.target, dpPropertyList[index + 3].property_group)}/>
                                            <span className="card_table text number"> {getObjectKeyCheck(dpPropertyList[index + 3], 'label')}</span>
                                        </Col>
                                    }
                                </Row>
                            )
                        ))
                        :
                        <></>
                    }
                </Col>
            )
        }
    }
}

export default DefaultCheckBox
