import { Link } from 'react-router-dom';

import '../../styles/Premise.css';
import logo from '../../img/logo.svg';
import UserInterface from '../MainPage/UserInterface';

function Header() {
  return (
    <div className="mainLogo">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <UserInterface />
    </div>
  );
}

export default Header;
