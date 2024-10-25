import * as yup from 'yup'
import { handleDownload, primaryColor } from '../../../utility/Utils'

export const AnnouncementColumn = [
    {
        name:'사업소',
        width:'150px',
        cell: row => row?.property_name,
        conditionalCellStyles: [
            {
                when: row => row.is_notice,
                style: {
                    fontWeight: '900',
                    color: 'black',
                    backgroundColor: 'rgba(212, 212, 212, 0.45)'
                }
            }
        ]
    },
    {
        name:'제목',
        cell: row => {
            console.log(row)
            if (row.is_notice) {
                return (
                    `[중요] ${row.subject}`
                )   
            }
            return (
                row.subject
            )
        },
        conditionalCellStyles: [
            {
                when: row => row.is_notice,
                style: {
                    fontWeight: '900',
                    color: 'black',
                    backgroundColor: 'rgba(212, 212, 212, 0.45)'
                }
            }
        ]
    },
    {
        name:'등록일',
        width:'150px',
        cell: row => row.create_datetime,
        conditionalCellStyles: [
            {
                when: row => row.is_notice,
                style: {
                    fontWeight: '900',
                    color: 'black',
                    backgroundColor: 'rgba(212, 212, 212, 0.45)'
                }
            }
        ]
    },
    {
        name:'작성자',
        width:'100px',
        cell: row => row.user,
        conditionalCellStyles: [
            {
                when: row => row.is_notice,
                style: {
                    fontWeight: '900',
                    color: 'black',
                    backgroundColor: 'rgba(212, 212, 212, 0.45)'
                }
            }
        ]
    },
    {
        name:'첨부파일',
        style: {justifyContent: 'left'},
        width:'20rem',
        cell: row => {
            return row?.announcement_files?.map((file, i) => (
                <a 
                    key={file.id} 
                    id={file.id} 
                    className='risk-report button-mx-1' 
                    onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)} style={{ color: primaryColor, textAlign: 'left'}}
                    >
                        [{i + 1}]&nbsp;
                </a>
            ))
        },
        conditionalCellStyles: [
            {
                when: row => row.is_notice,
                style: {
                    fontWeight: '900',
                    backgroundColor: 'rgba(212, 212, 212, 0.45)'
                }
            }
        ]

    }
]

export const pageTypeKor = {
	register : '등록',
	modify : ' 수정'
}

export const defaultValues = {
    subject: '',
    contents: ''
}

//const special_pattern = /^[^!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/
//matches(special_pattern, "특수문자가 포함되면 안됩니다")
export const validationSchemaInconv =  
    yup.object().shape({
        subject: yup.string().required('제목을 입력해주세요.')
        // contents: yup.string().required('내용을 입력해주세요.')
    })