// ** React Imports
import { Fragment, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'react-feather'
import { ReactComponent as Close } from '../../../../assets/images/close.svg'
import { sweetAlert } from '../../../../utility/Utils'

const FileUploader = (props) => {
	const {files, setFiles, updatedfilename, setClickDeleteOriginFile} = props
	const [showoriginfile, setShowOriginFile] = useState(false)

	const { getRootProps, getInputProps } = useDropzone({
		multiple: false,
		maxSize : 2000000,
		onDrop: acceptedFiles => {
			if (acceptedFiles.length !== 0) {
				if (acceptedFiles[0].type.startsWith('image')) {
					setFiles([...acceptedFiles.map(file => Object.assign(file))])
				} else {
					sweetAlert('', '이미지를 업로드 해주세요.', 'warning', 'center')
				}
			} else {
				sweetAlert('', "20MB 이하의 이미지를 업로드 하세요", 'warning', 'center')
			}

		}
	})

	const renderFilePreview = file => {
		if (file !== null) {
			if (file.type !== undefined) {
				return <div>{file.name}</div>
			} else {
				return <div>{file.name}</div>
			}
		}
	}
	const onRemoveFile = (image) => {
		setFiles(files.filter(e => e !== image))
	}

	const onRemoveOriginFile = () => {
		setClickDeleteOriginFile(true)
		setShowOriginFile(true)
	}

  return (
	<Fragment>
		<div {...getRootProps({ className: 'dropzone' })} style={{width:'100%', height:'265px', border : '1px dashed gray', display:'flex', justifyContent : 'center', alignItems : 'center'}}>
		  <input name='img' {...getInputProps()} />
		  <div className='d-flex align-items-center justify-content-center flex-column'>
			<Upload size={44}  style={{backgroundColor: '#DCDCDC', borderRadius : '6px'}}/>
			<h5 className='mt-1'>드롭 또는 클릭하여 이미지를 업로드 해주세요.</h5>
		  </div>
		</div>
		{updatedfilename && files.length === 0 && showoriginfile === false  ? (
  // updatedfilename이 존재하는 경우 실행될 코드
<div className="form-control hidden-scrollbar mt-1" style={{height: '40px', display: 'flex', alignItems: 'center'}}>	
				<div style={{position: 'relative', paddingRight: '10px'}}>
				<div style={{position: 'absolute', width: '100%', height: '100%'}}>
					<div style={{display: 'flex', flexDirection: 'row-reverse'}}>
					<Close onClick={onRemoveOriginFile} style={{cursor: 'pointer'}} />
					</div>
				</div>
					<div>{updatedfilename}</div>
				</div>
		</div>
				) : (
		// updatedfilename이 존재하지 않는 경우 실행될 코드
		<div className="form-control hidden-scrollbar mt-1" style={{height: '40px', display: 'flex', alignItems: 'center'}}>
			{files.length > 0 &&
			files.map((image, idx) => (
				<div key={`email_${idx}`} style={{position: 'relative', paddingRight: '10px'}}>
				<div style={{position: 'absolute', width: '100%', height: '100%'}}>
					<div style={{display: 'flex', flexDirection: 'row-reverse'}}>
					<Close onClick={() => onRemoveFile(image)} style={{cursor: 'pointer'}} />
					</div>
				</div>
				{renderFilePreview(image)}
				</div>
			))}
		</div>
		)}
	</Fragment>
  )
}

export default FileUploader
