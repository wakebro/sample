// ** Router imports
import { useRoutes, Navigate } from "react-router-dom"
// ** GetRoutes
import { getRoutes, DefaultRoute } from "./routes"

// ** Hooks Imports
import { useLayout } from "@hooks/useLayout"

const Router = () => {
  // ** Hooks
  const { layout } = useLayout()

  const allRoutes = getRoutes(layout)


  const routes = useRoutes([
    {
      path: "/",
      index: true,
      element: <Navigate replace to={DefaultRoute} />
    },
    ...allRoutes
  ])

  return routes
}

export default Router
