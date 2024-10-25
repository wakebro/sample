/* eslint-disable */
import {Fragment, useEffect, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import {Upload} from 'react-feather'
import {ReactComponent as Close} from '@src/assets/images/close.svg'
import {sweetAlert} from '@utils'

const FileUploaderMulti = (props) => {
	const {name, control, data, setValue, saveCheckFunc} = props
	const [showoriginfile, setShowOriginFile] = useState(false)
	const {getRootProps, getInputProps} = useDropzone({
		multiple: true,
		maxSize: 2000000,
		onDrop: acceptedFiles => {
			if (acceptedFiles.length !== 0) {
				const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image'))
				if (imageFiles.length < 0 || acceptedFiles.length !== imageFiles.length) { // 업로드 파일이 이미지가 아닐경우
					sweetAlert('', '이미지를 업로드 해주세요.', 'warning', 'center')
					return
				}

				const totalLength = control._formValues[`${name}Files_${data.id}`].length + acceptedFiles.length
				if (acceptedFiles.length > 1) { // 업로드 할 이미지가 1개 이상인 경우
					sweetAlert('', '최대 1장의 사진까지 업로드가 가능합니다.', 'warning', 'center')
					return
				}

				if (acceptedFiles.length === 3) { // 정확히 3개일때는 초기화
					// setFiles([...acceptedFiles.map(file => Object.assign(file))])
					setValue(`${name}Files_${data.id}`, [...acceptedFiles.map(file => Object.assign(file))])
					return
				}

				if (totalLength > 3) { // 이전 파일 목록 쉬프트
					for (let index = 0; index <= acceptedFiles.length - 1; index++) {
						control._formValues[`${name}Files_${data.id}`].shift()
					}
				}

				// 중복 제거
				const resultArray = [
					...control._formValues[`${name}Files_${data.id}`],
					...acceptedFiles.map(file => Object.assign(file))
				]
				if (saveCheckFunc) saveCheckFunc(false)
				setValue(`${name}Files_${data.id}`, resultArray)
			} else {
				sweetAlert('', '20MB 이하의 이미지를 업로드 하세요.', 'warning', 'center')
				//alert("20MB 이하의 이미지를 업로드 하세요")
			}
		} // onDrop end
	}) //useDropzone end

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
		if (saveCheckFunc) saveCheckFunc(false)
		setValue(`${name}Files_${data.id}`, control._formValues[`${name}Files_${data.id}`].filter(e => e !== image))
	}

	const onRemoveOriginFile = () => {
		if (saveCheckFunc) saveCheckFunc(false)
		control._formValues[`${name}ClickDeleteOriginFile_${data.id}`](true)
		setShowOriginFile(true)
	}

	return (
		<Fragment>
			<div
				{...getRootProps({ className: 'dropzone' })}
				style={{
					width: '100%',
					height: '265px',
					border: '1px dashed gray',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
				<input name='img' {...getInputProps()}/>
				<div className='d-flex align-items-center justify-content-center flex-column'>
					<Upload size={44} style={{ backgroundColor: '#DCDCDC', borderRadius: '6px' }}/>
					<div className='mt-1' style={{fontWeight:500, textAlign:'center'}}>사진을 등록하려면 클릭 후 파일을 선택하거나 여기에 끌어다 놓으세요.</div>
					<h6 className='mt-1' style={{textAlign:'center'}}>(최대 한 장의 사진까지 업로드가 가능합니다.)</h6>
				</div>
			</div>

			{
				control._formValues[`${name}UpdatedFilename_${data.id}`] !== undefined && control._formValues[`${name}UpdatedFilename_${data.id}`].length > 0 && showoriginfile === false
					? (
						// updatedfilename이 존재하는 경우 실행될 코드
						<div
							className="form-control hidden-scrollbar mt-1"
							style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
							<div style={{ position: 'relative', paddingRight: '10px' }}>
								<div style={{ position: 'absolute', width: '100%', height: '100%' }}>
									<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
										<Close onClick={onRemoveOriginFile} style={{ cursor: 'pointer' }}/>
									</div>
								</div>
								<div>{control._formValues[`${name}UpdatedFilename_${data.id}`]}</div>
							</div>
						</div>
					)
					: (
						// updatedfilename이 존재하지 않는 경우 실행될 코드
						<div
							className="form-control hidden-scrollbar mt-1"
							style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
							{
								control._formValues[`${name}Files_${data.id}`] !== undefined && control._formValues[`${name}Files_${data.id}`].length > 0 && control._formValues[`${name}Files_${data.id}`].map((image, idx) => (
									<div
										key={`email_${idx}`}
										style={{ position: 'relative', paddingRight: '10px', marginRight:'6px' }}>
										<div style={{ position: 'absolute', width: '100%', height: '100%' }}>
											<div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
												<Close
													onClick={() => onRemoveFile(image)}
													style={{ cursor: 'pointer' }}/>
											</div>
										</div>
										{renderFilePreview(image)}
									</div>
								))
							}
						</div>
					)
			}
		</Fragment>
	)
}

export default FileUploaderMulti