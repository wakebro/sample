// ** React Imports
import { Fragment } from "react"

import AppRoutes from "./App"
import AuthenticationRoutes from "./Authentication"
import SystemRoutes from "./System"
import BasicRoutes from "./Basic"
import IntranetRoutes from "./intranet"
import InspectionRoutes from "./Inspection"
import EducationRoutes from "./Educatoin"
import EnergyRoutes from "./Energy"
import BusinessRoutes from "./Business"
import ReportRoutes from './Report'
import ScheduleRoutes from "./Schedule"
import CriticalDisasterRoutes from './CriticalDisaster'

// ** Layouts
import BlankLayout from "@layouts/BlankLayout"
import VerticalLayout from "@src/layouts/VerticalLayout"
import HorizontalLayout from "@src/layouts/HorizontalLayout"
import LayoutWrapper from "@src/@core/layouts/components/layout-wrapper"

// ** Route Components
import PublicRoute from "@components/routes/PublicRoute"

// ** Utils
import { isObjEmpty } from "@utils"
import { ROUTE_DASHBOARD } from "../../constants"
import FacilityRoutes from "./Facility"


const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />
}
// ** Document title
const TemplateTitle = "%s - Vuexy React Admin Template"
// ** Default Route
// const DefaultRoute = "/dashboard"
const DefaultRoute = ROUTE_DASHBOARD


// ** Merge Routes
const Routes = [
  ...AppRoutes,
  ...AuthenticationRoutes,
  ...SystemRoutes,
  ...BasicRoutes,
  ...IntranetRoutes,
  ...InspectionRoutes,
  ...EducationRoutes,
  ...EnergyRoutes,
  ...FacilityRoutes,
  ...BusinessRoutes,
  ...ReportRoutes,
  ...ScheduleRoutes,
  ...CriticalDisasterRoutes
]

const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === "blank" ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || "vertical"
  const layouts = ["vertical", "horizontal", "blank"]

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: "/",
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })
  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
