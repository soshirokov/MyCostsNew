import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { registerWithEmail, signInWithGoogle } from '../../utils/firebase'
import { Button, Form, Input } from 'antd'

type Props = {
  authed: boolean
}

const RegistrationForm = ({ authed }: Props) => {
  const { redirect } = useParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (authed) {
    if (!redirect) {
      return <Navigate to={'/'} replace />
    } else {
      return <Navigate to={'/' + redirect} replace />
    }
  }

  const onFinish = (values: any) => {
    registerWithEmail(email, password)
  }
  const onFinishFailed = (errorInfo: any) => {}

  return (
    <div className="loginForm">
      <Form
        name="Registration"
        labelCol={{ span: 9 }}
        wrapperCol={{ span: 7 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="username"
          rules={[
            { type: 'email', message: 'Type your email adress!' },
            {
              required: true,
              message: 'Type your email adress!',
              whitespace: true,
            },
          ]}
          hasFeedback
        >
          <Input
            onChange={(e: any) => setEmail(e.target.value)}
            value={email}
          ></Input>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Type your password!' }]}
          hasFeedback
        >
          <Input.Password
            onChange={(e: any) => setPassword(e.target.value)}
            value={password}
            minLength={6}
          ></Input.Password>
        </Form.Item>

        <Form.Item
          label="Re-type your password"
          name="confirm"
          rules={[
            { required: true, message: 'Re-type your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('Passwords are different')
              },
            }),
          ]}
          dependencies={['password']}
          hasFeedback
        >
          <Input.Password></Input.Password>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 7 }}>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 9, span: 7 }}>
          <span style={{ marginRight: 20 }}>OR</span>
          <Button type="primary" onClick={signInWithGoogle}>
            Sign Up with Google
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export { RegistrationForm }
