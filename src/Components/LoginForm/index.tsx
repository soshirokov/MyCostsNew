import React, { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { signIn } from '../../utils/firebase';

type Props = {
    authed: boolean
}

const LoginForm = ({authed}: Props) => {
    const {redirect} = useParams()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const submitHandler = (e: React.SyntheticEvent) => {
        e.preventDefault()

        signIn(email, password).catch((error) => {
            console.log(error.code)
            
        });
    };

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

    return(
        <div className='loginForm'>
            <form onSubmit={submitHandler}>
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
                <button type='submit'>Sign in</button>
            </form>
        </div>
    );
}

export {LoginForm}