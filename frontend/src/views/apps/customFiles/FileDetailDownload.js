import { Col, Row } from 'reactstrap'
import { handleDownload } from '../../../utility/Utils'

const FileDetailDownload = (props) => {
    const { detailFiles } = props
    return (
        <Row className='card_table' style={{marginBottom:'1%'}}>
            <Col style={{borderTop: '3px dotted #ccc'}}>
                {detailFiles && 
                    <Col lg='4' md='4' xs='4' className='card_table col text' style={{fontSize:'18px'}}>
                        첨부파일 {detailFiles.length}
                    </Col>
                }
                    {detailFiles && detailFiles.map((file, idx) => {
                        let imagePath
                        try {
                        imagePath = require(`../../../assets/images/icons/${file.original_file_name.split('.').pop()}.png`).default
                        } catch (error) {
                        imagePath = require('../../../assets/images/icons/unknown.png').default
                        }
                        return (
                            <div key={idx}>
                                <a onClick={() => handleDownload(`${file.path}${file.file_name}`, file.original_file_name)}>
                                    <img src={imagePath} width='16' height='18' className='me-50' />
                                    <span className='text-muted fw-bolder align-text-top'>
                                        {file.original_file_name}
                                    </span>
                                </a>
                            </div>
                        )
                    })}
            </Col>
        </Row>
    )
}
export default FileDetailDownload
