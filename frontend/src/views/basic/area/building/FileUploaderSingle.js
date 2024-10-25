// ** React Imports
import { Fragment } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'react-feather'
import { ReactComponent as Close } from '../../../../assets/images/close.svg'
import { sweetAlert } from '../../../../utility/Utils'
const FileUploaderSingle = (props) => {
	const {files, setFiles} = props
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
				return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='25' width='25' />
			} else {
				return <img className='rounded' alt={file.name} src={file} height='25' width='25' />
			}
		}
	}
	const onRemoveFile = (image) => {
		setFiles(files.filter(e => e !== image))
	}

  return (
	<Fragment>
		<div style={{display : 'flex', flexDirection : 'column'}}>
			<div {...getRootProps({ className: 'dropzone' })} style={{width:'100%', height:'265px', border : '1px dashed gray', display:'flex', justifyContent : 'center', alignItems : 'center'}}>
			<input name='img' {...getInputProps()} />
			<div className='d-flex align-items-center justify-content-center flex-column'>
				<Upload size={44}  style={{backgroundColor: '#DCDCDC', borderRadius : '6px'}}/>
				<h5 className='mt-1' style={{textAlign:'center'}}>드롭 또는 클릭하여 파일을 업로드 해주세요.</h5>
			</div>
			</div>
			<div className="form-control hidden-scrollbar mt-1" style={{height: '40px', display: 'flex', alignItems: 'center'}}>
				{
					files.length > 0 &&
					files.map((image, idx) => {
						return <div key={`email_${idx}`} style={{position: 'relative', paddingRight: '10px'}}>
									<div style={{position: 'absolute', width: '100%', height: '100%'}}>
										<div style={{display:'flex', flexDirection:'row-reverse', paddingRight: '4px'}}>
											<Close onClick={() => onRemoveFile(image)} style={{cursor: 'pointer'}} />
										</div>
									</div>
									{renderFilePreview(image)}
								</div>
					})
				}
			</div>
		</div>
	</Fragment>
  )
}

export default FileUploaderSingle
