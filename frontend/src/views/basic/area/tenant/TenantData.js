import axios from 'axios'

export const TenantColumn = [
    {
        name:'입주사명',
        selector: row => row.name
    },
    {
        name:'건물',
        selector: row => row.building
    },
    {
        name:'입실일자',
        selector: row => row.move_in_datetime
    },
    {
        name:'퇴실일자',
        selector: row => row.move_out_datetime
    },
    {
        name:'전용면적',
        selector: row => row.net_leasable_area
    },
    {
        name:'계약면적',
        selector: row => row.contract_area
    },
    {
        name:'임대면적',
        selector: row => row.leasable_area
    }
]

export const defaultValues = {
    code: '',
    building: {label:'건물전체', value:''},
    net_leasable_area: '',
    move_in_datetime: '',
    floor: {label:'층선택', value:''},
    contract_area: '',
    move_out_datetime: '',
    room: {label:'층선택', value:''},
    leasable_area: ''
}

export const pageTypeKor = {
	register : '등록',
	modify : ' 수정'
}

export const CustomGetTableData = (API, param, setData) => {
    console.log("API", API)
    axios.get(API, {
        params: param
    })
    .then(res => {
        console.log(res.data)
        setData(res.data)
        
    })
    .catch(res => {
        console.log(API, res)
    })
}