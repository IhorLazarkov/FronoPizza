import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import { MyCart } from './components/MyCart/MyCart'
import OrderLivePage from './components/OrderLive/OrderLivePage'
import LoginPage from './components/LoginPage'

const router = createBrowserRouter(
  [
    {
      element: <LoginPage />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "mycart",
          element: <MyCart />,
        },
        {
          path: "orderlive/:id",
          element: <OrderLivePage />,
        }
      ]
    }
  ]
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
