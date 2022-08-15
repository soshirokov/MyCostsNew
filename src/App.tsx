import React, { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom"
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './utils/firebase'
import { PrivateRoute } from './Routes/PivateRoutes'
import { Home } from './Routes/Home'
import { Login } from './Routes/Login'
import 'antd/dist/antd.min.css'
import { Layout, Typography } from 'antd'
import styles from './App.module.scss'

const { Header, Content } = Layout
const { Title } = Typography

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
    <>
      <Layout className={ styles.App }>
        <Header className={ styles.App__Header }><Title level={2} className={ styles.App__SiteName }>MyCostsGB</Title></Header>
        <Content className={ styles.App__Content }>
          <BrowserRouter>
            {!onAuth &&
              (<Routes>
                <Route path="/" element={<PrivateRoute authed={authed} />}>
                  <Route path="" element={<Home />} />
                </Route>
                <Route path="/login" element={<Login authed={authed} />}>
                  <Route path="redirect/:redirect" element={<Login authed={authed} />} />
                </Route>
              </Routes>)}
          </BrowserRouter>
        </Content>
      </Layout>
    </>
  )
}

export default App
