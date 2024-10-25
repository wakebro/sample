import axios from 'axios'
import * as yup from 'yup'
import {API_SPACE_BUILDING, API_SPACE_FLOOR} from '../../../../constants'
import { makeSelectList, handleDownload, primaryColor } from '../../../../utility/Utils'

export const defaultValue = {label:'전체', value:''}

export const drawingColumns = [
    {
        name:'건물',
        minWidth: '200px',
        cell: row => row.building
    },
    {
        name:'직종',
        width: '130px',
        cell: row => row.employee
    },
    {
        name:'도면명',
        cell: row => row.name,
        minWidth: '40%'
    },
    {
        name:'등록일',
        width:'150px',
        cell: row => row.create_datetime
    },
    {
        name:'작성자',
        width:'150px',
        cell: row => row.writer
    },
    {
        name:'첨부파일',
        style: {justifyContent: 'left'},
        width:'210px',
        cell: row => {
            return row.files.map((file, i) => (
                <a key={file.id} id={file.id} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)} style={{ color: primaryColor, textAlign: 'left', display:'contents'}}>[{i + 1}]&nbsp;</a>
            ))
        }
    }
]

export const formDefaultValues = {
    drawing_name: '',
    employeeClass: {value: '', label: '직종'},
    floorCode: {value: '', label: '층코드'},
    building: {value: '', label: '건물선택'}
}

export const validationSchema = yup.object().shape({
    drawing_name: yup.string().required('도면명을 입력해주세요.')
})

export const formApiObj = {
	buildings: API_SPACE_BUILDING,
	floors: API_SPACE_FLOOR
}

export const getDataList = (API, params, useState, setUseSate) => {
    axios.get(API, {params:params})
    .then(res => {
        makeSelectList(false, 'custom1', res.data, useState, setUseSate, ['code', 'name'], 'id')
    })
}
