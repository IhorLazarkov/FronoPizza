import "./LoginPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { login, logout, restoreUser } from '../../store/session'

import Navigation from "../Navigation/Navigation"

export default function LoginPage() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [form, setForm] = useState(<LoginForm />)

  // UI state
  const [loggedInUser, setLoggedInUser] = useState(user)

  const onLogout = () => dispatch(logout())

  useEffect(() => {
    dispatch(restoreUser()).then((res) => {
      if (!res.ok) setError(res.title)
    })
  }, [dispatch])

  useEffect(() => {
    setLoggedInUser(user)
  }, [user])

  return (
    <>
      {Object.values(loggedInUser).length
        ? <Navigation onLogout={onLogout} />
        : <div id="login-page">
          {form}
        </div>
      }
    </>
  )
}

function LoginForm() {

  const dispatch = useDispatch()

  // UI state
  const [email, setEmail] = useState("demo@user.io")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")

  const onSumbitLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
      .then((res) => {
        if (!res.ok) setError(res.title)
      })
  }

  return (
    <div className="login-form">
      <form onSubmit={onSumbitLogin}>
        <img src="../../assets/logo.png" alt="logo" />
        <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="primary" type="submit">Login</button>
        <button className="secondary">Signup</button>
      </form>
      <div style={{ borderColor: "red", color: "red" }}>{error}</div>
    </div>
  )
}

function SignUpForm() {
  return (
    <div className="signup-form">
      <form>
        <input type="text" />
        <input type="password" />
      </form>
      <div style={{ borderColor: "red", color: "red" }}>{error}</div>
    </div>
  )
}