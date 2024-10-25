// ** React Imports
import { Fragment } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'react-feather'
import { sweetAlert } from '@utils'
import FileIconImages from './FileIconImages'

const ImageFileUploaderMulti = (props) => {
	const {files, setFiles, fileNumLimit, fileMaxSize, sizeOverMessage, saveCheckFunc} = props

	const { getRootProps, getInputProps } = useDropzone({
		multiple: true,
		maxSize : fileMaxSize, //20000000
		onDrop: acceptedFiles => {
			if (acceptedFiles.length !== 0) {
                const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image'))
                if (imageFiles.length < 0 || acceptedFiles.length !== imageFiles.length) { // 업로드 파일이 이미지가 아닐경우
                    sweetAlert('', '이미지를 업로드 해주세요.', 'warning', 'center')
                    return
                }

                const totalLength = files.length + acceptedFiles.length
                if (totalLength > fileNumLimit) { // 업로드 할 이미지가 3개 이상인 경우
                    sweetAlert('', `최대 ${fileNumLimit}장의 사진까지 업로드가 가능합니다.`, 'warning', 'center')
                    return
                }

                // 중복 제거
                const resultArray = [
                    ...files,
                    ...acceptedFiles.map(file => Object.assign(file))
                ]
				if (saveCheckFunc) saveCheckFunc(false)
                setFiles(resultArray)
			} else {
                sweetAlert('', sizeOverMessage, 'warning', 'center')
			}
		} // onDrop end
	})//useDropzone end

	const onRemoveFile = (image) => {
		if (saveCheckFunc) saveCheckFunc(false)
		setFiles(files.filter(e => e !== image))
	}

	return (
	<Fragment>
		<div {...getRootProps({ className: 'dropzone' })} style={{width:'100%', height:'265px', border : '1px dashed gray', display:'flex', justifyContent : 'center', alignItems : 'center'}}>
			<input name='img' {...getInputProps()} />
			<div className='d-flex align-items-center justify-content-center flex-column'>
				<Upload size={44}  style={{backgroundColor: '#DCDCDC', borderRadius : '6px'}}/>
				<h5 className='mt-1'style={{textAlign:'center'}}>드롭 또는 클릭하여 이미지를 업로드 해주세요.</h5>
				<h6 className='mt-1'style={{textAlign:'center'}}>{`(최대 ${fileNumLimit}장의 사진까지 업로드가 가능합니다.)`}</h6>
			</div>
		</div>
		<div className="form-control hidden-scrollbar mt-1" style={{height: '40px', display: 'flex', alignItems: 'center', whiteSpace:'nowrap', overflow:'auto'}}>
			{ files.length > 0 &&
				files.map((image, idx) => {
					const fileName = image.name ? image.name : image.original_file_name
					const ext = fileName.split('.').pop()
					return (
						<span key={idx} className="mx-0 px-0">
							<FileIconImages
								ext={ext}
								file={image}
								filename={fileName}
								removeFunc={onRemoveFile}
							/>
						</span>
					)
				})
			}
		</div>
	</Fragment>
	)
}

export default ImageFileUploaderMulti
