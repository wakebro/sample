import { Col, Input, Label, Row } from "reactstrap"
import { handleFileInputLimitedChange } from "../../../utility/Utils"
import FileIconImages from "./FileIconImages"
import { useEffect, useState } from "react"

const InputFileUploader = (props) => {
    const {files, setFiles, showNames, setShowNames, pageType, label, limit} = props

    const [selectedFiles, setSelectedFiles] = useState([])

    const handleFileInputChange = (e) => {
        handleFileInputLimitedChange(e, files, setFiles, limit, showNames, setShowNames, setSelectedFiles)
    }

    const onRemoveFile = (file) => {
        const updatedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file)
        setSelectedFiles(updatedFiles)
        setFiles(updatedFiles)
    }

    const onPastRemoveFile = (file) => {
        setShowNames(showNames.filter((element) => element !== file))
    }

    useEffect(() => {
        const inputElement = document.getElementById("doc_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < files.length; i++) {
            dataTransfer.items.add(files[i])
        }
        inputElement.files = dataTransfer.files
    }, [files])

    return (
        <Row className='card_table'>
            <Col md='12'>
                <div className="mb-1">
                    { label ?
                        <Label className="risk-report text-bold">첨부파일</Label>
                        :
                        <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                            첨부파일
                        </Col>
                    }
                    <Input type="file" id="doc_file" name="doc_file"  bsSize='lg' multiple onChange={handleFileInputChange}  />
                </div>
                <div className="mb-1">
                    <div className='form-control hidden-scrollbar' style={{ height: '46.2px', display: 'flex', alignItems: 'center' }}>
                        {selectedFiles && selectedFiles.length > 0 &&
                            selectedFiles.map((file, idx) => {
                                const ext = file.name.split('.').pop()
                                return (
                                <span key={`file_${idx}`} className="mx-0 px-0">
                                    <FileIconImages
                                    ext={ext}
                                    file={file}
                                    filename={file.name}
                                    removeFunc={onRemoveFile}
                                    />
                                </span>
                                )
                            })
                        } 
                        { pageType === 'modify' && showNames && showNames.length > 0 && 
                            showNames.map((file, idx) => {
                                const ext = file.file_name.split('.').pop()
                                return (
                                <span key={idx} className="mx-0 px-0">
                                    <FileIconImages
                                    ext={ext}
                                    file={file}
                                    filename={file.original_file_name}
                                    removeFunc={onPastRemoveFile}
                                    />
                                </span>
                                )
                            })
                        }
                    </div>
                </div>
            </Col>
        </Row>
    )
}
export default InputFileUploader