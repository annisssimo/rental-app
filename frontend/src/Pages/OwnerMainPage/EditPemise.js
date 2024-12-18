import '../../styles/Main.css';
import '../../styles/Owner.css';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Header from '../MainPage/Header';
import EditPremiseData from './EditPremiseData';

function EditPemise() {
	return (
		<div>
			<Header/>
			<EditPremiseData/>
		</div>
  	);
}

export default EditPemise;
