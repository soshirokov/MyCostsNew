import { Switch } from 'antd'
import React, { useState } from 'react'
import { LoginForm } from '../../Components/LoginForm'
import { RegistrationForm } from '../../Components/RegistrationForm'
import './style/index.scss'

type Props = {
  authed: boolean
}

const Login = ({ authed }: Props) => {
  const [check, setCheck] = useState<boolean>(false)

  const switchChangeHandler = (checked: boolean) => {
    setCheck(checked)
  }

  return (
    <div className="login">
      <h1>
        SignIn <Switch onChange={switchChangeHandler} /> SignUp
      </h1>
      {!check && <LoginForm authed={authed} />}
      {check && <RegistrationForm authed={authed} />}
    </div>
  )
}

export { Login }
