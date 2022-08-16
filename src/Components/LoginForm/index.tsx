import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { signIn } from '../../utils/firebase';
import { Button, Checkbox, Form, Input } from 'antd';
import  "./style/index.scss"

type Props = {
    authed: boolean
}

const LoginForm = ({authed}: Props) => {
    const {redirect} = useParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // const submitHandler = (e: React.SyntheticEvent) => {
    //     e.preventDefault()

    //     signIn(email, password).catch((error) => {
    //         console.log(error.code)
            
    //     });
    // };

    if (authed) {
        if (!redirect) {
            return (
                <Navigate to={"/"} replace />
            );
        } else {
            return (
                <Navigate to={"/" + redirect} replace />
            );
        }
    }
    
        const onFinish = (values: any) => {
            signIn(email, password).catch((error) => {
                console.log(error.code)
                
            });
          console.log('Success:', values);
        };
        const onFinishFailed = (errorInfo: any) => {
            console.log('Failed:', errorInfo);
          };
         
    return(
        <div className='loginForm'>
            <Form
            
        name="basic"
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 6 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
          onChange={(e:any) => setEmail(e.target.value)}
          value={email}
          ></Input>
        </Form.Item>
  
        <Form.Item
       
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
          
        >
          <Input.Password 
          onChange={(e:any) => setPassword(e.target.value)}
           value={password}
          ></Input.Password >
        </Form.Item>
  
        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 2, span: 6 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 2, span: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
        </div>
       
    );
}

export {LoginForm}