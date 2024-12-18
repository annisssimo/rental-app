import '../../styles/Main.css';
import '../../styles/Owner.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../MainPage/Header';
import AddPremiseData from './AddPremiseData';

function AddPemise() {
	return (
		<div>
			<Header/>
			<AddPremiseData/>
		</div>
  	);
}

export default AddPemise;
