import React from 'react';
import { LoginForm } from '../../Components/LoginForm';
import  "./style/index.scss"

type Props = {
    authed: boolean
    
}

const Login = ({authed}: Props) => {
    return (
       
        <div className='login'>
        <h1>Регистрация</h1>
            <LoginForm authed={ authed } />
        </div>
     
    );
};

export {Login};