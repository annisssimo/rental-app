import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import Main from './MainPage/Main';
import OwnerMain from './OwnerMainPage/OwnerMain';
import AddPremise from './OwnerMainPage/AddPemise';
import EditPemise from './OwnerMainPage/EditPemise';
import Premise from './Premise/Premise';
import ApplicationList from './RentalPage/ApplicationList';
import Authorization from './AuthorizationPage/Authorization';
import AnnouncementAdmin from './AnnouncementPage/AnnouncementAdmin';
import Rental from './RentalPage/Rental';
import User from './UserPage/User';
import Admin from './AdminPage/Admin';
import AddUser from './AdminPage/AddUser';
import EditUser from './AdminPage/EditUser';
import ErrorPage from './ErrorPage';
import axios from 'axios';
import '../styles/App.css';

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function App() {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const response = await axios.get(
          'https://localhost:3441/auth/resource',
          {
            headers: {
              Authorization: `${accessToken}; ${refreshToken}`,
            },
          }
        );
        setAuth(response.data);
      } catch (error) {
        if (error.response === undefined) return setAuth(false);
        if (error.response.status === 401) {
          setAuth(false);
        }
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    isAuthenticated();
  }, []);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authorization />} />
        <Route
          path="/user"
          element={auth ? <User /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/"
          element={
            auth ? (
              auth.role === 0 ? (
                <Main />
              ) : auth.role === 1 ? (
                <OwnerMain />
              ) : (
                <Admin />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {auth && (
          <>
            <Route
              path="/premise/:id"
              element={auth ? <Premise /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/rental"
              element={auth ? <Rental /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/announcement"
              element={
                auth ? <AnnouncementAdmin /> : <Navigate to="/login" replace />
              }
            />
          </>
        )}
        {auth.role === 1 && (
          <>
            <Route
              path="/application"
              element={
                auth ? <ApplicationList /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/add_premise"
              element={auth ? <AddPremise /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/announcement"
              element={
                auth ? <AnnouncementAdmin /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/edit_premise/:id"
              element={auth ? <EditPemise /> : <Navigate to="/login" replace />}
            />
          </>
        )}
        {auth.role === 2 && (
          <>
            <Route
              path="/add_user"
              element={auth ? <AddUser /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/announcement"
              element={
                auth ? <AnnouncementAdmin /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/edit_user/:id"
              element={auth ? <EditUser /> : <Navigate to="/login" replace />}
            />
          </>
        )}

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
