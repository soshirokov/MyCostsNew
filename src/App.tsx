import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, logout } from './utils/firebase'
import { PrivateRoute } from './Routes/PivateRoutes'
import { Home } from './Routes/Home'
import { Login } from './Routes/Login'
import { Profile } from './Routes/Profile'
import 'antd/dist/antd.min.css'
import { Button, Drawer, Layout, List, Typography } from 'antd'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import styles from './App.module.scss'
import { Analitics } from './Routes/Analitics'

const { Header, Content } = Layout
const { Title } = Typography

function App() {
  const [authed, setAuthed] = useState(false)
  const [onAuth, setOnAuth] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const pages = [
    { name: 'Home', link: '/' },
    { name: 'Analytics', link: '/analytics' },
    { name: 'Profile', link: '/profile' },
  ]

  useEffect(() => {
    setOnAuth(true)
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthed(true)
        setOnAuth(false)
      } else {
        setAuthed(false)
        setOnAuth(false)
      }
    })
    return unsubscribe
  }, [])

  return (
    <>
      <Layout className={styles.App}>
        <Header className={styles.App__Header}>
          <Button type="text" onClick={() => setShowMenu(true)}>
            <MenuUnfoldOutlined className={styles.App__MenuIcon} />
          </Button>
          <Title level={2} className={styles.App__SiteName}>
            MyCostsGB
          </Title>
        </Header>
        <Content className={styles.App__Content}>
          <BrowserRouter>
            <Drawer
              placement="left"
              width={400}
              onClose={() => setShowMenu(false)}
              visible={showMenu}
            >
              <List
                dataSource={pages}
                renderItem={(item) => (
                  <List.Item>
                    <Link to={item.link} onClick={() => setShowMenu(false)}>
                      {item.name}
                    </Link>
                  </List.Item>
                )}
              >
                <Button className={styles.App__Logout} onClick={logout}>
                  Logout
                </Button>
              </List>
            </Drawer>
            {!onAuth && (
              <Routes>
                <Route path="/" element={<PrivateRoute authed={authed} />}>
                  <Route path="" element={<Home />} />
                </Route>
                <Route
                  path="/analytics"
                  element={<PrivateRoute authed={authed} path="analytics" />}
                >
                  <Route path="" element={<Analitics />} />
                </Route>
                <Route
                  path="/profile"
                  element={<PrivateRoute authed={authed} path="profile" />}
                >
                  <Route path="" element={<Profile />} />
                </Route>
                <Route path="/login" element={<Login authed={authed} />}>
                  <Route
                    path="redirect/:redirect"
                    element={<Login authed={authed} />}
                  />
                </Route>
              </Routes>
            )}
          </BrowserRouter>
        </Content>
      </Layout>
    </>
  )
}

export default App
