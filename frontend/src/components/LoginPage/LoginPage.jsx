import "./LoginPage.css"
import { useDispatch, useSelector } from 'react-redux'
import { useState, useEffect } from 'react'
import { login, logout, restoreUser, signup } from '../../store/session'

import Navigation from "../Navigation/Navigation"
import { clearCart } from "../../store/cart"

export default function LoginPage() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [showSignupForm, setShowSignupForm] = useState(false)

  // UI state
  const [loggedInUser, setLoggedInUser] = useState(user)

  const onLogout = () => {
    dispatch(logout()).then(() => {
      dispatch(clearCart())
    })
  }

  useEffect(() => {
    dispatch(restoreUser()).then((res) => {
      if (!res.ok) console.error({ res });
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
          {showLoginForm && <LoginForm setShowLoginForm={setShowLoginForm} setShowSignupForm={setShowSignupForm} />}
          {showSignupForm && <SignupForm setShowLoginForm={setShowLoginForm} setShowSignupForm={setShowSignupForm} />}
        </div>
      }
    </>
  )
}

function LoginForm({ setShowLoginForm, setShowSignupForm }) {

  const dispatch = useDispatch()

  // UI state
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [error, setError] = useState("")

  const onSumbitLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email, password }))
      .then((res) => {
        if (!res.ok) setError(`${res.title}: ${res.errors[0]}`)
      })
  }
  const onDemoSumbitLogin = (e) => {
    e.preventDefault()
    dispatch(login({ email: "demo@user.io", password: "password" }))
      .then((res) => {
        if (!res.ok) setError(res.title)
      })
  }

  return (
    <>
      <div className="login-form">
        <form onSubmit={onSumbitLogin}>
          <img src="../../assets/logo.png" alt="logo" />
          <input autoFocus placeholder="email" type="email" value={email} required onChange={e => setEmail(e.target.value)} />
          <input placeholder="password" type="password" value={password} required onChange={e => setPassword(e.target.value)} />
          <button className="primary" type="submit">Login</button>
          <button className="secondary" onClick={() => {
            setShowLoginForm(false)
            setShowSignupForm(true)
          }}>Signup</button>
          <button className="critical" onClick={onDemoSumbitLogin}>Login as Demo User</button>
          {error && <div style={{
            backgroundColor: "var(--sub-secondary-v1)",
            borderColor: "red",
            color: "red",
            padding: "5px",
          }}>{error}</div>}
        </form>
      </div>


      <div style={{
        position: "fixed",
        bottom: "0",
        right: "0",
        color: "var(--sub-secondary-v1)",
        backdropFilter: "blur(3px)",
      }}>
        <ul style={{
          listStyle: "none",
          padding: "1rem",
          margin: "0",
        }}>
          <li>This in not a financial product but portfolio project</li>
          <li>&copy; Ihor Lazarkov property</li>
          <li>email: ilazarkov@gmail.com</li>
          <li>Credits:</li>
          <li>Chat GPT for collor collection, logo, fonts</li>
          <li>Icons from:</li>
          <li>https://react-icons.github.io/react-icons/</li>
          <li>Photos from:</li>
          <li>https://www.pantrymama.com/</li>
          <li>https://www.tastingtable.com/</li>
          <li>https://www.withspice.com/</li>
          <li>https://www.seriouseats.com/</li>
          <li>https://www.rockrecipes.com/</li>
          <li>https://www.allrecipes.com/</li>
          <li>https://culinarylore.com/</li>
          <li>https://www.health.com/</li>
          <li>https://www.allrecipes.com/</li>
          <li>https://upload.wikimedia.org/</li>
          <li>All similarities are accidental.</li>
        </ul>
      </div>
    </>
  )
}

function SignupForm({ setShowLoginForm, setShowSignupForm }) {
  const dispatch = useDispatch()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const onSubmitSignup = (e) => {
    e.preventDefault()
    if (password === confirmPassword) {
      dispatch(signup({
        firstName,
        lastName,
        email,
        password
      }))
        .then((res) => {
          if (!res.ok) setError(`${res.title}: ${res.errors[0]}`)
          else setError(res.message)
        })
    } else {
      setError("Passwords do not match")
    }
  }

  return (
    <div className="signup-form">
      <form onSubmit={onSubmitSignup}>
        <img src="../../assets/logo.png" alt="logo" />
        <input type="text" placeholder="first name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <input type="text" placeholder="last name" value={lastName} onChange={e => setLastName(e.target.value)} />
        <input required autoFocus type="email" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input required type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
        <input required type="password" placeholder="confirm password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

        <button className="primary">Signup</button>
        <button className="secondary" onClick={() => {
          setShowLoginForm(true)
          setShowSignupForm(false)
        }}>Login</button>
        {error && <div style={{
          backgroundColor: "var(--sub-secondary-v1)",
          borderColor: "red",
          color: "red",
          padding: "5px",
        }}>{error}</div>}
      </form>
    </div>
  )
}