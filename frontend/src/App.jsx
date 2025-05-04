import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import { MyCart } from './components/MyCart/MyCart'
import OrderLivePage from './components/OrderLive/OrderLivePage'
import LoginPage from './components/LoginPage'
import MyFavoritesPage from './components/MyFavoritesPage'
import MyReviewPage from './components/MyReviews/MyReviewPage'
import PizzaDetailsPage from './components/PizzaDetailsPage/PizzaDetailsPage'

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
          path: "myfavorites",
          element: <MyFavoritesPage />,
        },
        {
          path: "myreviews",
          element: <MyReviewPage />,
        },
        {
          path: "mycart",
          element: <MyCart />,
        },
        {
          path: "orderlive/:id",
          element: <OrderLivePage />,
        },
        {
          path: "pizza/:id",
          element: <PizzaDetailsPage />,
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
