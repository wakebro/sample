/* eslint-disable */
import axios from '@utility/AxiosConfig'
import { Col, Row } from "reactstrap"
import { getTableDataCallback, getHeight } from "../../../utility/Utils"
import CheckBox from "./DefaultCheckBox"
import { useEffect, useRef, useState } from "react"
import { API_FIND_PROPERTY, API_SYSTEMMGMT_AUTH_PROPERTY } from "../../../constants"
import { useAxiosIntercepter } from "../../../utility/hooks/useAxiosInterceptor"
import Cookies from "universal-cookie"
import TableHeader from "./TableHeader"
import { ALL, FIRST } from '../data'

// // //첫 랜더링에서 effect 효과 막기
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false)
  
    useEffect(() => {
        if (didMount.current) func()
        else didMount.current = true
    }, deps)
}// useDidMountEffect end

// boolean find property
const isFindProperty = (propertyList, checkList, groupId) => {
    let isGroupCheck = false
    for (const prop of propertyList) { // 검색 방식 변경해야함. 비효율적
        if (prop.property_group === groupId) {
            if (!checkList.has(prop.value)) {
                isGroupCheck = false
                break
            }
            isGroupCheck = true
        }
    }
    return isGroupCheck
}

/** PropertyGroupCheckTable component를 사용할 컴포넌트에서 checkList state를 선언해서 넘겨줘야합니다.
 * checkList의 type은 Set입니다. 해당 Set을 backend로 보내서 후 처리 합니다.
 * @param {*} props 
 * @param {Set} checkList 부모 컴포넌트의 state
 * @param {} setCheckList 부모 컴포넌트의 state set method
 */
