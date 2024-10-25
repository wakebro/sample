import { Fragment, useEffect } from "react"
import { handleFileInputLimitedChange } from "../../../../../../../../utility/Utils"
import { Col, Input, Row } from "reactstrap"
import FileIconImages from "../../../../../../../apps/customFiles/FileIconImages"

const PartnerFile = (props) => {
    const {
        partnerFiles, setPartnerFiles,
        showNames, setShowNames,
        criticalDisaster
    } = props

    const onPastRemoveFile = (file) => {
        setShowNames(showNames.filter((element) => element !== file))
    }

    const handlePartnerFileInputChange = (e) => {
        handleFileInputLimitedChange(e, partnerFiles, setPartnerFiles, 1, showNames, setShowNames)
    }

    const onRemoveFile = (file) => {
        const updatedFiles = partnerFiles.filter((selectedFile) => selectedFile !== file)
        setPartnerFiles(updatedFiles)
    }

    useEffect(() => {
        const inputElement = document.getElementById("pratner_file")
        inputElement.value = ""
        
        const dataTransfer = new DataTransfer()
        for (let i = 0; i < partnerFiles.length; i++) {
            dataTransfer.items.add(partnerFiles[i])
        }
        inputElement.files = dataTransfer.files
    }, [partnerFiles])

    return (
        <Fragment>
            <Row className="card_table" style={{borderTop: '1px solid #dae1e7'}}>
                <div className="mb-1 mt-1">
                    <Col className='card_table col text' style={{ paddingTop:0, paddingBottom:'1%'}}>
                        첨부파일
                    </Col>
                    <Input type="file" id="pratner_file" name="pratner_file"  bsSize='lg' accept="image/*" multiple onChange={handlePartnerFileInputChange}/>
                </div>
                <div className="mb-1">
                    <div className='form-control hidden-scrollbar' style={{ height: '46.2px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto' }}>
                        {partnerFiles && partnerFiles.length > 0 &&
                            partnerFiles.map((file, idx) => {
                                const fileName = file.name ? file.name : file.original_file_name
                                const ext = fileName.split('.').pop()
                                return (
                                    <span key={`file_${idx}`} className="mx-0 px-0">
                                        <FileIconImages
                                            ext={ext}
                                            file={file}
                                            filename={fileName}
                                            removeFunc={onRemoveFile}
                                        />
                                    </span>
                                )
                                })
                        } 
                        { criticalDisaster !== '' && showNames && showNames.length > 0 && 
                            showNames.map((file, idx) => {
                                const ext = file.name.split('.').pop()
                                return (
                                    <span key={idx} className="mx-0 px-0">
                                    <FileIconImages
                                        ext={ext}
                                        file={file}
                                        filename={file.name}
                                        removeFunc={onPastRemoveFile}
                                    />
                                    </span>
                                )
                            })
                        }
                    </div>
                </div>
            </Row>
        </Fragment>
    )
}

export default PartnerFile