import { checkApp } from '@utils'
// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import Proptypes from 'prop-types'
// ** Reactstrap Imports
import {
	Breadcrumb,
	BreadcrumbItem
} from 'reactstrap'

const BreadCrumbs = props => {
	// ** Props
	const { breadCrumbTitle, breadCrumbParent, breadCrumbParent2, breadCrumbParent3, breadCrumbActive, icon } = props

	return (
	<div className='content-header row' style={{width:'100%'}}>
		<div className='content-header-left col-md-12 col-12 mb-2'>
		<div className='row breadcrumbs-top'>
			<div className='col-9'>
			{!checkApp && breadCrumbTitle ? 
				<h2 className='content-header-title float-start mb-0'style={{display:'flex', alignItems:'center'}} >{icon ? icon : ''}{breadCrumbTitle}</h2> 
			: ''}
			{breadCrumbParent ? (
				<div className='breadcrumb-wrapper vs-breadcrumbs d-sm-block d-none col-12'>
				<Breadcrumb>
				<BreadcrumbItem tag='li'>
					<Link style={{color:'#5E5873'}} to='/'>Home</Link>
				</BreadcrumbItem>
				<BreadcrumbItem tag='li'>
					{breadCrumbParent}
				</BreadcrumbItem>
				{breadCrumbParent2 ? (
					<BreadcrumbItem tag='li'>
					{breadCrumbParent2}
					</BreadcrumbItem>
				) : (
					''
				)}
				{breadCrumbParent3 ? (
					<BreadcrumbItem tag='li'>
					{breadCrumbParent3}
					</BreadcrumbItem>
				) : (
					''
				)}
				{breadCrumbActive ? (
					<BreadcrumbItem tag='li' className='text-primary' active>
					{breadCrumbActive}
					</BreadcrumbItem>
				) : ''}
				
				</Breadcrumb>
			</div>
			)
			: ''
			}
			</div>
		</div>
		</div>
		{/* <div className='content-header-right text-md-end col-md-3 col-12 d-md-block d-none'>
			<div className='breadcrumb-right dropdown'>
			<UncontrolledButtonDropdown>
				<DropdownToggle color='primary' size='sm' className='btn-icon btn-round dropdown-toggle'>
				<Grid size={14} />
				</DropdownToggle>
				<DropdownMenu tag='ul' end>
				<DropdownItem tag={Link} to='/apps/todo'>
					<CheckSquare className='me-1' size={14} />
					<span className='align-middle'>Todo</span>
				</DropdownItem>
				<DropdownItem tag={Link} to='/apps/chat'>
					<MessageSquare className='me-1' size={14} />
					<span className='align-middle'>Chat</span>
				</DropdownItem>
				<DropdownItem tag={Link} to='/apps/email'>
					<Mail className='me-1' size={14} />
					<span className='align-middle'>Email</span>
				</DropdownItem>
				<DropdownItem tag={Link} to='/apps/calendar'>
					<Calendar className='me-1' size={14} />
					<span className='align-middle'>Calendar</span>
				</DropdownItem>
				</DropdownMenu>
			</UncontrolledButtonDropdown>
			</div>
		</div> */}
	</div>
	)
}
export default BreadCrumbs

// ** PropTypes
BreadCrumbs.propTypes = {
	breadCrumbTitle: Proptypes.string.isRequired
	// breadCrumbActive: Proptypes.string.isRequired
}
