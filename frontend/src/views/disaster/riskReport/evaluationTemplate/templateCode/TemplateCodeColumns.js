import { Button, Input } from "reactstrap"
import { useAxiosIntercepter } from "../../../../../utility/hooks/useAxiosInterceptor"
import { axiosDeleteCallback, axiosPostPutCallback, checkOnlyView, getObjectKeyCheck, sweetAlert } from "../../../../../utility/Utils"
import { API_DISASTER_TEMPLATE_EVALUATION_DETAIL, API_DISASTER_TEMPLATE_EVALUATION_REG } from "../../../../../constants"
import { useState } from "react"
import { useSelector } from "react-redux"
import { CRITICAL_EVALUATION_TEMPLATE } from "../../../../../constants/CodeList"

// name input component
const NameInputCol = (props) => {
    const { row } = props
    const [elementName, setElementName] = useState(row.name)
    const handleInputOnChange = (e) => {
        row['name'] = e.target.value
        setElementName(row['name'])
    }
    if (getObjectKeyCheck(row, 'rowType') === 'register' || getObjectKeyCheck(row, 'rowType') === 'modify') {
        return (
            <>
                <Input
                    value={elementName}
                    onChange={handleInputOnChange}
                />
            </>
        )
    }
    return (
        <> 
            {elementName}
            {/* 테스트용:{index} {row.id} */}
        </>
    )
}

// reg mod button component
const RegModDelButtonCol = (props) => {
    const { row, type, index, regCancel, render, setRender } = props
    useAxiosIntercepter()
    const loginAuth = useSelector((state) => state.loginAuth)

    const tableTitle = type === 0 ? '세부작업 명' : '위험분류'
    const tableName = type === 0 ? '세부작업 명이' : '위험분류가'
    const tableHtml = type === 0 ? '세부작업 명을' : '위험분류를'

    const regModCallback = (id) => {
        row['dbId'] = id
        setRender(!render) // 강제 랜더링
    }

    const delCallback = (index) => {
        regCancel(index)
        setRender(!render) // 강제 랜더링
    }

    const handleRegOnclick = () => { // reg event
        if (row.name === '') {
            sweetAlert(`${tableTitle} 미 입력`, `${tableName} 공백입니다. <br/>${tableHtml} 입력 해주세요.`, 'warning', 'center')
            return
        }
        const formData = new FormData()
        formData.append('name', row.name)
        formData.append('type', type)
        const API = row['rowType'] === 'register' ? API_DISASTER_TEMPLATE_EVALUATION_REG : `${API_DISASTER_TEMPLATE_EVALUATION_DETAIL}/${row.dbId}`
        axiosPostPutCallback(row['rowType'], tableTitle, API, formData, regModCallback)
        row['rowType'] = ''
        setRender(!render) // 강제 랜더링
    }
    const handleRegCancelOnClick = (index) => {
        if (getObjectKeyCheck(row, 'rowType') === 'modify') {
            row['rowType'] = ''
            setRender(!render) // 강제 랜더링
            return
        }
        regCancel(index)
    }

    const handleModOnClick = () => {
        row['rowType'] = 'modify' 
        setRender(!render) // 강제 랜더링
    }

    const handleDelOnClick = () => {
        axiosDeleteCallback(tableTitle, `${API_DISASTER_TEMPLATE_EVALUATION_DETAIL}/${row.dbId}`, delCallback, index)
    }

    if (getObjectKeyCheck(row, 'rowType') === 'register' || getObjectKeyCheck(row, 'rowType') === 'modify') {
        return (
            <div>
                <Button color="primary" className="me-1" onClick={() => { handleRegOnclick(index) }}>
                    저장
                </Button>
                <Button outline color="report" onClick={() => { handleRegCancelOnClick(index) }}>
                    취소
                </Button>
            </div>
        )
    }
    return (
        <div>
            <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_update')} outline color="primary" className="me-1" onClick={handleModOnClick}>
                수정
            </Button>
            <Button hidden={checkOnlyView(loginAuth, CRITICAL_EVALUATION_TEMPLATE, 'available_delete')} color="danger" onClick={handleDelOnClick}>
                삭제
            </Button>
        </div>
    )
}

// datatable columns func
const TemplateCodeColumns = (props) => {
    const { type, data, setData } = props
    const [render, setRender] = useState(false)

    // insert prototype
    Array.prototype.insert = function (index, ...items) {
        this.splice(index, 0, ...items)
    }
    // delete prototype
    Array.prototype.delete = function (index) {
        this.splice(index, 1)
    }

    const handleRegCancelClick = (index) => {
        const copyData = [...data]
        copyData.delete(index)
        setData(copyData)
    }

    if (type === 'detail') {
        const templateDetailCodeColumns = [
            {
                name: '세부 작업명',
                cell: (row, index) => (
                    <NameInputCol
                        row={row}
                        index={index}
                        render={render}
                        setRender={setRender}
                    />
                ),
                sortable: false,
                style: {
                    justifyContent:'left'
                }
            },
            {
                name: '편집',
                cell: (row, index) => (
                    <RegModDelButtonCol
                        row={row}
                        index={index}
                        type={0}
                        regCancel={handleRegCancelClick}
                        render={render}
                        setRender={setRender}
                    />
                ),
                sortable: false,
                maxWidth: '250px',
                style: {
                    justifyContent:'center'
                }
            }
        ]
        return templateDetailCodeColumns
    }

    const templateDangerCodeColumns = [
        {
            name: '위험 분류',
            cell: (row, index) => (
                <NameInputCol
                    row={row}
                    index={index}
                    render={render}
                    setRender={setRender}
                />
            ),
            sortable: true,
            style: {
                justifyContent:'left'
            }
        },
        {
            name: '편집',
            cell: (row, index) => (
                <RegModDelButtonCol
                    row={row}
                    index={index}
                    type={1}
                    regCancel={handleRegCancelClick}
                    render={render}
                    setRender={setRender}
                />
            ),
            sortable: false,
            maxWidth: '30%',
            style: {
                justifyContent:'center'
            }
        }
    ]
    return templateDangerCodeColumns
}
export default TemplateCodeColumns