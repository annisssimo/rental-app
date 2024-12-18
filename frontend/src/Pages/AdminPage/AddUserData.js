import '../../styles/Main.css';
import '../../styles/Owner.css';
import noPhoto from '../../img/no-photo.png';
import axios from 'axios';
import { useState } from 'react';
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function AddUserData() {
  const [errorText, setErrorText] = useState('');
  const [photo, setPhoto] = useState(noPhoto);
  const [photo2, setPhoto2] = useState(null);
  const [role, setRole] = useState('Арендатор');
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const add = async (e) => {
    if (login === '' || name === '' || surname === '' || password === '') {
      setErrorText(
        'Логин, имя, фамлия и пароль обязательно должны быть заполнены!'
      );
      return;
    }

    let belPattern = new RegExp('^375[0-9]{9}$');
    if (!belPattern.test(phoneNumber) && phoneNumber !== '') {
      setErrorText('Номер телефона введён некоретно');
      return;
    }

    try {
      //получить id из url
      const formData = new FormData();
      formData.append('name', name);
      formData.append('surname', surname);
      formData.append('login', login);
      formData.append('photo', photo2);
      formData.append('password', password);
      formData.append('phoneNumber', phoneNumber);

      switch (role) {
        case 'Арендатор':
          formData.append('role', 0);
          break;
        case 'Владелец':
          formData.append('role', 1);
          break;
        case 'Администратор':
          formData.append('role', 2);
          break;
        default:
          formData.append('role', 0);
          break;
      }

      const response = await axios.post(
        'https://localhost:3441/user/add',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `${accessToken}; ${refreshToken}`,
          },
        }
      );

      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка при добавлении данных пользователя:', error);
      if (error.response.status === 409) {
        setErrorText('Пользователь с таким логином уже существует!');
        return;
      }
    }
  };

  const changePhoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    setPhoto2(file);
    reader.onloadend = () => {
      setPhoto(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="premiseData" style={{ minHeight: '800px' }}>
      <form className="premisePhotoController">
        <img src={photo} alt="Uploaded" />
        <input
          type="file"
          accept="image/*"
          className="loadPremisePhoto"
          onChange={changePhoto}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          className="premiseName"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Фамилия"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="Номер телефона"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="selectRole">
          <label>
            <input
              type="radio"
              value="Арендатор"
              checked={role === 'Арендатор'}
              onChange={(e) => setRole(e.target.value)}
            />
            Арендатор
          </label>
          <label>
            <input
              type="radio"
              value="Владелец"
              checked={role === 'Владелец'}
              onChange={(e) => setRole(e.target.value)}
            />
            Владелец
          </label>

          <label>
            <input
              type="radio"
              value="Администратор"
              checked={role === 'Администратор'}
              onChange={(e) => setRole(e.target.value)}
            />
            Администратор
          </label>
        </div>
      </form>

      <p id="errorMessage" style={{ marginTop: '15px' }}>
        {errorText}
      </p>
      <button className="addButton" onClick={add}>
        Добавить
      </button>
    </div>
  );
}

export default AddUserData;
