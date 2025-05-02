import "./LoginPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { login, logout, restoreUser } from '../../store/session'

import Navigation from "../Navigation/Navigation"

export default function LoginPage() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  // UI state
  const [email, setEmail] = useState("demo@user.io")
  const [password, setPassword] = useState("password")
  const [error, setError] = useState("")
  const [loggedInUser, setLoggedInUser] = useState(user)

  const onSumbitLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
      .then((res) => {
        if (!res.ok) setError(res.title)
      })
  }

  const onLogout = () => { dispatch(logout()) }

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
        : <>
          <form onSubmit={onSumbitLogin}>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
            <input type="submit" value="Login" />
          </form>
          <div style={{ borderColor: "red", color: "red" }}>{error}</div>
        </>
      }
    </>
  )
}
