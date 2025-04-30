import './App.css'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { login, logout } from './store/session'
import LandingPage from './components/LandingPage'
import { MyCart } from './components/MyCart/MyCart'
import OrderLivePage from './components/OrderLive/OrderLivePage'

function Login() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  // UI state
  const [email, setEmail] = useState("demo@user.io")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")

  const onSumbitLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
      .then((res) => {
        if (!res.ok) setError(res.title)
        else setError("")
      })
  }

  const onLogout = () => {
    dispatch(logout())
      .then((res) => {
        if (!res.ok) {
          setError(res.title)
        }
      })
  }

  useEffect(() => {
    console.log({ user })
  }, [user])

  return (
    <>
      <div style={{ borderColor: "red", color: "red" }}>{error}</div>
      <form onSubmit={onSumbitLogin}>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input type="submit" value="Login" />
        <input type="button" value="Logout" onClick={onLogout} />
      </form>
    </>
  )
}

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "login",
      element: <Login />,
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
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
