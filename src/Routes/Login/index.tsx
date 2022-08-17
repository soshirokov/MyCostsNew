import React from 'react';
import { LoginForm } from '../../Components/LoginForm';

type Props = {
    authed: boolean
    
}

const Login = ({authed}: Props) => {
    return (
        <div className='login'>
            <LoginForm authed={ authed } />
        </div>
    );
};

export {Login};