const PropertyGroupCheckTable = (props) => {
    const { checkList, setCheckList, purpose, user, customDpPropertyList, setCustomDpPropertyList, filterPropertyList, setFilterPropertyList, search } = props
    
    useAxiosIntercepter()
    const cookies = new Cookies()
    const activeUser = Number(cookies.get('userId'))
    const property_id = cookies.get("property").value

    // 처음 받아온 사업소 리스트
    const [propertyList, setPropertyList] = useState([])

    //  처음 받아온 사업소 그룹 리스트
    const [propGroupList, setPropGroupList] = useState([])
    
    // 보여질 사업소 리스트
    const [dpPropertyList, setDpPropertyList] = useState([])

    // 사업소 그룹 체크 set
    const [groupCheckList, setGroupCheckList] = useState(new Set())

    // 현재 선택중인 사업소 그룹
    const [propGroupActive, setPropGroupActive] = useState(ALL)

    // 권한 전체 적용
    const [authCheck, setAuthCheck] = useState({isOnlyView:false, detect:false})

    useEffect(() => { // backend에서 데이터는 한번 가져옴
        if (purpose === 'template') getTableDataCallback(API_FIND_PROPERTY, {group: true, user:activeUser}, getPropertyAndGroup) // 사업소 가져오는 리스트 api 변경
        else if (purpose === 'highProperty') getTableDataCallback(API_FIND_PROPERTY, {high: true, user:activeUser, property: property_id}, getPropertyAndGroup) // 사업소 가져오는 리스트 api 변경
        else if (purpose === 'list') getTableDataCallback(API_FIND_PROPERTY, {list: true, user:activeUser}, getPropertyAndGroup) // 사업소 가져오는 리스트 api 변경
        // else if (purpose === 'auth') getTableDataCallback(API_SYSTEMMGMT_AUTH_PROPERTY, {user_id:cookies.get('userId')}, getLoginAccountPropertyAndGroupAuth) // 사업소 가져오는 리스트 api 변경
    }, [])
    // useEffect end

    // get data callback func
    const getPropertyAndGroup = (data) => {
        setPropertyList(data.propList)
        setDpPropertyList(data.propList)
        setPropGroupList(data.propGroupList)
        if (purpose === 'highProperty') setPropGroupActive(data?.propGroupList[0]?.value)
    }

    // const getLoginAccountPropertyAndGroupAuth = (data) => {
    //     setPropGroupList(data.propGroupList)
    //     const tempList = data.propList
    //     getTableDataCallback(API_SYSTEMMGMT_AUTH_PROPERTY, {user_id:user.value}, (data) => {
    //         const temp = new Set()
    //         data.propList.map(row => temp.add(row.value))
    //         setCheckList(temp)

    //         const newDataList = []
    //         tempList.map(dataRow => {
    //             const getData = data.propList.filter(propRow => {
    //                 if (dataRow.value === propRow.value) return propRow
    //             })
    //             if (getData.length !== 0) {
    //                 const selectObj = {
    //                     value: getData[FIRST].value,
    //                     label: getData[FIRST].label,
    //                     is_only_view: getData[FIRST].is_only_view,
    //                     address: getData[FIRST].address,
    //                     property_group: getData[FIRST].property_group
    //                 }
    //                 newDataList.push(selectObj)
    //             } else {
    //                 const unSelectObj = {
    //                     value: dataRow.value,
    //                     label: dataRow.label,
    //                     is_only_view: dataRow.is_only_view,
    //                     address: dataRow.address,
    //                     property_group: dataRow.property_group
    //                 }
    //                 newDataList.push(unSelectObj)
    //             }
    //         })
    //         setCustomDpPropertyList(newDataList)
    //         setPropertyList(newDataList)
    //     })
    // }
    const getLoginAccountPropertyAndGroupAuth = (data) => {
        setPropGroupList(data.propGroupList)
        const tempList = data.propList
        const temp = new Set()
        data.propList.map(row => temp.add(row.value))
        setCheckList(temp)
        setCustomDpPropertyList(data.total)
        setPropertyList(data.total)
    }

    // check box 선택 이벤트 핸들러 property
    const checkedItemHandler = (id, isChecked, groupId) => {
        const tempSet = new Set(checkList) // copy

        if (isChecked) { // check가 되면 추가
            tempSet.add(id)
            setCheckList(tempSet) // checklist set
        } else if (!isChecked && checkList.has(id)) { // un check가 되면 삭제
            tempSet.delete(id)
            setCheckList(tempSet) // checklist set
        } // else if end
    } // checkedItemHandler end

    // property group check box 선택
    const checkedGroupHandler = (id, isChecked) => {
        const tempGroupSet = new Set(groupCheckList)
        const tempSet = new Set(checkList)

        if (isChecked) { // check가 되면 추가
            if (id === ALL) { // 전체 선택
                tempGroupSet.add(ALL)
                // 추후 코드
                for (const propGroup of propGroupList) {
                    if (!tempGroupSet.has(propGroup.value)) {
                        tempGroupSet.add(propGroup.value)
                    }
                }
                propertyList.forEach((prop) => { if (!tempSet.has(prop.value)) tempSet.add(prop.value)})
                setCheckList(tempSet)
                setGroupCheckList(tempGroupSet)
                return
            } // if end

            tempGroupSet.add(id) // 그룹 선택
            setGroupCheckList(tempGroupSet)

            propertyList.forEach((prop) => { 
                if (prop.property_group === id && !tempSet.has(prop.value)) {
                    tempSet.add(prop.value) 
                } 
            })
            setCheckList(tempSet)
        } else if (!isChecked && groupCheckList.has(id)) { // un check가 되면 삭제
            //temp
            if (id === ALL) { // 전체 해체
                setCheckList(new Set())
                setGroupCheckList(new Set())
                return
            } // if end

            tempGroupSet.delete(id) // 그룹 선택 해체
            setGroupCheckList(tempGroupSet) 

            propertyList.forEach((prop) => { 
                if (prop.property_group === id && tempSet.has(prop.value)) {
                    tempSet.delete(prop.value)
                }
            })
            setCheckList(tempSet)
        }
    } // checkedGroupHandler end

    const selectDpList = (purpose, isSet = false) => {
        switch (purpose) {
            case 'list':
            case 'template':
            case 'highProperty':
                if (isSet) return setDpPropertyList
                else return dpPropertyList
            case 'auth':
                if (isSet) return setCustomDpPropertyList
                else return search.value.length === 0 ? customDpPropertyList : filterPropertyList
        }
    }

    // 이름 클릭 이벤트
    const propertyGroupNameClick = (groupId) => {
        const setDpList = selectDpList(purpose, true)
        if (groupId === ALL) {
            setDpList(propertyList)
            setPropGroupActive(ALL)
            return
        }
        setPropGroupActive(groupId)
        const temp = propertyList.filter((prop) => prop.property_group === groupId)
        setDpList(temp)
    }

    // 사업소
    useDidMountEffect(() => { // 일단 합쳐서 구현하고 필요하면 나눔
        const tempGroupSet = new Set(groupCheckList)
        const tempSet = new Set(checkList)

        if (!tempGroupSet.has(ALL) && (tempSet.size === propertyList.length)) {
            tempGroupSet.add(ALL)
            setGroupCheckList(tempGroupSet)
        } else if (tempGroupSet.has(ALL) && (tempSet.size < propertyList.length)) {
            tempGroupSet.delete(ALL)
            setGroupCheckList(tempGroupSet)
        }

        for (const group of propGroupList) {
            if (isFindProperty(propertyList, tempSet, group.value)) {
                tempGroupSet.add(group.value)
                setGroupCheckList(tempGroupSet)
            } else if (!isFindProperty(propertyList, tempSet, group.value)) {
                tempGroupSet.delete(group.value)
                setGroupCheckList(tempGroupSet)
            }
        }
    }, [checkList, propertyList, propGroupList])

    useEffect(() => {
        if (purpose === 'auth' && authCheck.detect) {
            const tempList = []
            customDpPropertyList.map(dataRow => {
                if (checkList.has(dataRow.value)) {
                    tempList.push(
                        {value: dataRow.value,
                        label: dataRow.label,
                        is_only_view: authCheck.isOnlyView,
                        address: dataRow.address}
                    )
                } else {
                    tempList.push(dataRow)
                }
            })
            setCustomDpPropertyList(tempList)
            setPropertyList(tempList)
        }
    }, [authCheck])

    useEffect(() => {
        if (purpose === 'auth' && search.detect) {
            setPropGroupActive(ALL)
            let renewList = []
            if (filterPropertyList.length !== 0) {
                propertyList.map(rData => {
                    const getData = filterPropertyList.filter(fData => {
                        if (rData.value === fData.value) return rData
                    })
                    if (getData.length !== 0) {
                        renewList.push({
                            address: getData[FIRST].address,
                            is_only_view: getData[FIRST].is_only_view,
                            label: getData[FIRST].label,
                            value: getData[FIRST].value
                        })
                    } else renewList.push(rData)
                })
            } else renewList = [...propertyList]
            if (search.value !== '') {
                let filterDataTable = renewList.filter(dataRow => {
                    const includes = 
                    dataRow.label.toLowerCase().includes(search.value.toLowerCase())
                    return includes
                })
                setFilterPropertyList(filterDataTable)
                setPropertyList(renewList)
                setCustomDpPropertyList(renewList)
            } else setFilterPropertyList([])
        }
    }, [search])

    useEffect(() => {
        // if (purpose === 'auth') getTableDataCallback(API_SYSTEMMGMT_AUTH_PROPERTY, {user_id:cookies.get('userId')}, getLoginAccountPropertyAndGroupAuth)
        if (purpose === 'auth') getTableDataCallback(API_SYSTEMMGMT_AUTH_PROPERTY, {user_id:user.value}, getLoginAccountPropertyAndGroupAuth)
    }, [user])

    return (
        <>
            <Row className="mx-0">
                <Col>
                    <Row>
                        <TableHeader purpose={purpose} check={authCheck} setCheck={setAuthCheck}/>
                    </Row>
                    <Row>
                        <Col xs={3} md={3} className="card_table overflow-Y mid border-bottom-left-radius text start border-left risk-report text-bold"
                            style={{height: getHeight(purpose)}}>
                            { purpose !== 'highProperty' ?
                                <Row className="my-1">
                                    <CheckBox // xs md lg 만 선언 가능
                                        xs={12}
                                        data={{label: '전체', value:ALL}}
                                        checkedItemHandler={checkedGroupHandler}
                                        checkList={checkList}
                                        groupCheckList={groupCheckList}
                                        propGroupActive={propGroupActive}
                                        setPropGroupActive={setPropGroupActive}
                                        propertyList={propertyList}
                                        nameClick={() => propertyGroupNameClick(0)} // 해당 param 으로 구분
                                    />
                                </Row>
                                :
                                <div className='my-1'></div>
                            }
                            { propGroupList && propGroupList.length > 0 ?
                                <>
                                    {
                                        (purpose === 'auth' && search.detect && search.value !== '') ? 
                                            <></>
                                        :
                                            propGroupList.map((group, index) => (
                                                <Row key={index} className="mb-1">
                                                    <CheckBox // xs md lg 만 선언 가능
                                                        xs={12}
                                                        data={group}
                                                        checkedItemHandler={checkedGroupHandler}
                                                        checkList={checkList}
                                                        groupCheckList={groupCheckList}
                                                        propGroupActive={propGroupActive}
                                                        setPropGroupActive={setPropGroupActive}
                                                        propertyList={propertyList}
                                                        nameClick={() => propertyGroupNameClick(group.value)} // 해당 param 으로 구분
                                                    />
                                                </Row>
                                            ))}
                                </>
                                :
                                <></>
                            }
                        </Col>
                        <CheckBox
                            xs={3}
                            checkedItemHandler={checkedItemHandler}
                            checkList={checkList}
                            purpose={purpose}
                            dpPropertyList={selectDpList(purpose)}
                            setDpPropertyList={setDpPropertyList}
                        />
                    </Row>
                </Col>
            </Row>
        </>

    )
}
export default PropertyGroupCheckTable