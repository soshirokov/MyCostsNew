import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { onAuthStateChanged } from 'firebase/auth'
import './App.css'
import { auth } from './utils/firebase'
import { PrivateRoute } from './Routes/PivateRoutes'
import { Home } from './Routes/Home'
import { Login } from './Routes/Login'
import NewCalendar from './Components/Calendar'
import '../node_modules/antd/dist/antd.css'

function App() {
  const [authed, setAuthed] = useState(false)
  const [onAuth, setOnAuth] = useState(false)

  useEffect(()=>{
    setOnAuth(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthed(true);
        setOnAuth(false);
      } else {
        setAuthed(false);
        setOnAuth(false);
      }
    });

    return unsubscribe;
  }, [])

  return (
    <><BrowserRouter>
      {!onAuth &&
        (<Routes>
          <Route path="/" element={<PrivateRoute authed={authed} />}>
            <Route path="" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login authed={authed} />}>
            <Route path="redirect/:redirect" element={<Login authed={authed} />} />
          </Route>
        </Routes>)}
    </BrowserRouter><NewCalendar /></>
  )
}

export default App
