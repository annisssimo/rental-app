import '../../styles/Authorization.css';
import axios from 'axios';
import { useState } from 'react';


function LoginForm() {
    const [errorText, setErrorText] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(login === '' || password === '') {
            setErrorText("Вы не заполнили все поля!"); 
            return;
        }

        try {
            const response = await axios.post('https://localhost:3441/auth/login', {
                login: login,
                password: password
            });
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            window.location.href = '/'; 
        } catch (error) {
            if(error.response.status === 401) {
                setErrorText("Неверный логин или пароль!"); 
                return;
            }
            console.error('Ошибка при входе:', error);
        }
    };

	return (
	    <form onSubmit={handleSubmit} className="authForm">
            <input type="text" name="login" style={{marginTop: '40px'}} placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)}/>
            <input type="password" name="password" style={{marginTop: '40px'}} placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <p id="errorMessage" style={{marginTop: '15px'}}>{errorText} </p>
            <button type="submit" style={{marginTop: '110px'}}>Войти</button>
        </form>
  	);
}

export default LoginForm;