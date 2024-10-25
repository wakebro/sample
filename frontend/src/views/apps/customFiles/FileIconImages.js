import { ReactComponent as Close } from '../../../assets/images/close.svg'

const FileIconImages = (props) => {
	const { ext, file, filename, removeFunc } = props
    let imagePath = undefined
    try {
		imagePath = require(`../../../assets/images/icons/${ext}.png`).default
	} catch (error) {
		imagePath = require('../../../assets/images/icons/unknown.png').default
	}
	return (
		<div style={{ position: 'relative', paddingRight: '10px' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
                <div style={{ display: 'flex', flexDirection: 'row-reverse', paddingRight: '4px' }}>
                    <Close onClick={() => removeFunc(file)} style={{ cursor: 'pointer' }} />
                </div>
            </div>
                <img src={imagePath} width='16'  height='18' className='me-50' />
                <span style={{fontSize:'13px'}}>{filename}</span>
		</div>
	)
}

export default FileIconImages

// 미리 보기 형태
// const renderFilePreview = (file) => {
//     if (file !== null) {
//         if (file.type !== undefined) {
//             return (
//                 <img
//                 className='rounded'
//                 alt={file.name}
//                 src={URL.createObjectURL(file)}
//                 height='25'
//                 width='25'
//                 />
//             )
//         } else {
//             return (
//                 <img
//                 className='rounded'
//                 alt={file.name}
//                 src={file}
//                 height='25'
//                 width='25'
//                 />
//             )
//         }
//     }
// }