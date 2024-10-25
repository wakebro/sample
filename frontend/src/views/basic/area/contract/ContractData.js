import * as yup from 'yup'
import axios from 'axios'
import { URL } from '../../../../constants'
import * as moment from 'moment'
import { primaryColor } from '../../../../utility/Utils'

export const ContractColumn = [
    // {
    //     name:'구분',
    //     selector: row => row.id,
    //     width: "6%"
    // },
    {
        name:'건물코드',
        cell: row => row.building
        // width: "10%"
    },
    {
        name:'현장명',
        // width: "25%",
        cell: row => row.name
    },
    {
        name:'계약금액',
        width: "10%",
        cell: row => <div id={row.id} style={{ width:'100%', textAlign: 'right' }}>{row.amount}</div>
    },
    {
        name:'연면적(평)',
        // width: "9%",
        cell: row => <div id={row.id} style={{ width:'100%', textAlign: 'right' }}>{row.area_total}</div>
    },
    {
        name:'계약기간',
        cell: row => <div style={{ width:'100%', textAlign:'center'}}>{row.start_date}</div>
    },
    {
        name:'관리형태',
        cell: row => <div style={{ width:'100%', textAlign:'center'}}>{row.manage}</div>
    },
    {
        name:'첨부파일',
        style: {justifyContent: 'left'},
        cell: row => {
            const handleDownload = (path, name, orangeName) => {
                axios({
                    url: `${URL}/static_backend/${path}${(name)}`,
                    method: 'GET',
                    responseType: 'blob'
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', `${orangeName}`)
                    document.body.appendChild(link)
                    link.click()
                })
            }
            return row.contract_files.map((file, i) => (
                <a key={file.id} id={file.id} onClick={() => handleDownload(file.path, file.file_name, file.original_file_name)} style={{ color: primaryColor, marginRight:'1.4%', display:'contents'}}>
                    [{i + 1}]&nbsp;
                </a>
            ))
        }

    }
]

export const defaultValues = {
    name: '',
    building: {label:'건물 선택', value:''},
    amount: '',
    area_total: '',
    date: [],
    manage: '',
    members: '',
    contract_date: '',
    description: ''
}

const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
export const validationSchemaInconv =  
    yup.object().shape({
        name: yup.string().matches(
            special_pattern, "특수문자가 포함되면 안됩니다").required('현장명을 입력해주세요.'),
        members: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).nullable(true),
        amount: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('계약금액을 입력해주세요.').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
        area_total: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
        manage: yup.string(),
        description: yup.string(),
        date: yup.array().test('isNonEmpty', '기간을 입력해주세요.', function(value) {
			return value && value.length > 0
		}),
        contract_date: yup.array().test('isNonEmpty', '기간을 입력해주세요.', function(value) {
			return value
		}).nullable()
    })

export const validationEditSchemaInconv =  
    yup.object().shape({
        name: yup.string().matches(
            special_pattern, "특수문자가 포함되면 안됩니다").required('현장명을 입력해주세요.!!'),
        members:yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).nullable(true),
        amount: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').required('계약금액을 입력해주세요.').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).matches(/^[^0]/, '1 이상 값을 입력해주세요.'),
        area_total: yup.string().matches(/^[\d,\.]+$/g, '숫자형태로 입력해주세요').transform((value, originalValue) => {
            if (originalValue === "") return '0'
            return value
        }).nullable(true),
        manage: yup.string(),
        description: yup.string(),
        date: yup.array().test('isNonEmpty', '기간을 입력해주세요.', function(value) {
            console.log("@@@@@@@@@", value)
			return value && value.length > 0
		})
    })

export const pageTypeKor = {
    register : '등록',
    modify : ' 수정'
}

export const SearchGetTableData = (API, param, setTableData) => {
    axios.get(API, {
        params: param
    })
    .then(res => {
        setTableData(res.data)
    })
    .catch(res => {
        console.log(API, res)
    })
}

/**
 * picker[1] 00:00:00 분으로 커스텀한 pickerChange
 * @param {*} picker picker value
 * @returns 
 */
export const pickerDateChangeCustom = (picker) => {
	const pickerlist = []
	pickerlist.push(moment(picker[0]).format('YYYY-MM-DD 00:00:00'))
	pickerlist.push(moment(picker[1]).format('YYYY-MM-DD 00:00:00'))
	return pickerlist
}