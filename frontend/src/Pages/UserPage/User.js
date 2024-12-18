import '../../styles/Main.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../MainPage/Header';
import UserParams from './UserParams';

function User() {
	return (
		<div>
			<Header/>
			<UserParams/>
		</div>
  	);
}

export default User;
