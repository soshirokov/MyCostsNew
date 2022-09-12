import React, { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { signIn, signInWithGoogle } from '../../utils/firebase'
import { Button, Form, Input, Col, Row } from 'antd'

type Props = {
  authed: boolean
}

const LoginForm = ({ authed }: Props) => {
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
    signIn(email, password)
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
          ></Input.Password>
        </Form.Item>
        <Row justify="center" align="middle">
          <Col xs={{ flex: '1 0 95px' }} flex="100px">
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
          </Col>
          <Col xs={{ flex: '1 0 50px' }} flex="0 1 40px">
            OR
          </Col>
          <Col xs={{ flex: 'auto' }} flex="10px">
            <Button type="primary" onClick={signInWithGoogle}>
              Sign In with Google
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export { LoginForm }
