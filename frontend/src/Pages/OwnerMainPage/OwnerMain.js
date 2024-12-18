import '../../styles/Main.css';
import React, { useState } from 'react';
import Header from '../MainPage/Header';
import OwnerMainArea from './OwnerMainArea';

function OwnerMain() {
	return (
		<div>
			<div>
				<Header/>
				<OwnerMainArea/>
			</div>
		</div>
  	);
}

export default OwnerMain;
