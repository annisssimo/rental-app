import { Link } from 'react-router-dom';

import logo from '../../img/logo.svg';
import '../../styles/Authorization.css';

function AuthorizationLogo() {
  return (
    <div className="authorizationLogo">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <p>Rental Premises</p>
    </div>
  );
}

export default AuthorizationLogo;
