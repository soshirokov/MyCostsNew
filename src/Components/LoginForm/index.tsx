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
              
                
            });
          
        };
        const onFinishFailed = (errorInfo: any) => {
            
          };
         
    return(
        <div className='loginForm'>
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
          label="Почта"
          name="username"
          rules={[{ type: "email", message: 'Введены некорректные данные!' },
          { required: true, message: 'Пожалуйста, введите адрес почты!', whitespace: true }
          ]}
          hasFeedback
        >
          <Input
          onChange={(e:any) => setEmail(e.target.value)}
          value={email}
          ></Input>
        </Form.Item>
  
        <Form.Item
          label="Пароль"
          name="password"
          rules={[
          { required: true, message: 'Пожалуйста, введите пароль!' }
        ]} 
          hasFeedback
        >
          <Input.Password 
          onChange={(e:any) => setPassword(e.target.value)}
           value={password}
          ></Input.Password >
        </Form.Item>

        <Form.Item
          label="Повторите пароль"
          name="confirm"
          rules={[
          { required: true, message: 'Пожалуйста, повторите пароль!' },
          ({getFieldValue})=>({
            validator(_,value){
              if(!value || getFieldValue("password")===value){
                return Promise.resolve();
              }
              return Promise.reject("Пароли не совпадают")
            }
          })
          ]}
          dependencies={["password"]}
          hasFeedback
        >
          <Input.Password 
         
          ></Input.Password >
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 9, span: 7 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
  
        <Form.Item wrapperCol={{ offset: 9, span: 7 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
        </div>
       
    );
}

export {LoginForm}