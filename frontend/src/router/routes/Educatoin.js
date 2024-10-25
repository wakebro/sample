import { lazy } from 'react'
import { ROUTE_EDUCATION, ROUTE_EDUCATION_TIMELINE } from '../../constants'

const EducationLegalList = lazy(() => import('../../views/education/legal/list/LegalEducationList'))
const EducationLegalForm = lazy(() => import('../../views/education/legal/form/LegalEducationForm'))
const EducationLegalDetail = lazy(() => import('../../views/education/legal/list/LegalEducationDetail'))
const EducationTimeline = lazy(() => import('../../views/education/timeline/EducationTimeline'))

const EducationRoutes = [
    {
        path: `${ROUTE_EDUCATION}/:type`,
        element: <EducationLegalList />
    },
    {
        path: `${ROUTE_EDUCATION}/:type/form`,
        element: <EducationLegalForm />
    },
    {
        path: `${ROUTE_EDUCATION}/:type/detail/:id`,
        element: <EducationLegalDetail />
    },
    {
        path: ROUTE_EDUCATION_TIMELINE,
        element:<EducationTimeline />
    }
]
export default EducationRoutes