import '../../styles/Authorization.css';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import AuthorizationLogo from './AuthorizationLogo';

function Authorization() {
  	// Состояние для отслеживания текущего режима: 'login' или 'register'
  	const [mode, setMode] = useState('login');

  	// Функции для изменения режима между 'login' и 'register'
  	const switchToLogin = () => {
    	setMode('login');
  	};

	const switchToRegister = () => {
		setMode('register');
	};

	const activeLoginModeStyle = {
		backgroundColor: mode === 'login' ? 'rgb(60, 80, 254)' : 'transparent', // изменение цвета фона
		color: mode === 'login' ? 'white' : 'black', // изменение цвета текста
		border: 'none', // удаление границы
		borderRadius: '8px',
		cursor: 'pointer', // курсор при наведении
	};
	
	const activeRegisterModeStyle = {
		backgroundColor: mode === 'register' ? 'rgb(60, 80, 254)' : 'transparent', // изменение цвета фона
		color: mode === 'register' ? 'white' : 'black', // изменение цвета текста
		border: 'none', // удаление границы
		borderRadius: '8px',
		cursor: 'pointer', // курсор при наведении
	};

	return (
		<div>
			<div className="authorizationMenu">
				<AuthorizationLogo/>
				<div className="reg-log">
					<button style={activeLoginModeStyle} onClick={switchToLogin}>Вход</button>
					<button style={activeRegisterModeStyle}onClick={switchToRegister}>Регистрация</button>
				</div>
				{mode === 'login' && (
  					<LoginForm/>
				)}
				{mode === 'register' && (
  					<RegisterForm/>
				)}
			</div>
		</div>
  	);
}

export default Authorization;
