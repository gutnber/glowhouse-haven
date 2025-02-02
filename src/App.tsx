import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { RootLayout } from "./components/layout/RootLayout"
import Index from "./pages/Index"
import Properties from "./pages/Properties"
import PropertyProfile from "./pages/PropertyProfile"
import AddProperty from "./pages/AddProperty"
import EditProperty from "./pages/EditProperty"
import Settings from "./pages/Settings"
import Tools from "./pages/Tools"
import Users from "./pages/Users"
import NewsPost from "./pages/NewsPost"
import News from "./pages/News"

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Index />,
      },
      {
        path: "/properties",
        element: <Properties />,
      },
      {
        path: "/properties/:id",
        element: <PropertyProfile />,
      },
      {
        path: "/properties/add",
        element: <AddProperty />,
      },
      {
        path: "/properties/:id/edit",
        element: <EditProperty />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/tools",
        element: <Tools />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/news",
        element: <News />,
      },
      {
        path: "/news/:id",
        element: <NewsPost />,
      },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App