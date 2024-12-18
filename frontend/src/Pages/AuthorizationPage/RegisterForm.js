import '../../styles/Authorization.css';
import axios from 'axios';
import { useState } from 'react';

function RegisterForm() {
    const [errorText, setErrorText] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(name === '' || surname === '' || login === '' || password === '' || confirmPassword === '') {
            setErrorText("Вы не заполнили все поля!"); 
            return;
        }

        if(password !== confirmPassword) {
            setErrorText("Пароли не совпадают!"); 
            return;
        }
        
        try {
            const response = await axios.post('https://localhost:3441/auth/register', {
                name: name,
                surname: surname,
                login: login,
                password: password,
                confirmPassword: confirmPassword
            });

    
            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;
            const user = response.data.newUser;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            window.location.href = '/';
        } catch (error) {
            if(error.response.status  === 409) {
                setErrorText("Пользователь с таким логином уже существует!"); 
                return;
            }
            console.error('Ошибка при входе:', error);
        }
    };

    return (
	    <form onSubmit={handleSubmit} className="authForm">
            <input type="text" name="login" placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)}/>
            <input type="text" name="name" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" name="surname" placeholder="Фамилия" value={surname} onChange={(e) => setSurname(e.target.value)}/>
            <input type="password" name="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type="password" name="confirmPassword" placeholder="Повторите пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            <div id="errorMessage" style={{marginTop: '15px'}}>{errorText}</div>
            <button type="submit" style={{marginTop: '25px'}}>Зарегестрироваться</button>
        </form>
  	);
}

export default RegisterForm;