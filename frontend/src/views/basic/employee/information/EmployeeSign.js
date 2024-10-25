import { sweetAlert } from "@utils"

import { Fragment } from "react"
import { useDropzone } from 'react-dropzone'
import { Col } from "reactstrap"

import { ReactComponent as Close } from '../../../../assets/images/close.svg'

const EmployeeSign = (props) => {
	const {signFile, setSignFile} = props

	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		maxSize : 2000000,
		onDrop: acceptedFiles => {
			if (acceptedFiles.length !== 0) {
				if (acceptedFiles[0].type.startsWith('image')) {
					setSignFile([...acceptedFiles.map(file => Object.assign(file))])
				} else {
					sweetAlert('', '이미지를 업로드 해주세요.', 'warning', 'center')
				}
			} else {
				sweetAlert('', "20MB 이하의 이미지를 업로드 하세요", 'warning', 'center')
			}

		}
	})

	const onRemoveFile = (image) => {
		setSignFile(signFile.filter(e => e !== image))
	}

	const renderFilePreview = file => {
		if (file !== null) {
			if (file.type !== undefined) {
				return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='25' width='25' />
			} else {
				return <img className='rounded' alt={file.name} src={file} height='25' width='25' />
			}
		}
	}

	return (
		<Fragment>
			<Col xs={8} style={{padding:0}}>
				<div {...getRootProps({ className: 'dropzone' })} 
					style={{width:'100%', height:'40px', display:'flex', justifyContent:'center', alignItems:'center', border:'1px solid #d8d6de', borderRadius:'0.357rem 0 0 0.357rem', cursor:'pointer'}}>
					<input style={{width:'100%'}} name='img' {...getInputProps()} />
					<div>사인 선택</div>
				</div>
			</Col>
			<Col xs={4} style={{padding:0}}>
				<div className="form-control hidden-scrollbar" 
					style={{height: '40px', display: 'flex', alignItems: 'center', borderLeft:'none', borderRadius:'0 0.357rem 0.357rem 0'}}>
					{
						signFile.length > 0 &&
						signFile.map((image, idx) => {
							return (
								<div key={`email_${idx}`} style={{position: 'relative', paddingRight: '10px'}}>
									<div style={{position: 'absolute', width: '100%', height: '100%'}}>
										<div style={{display:'flex', flexDirection:'row-reverse', paddingRight: '4px'}}>
											<Close onClick={() => onRemoveFile(image)} style={{cursor: 'pointer'}} />
										</div>
									</div>
									{renderFilePreview(image)}
								</div>
							)
						})
					}
				</div>
			</Col>
		</Fragment>
	)
}

export default EmployeeSign