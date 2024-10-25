import * as yup from 'yup'
import { handleDownload, primaryColor } from '../../../utility/Utils'

export const ArchiveColumn = [
    {
        name: '직종',
        width:'100px',
        style: {justifyContent: 'left'}, 
        selector: row => row.employee_class
    },
    {
        name:'제목',
        style: {justifyContent: 'left'}, 
        minwidth:'31%',
        selector: row => row.subject
    },
    { 
        name:'첨부파일',
        style: {justifyContent: 'left'},
        minwidth:'20%',
        selector: row => {
            return row.archive_files.map((file, i) => (
                <a key={file.id} id={file.id} onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)} style={{ color: primaryColor, marginRight:'1.4%',  textAlign: 'left', display:'contents'}}>[{i + 1}]&nbsp;</a>
                ))
            }
            
        },
        {
            name:'등록일',
            width:'150px',
            selector: row => row.create_datetime
        },
        {
            name:'작성자',
            width:'100px',
            cell: row => row.user
        }
]

export const pageTypeKor = {
	register : '등록',
	modify : ' 수정'
}

export const defaultValues = {
    subject: '',
    contents: '',
    employee_class: {label:'선택', value:''}
}

export const validationSchemaInconv =  
    yup.object().shape({
        subject: yup.string().required('제목을 입력해주세요.'),
        contents: yup.string().required('내용을 입력해주세요.')
    })