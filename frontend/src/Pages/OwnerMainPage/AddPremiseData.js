import '../../styles/Main.css';
import '../../styles/Owner.css';
import noPhoto from '../../img/no-photo.png';
import axios from 'axios';
import React, { useState } from 'react';
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

function AddPremiseData() {
  const [errorText, setErrorText] = useState('');
  const [photo, setPhoto] = useState(noPhoto);
  const [photo2, setPhoto2] = useState(null);
  const [typePremise, setTypePremise] = useState('Жилые помещения');
  const [name, setName] = useState('');
  const [adress, setAdress] = useState('');
  const [pool, setPool] = useState('');
  const [billiards, setBilliards] = useState('');
  const [furniture, setFurniture] = useState('');
  const [repair, setRepair] = useState('');
  const [area, setArea] = useState('');
  const [price, setPrice] = useState('');

  const add = async (e) => {
    if (price === '' || name === '' || adress === '') {
      setErrorText('Название, адресс и цена должны быть заполнены!');
      return;
    }

    try {
      let type;
      let descriptions = [];

      switch (typePremise) {
        case 'Жилые помещения': {
          type = 3;
          descriptions = [
            { char: 'Площадь', des: area },
            { char: 'Мебель', des: furniture },
            { char: 'Бассейн', des: pool },
            { char: 'Бильярд', des: billiards },
            { char: 'Ремонт', des: repair },
          ];
          break;
        }
        case 'Пустые помещения': {
          type = 5;
          descriptions = [
            { char: 'Площадь', des: area },
            { char: 'Ремонт', des: repair },
          ];
          break;
        }
        case 'Коммерческие помещения': {
          type = 4;
          descriptions = [
            { char: 'Площадь', des: area },
            { char: 'Мебель', des: furniture },
            { char: 'Ремонт', des: repair },
          ];
          break;
        }
        case 'Офисы': {
          type = 1;
          descriptions = [
            { char: 'Площадь', des: area },
            { char: 'Мебель', des: furniture },
            { char: 'Ремонт', des: repair },
          ];
          break;
        }
        case 'Склады': {
          type = 2;
          descriptions = [
            { char: 'Площадь', des: area },
            { char: 'Ремонт', des: repair },
          ];
          break;
        }
      }
      const formData = new FormData();
      formData.append('name', name);
      formData.append('adress', adress);
      formData.append('price', price);
      formData.append('type', type);
      formData.append('photo', photo2);

      formData.append('descriptions', JSON.stringify(descriptions));

      const response = await axios.post(
        'https://localhost:3441/premise/add',
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
      console.error('Ошибка при изменении данных пользователя:', error);
    }
  };

  const activeZiliuyTypePremise = {
    backgroundColor:
      typePremise === 'Жилые помещения' ? 'rgb(60, 80, 254)' : 'transparent',
    color: typePremise === 'Жилые помещения' ? 'white' : 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const activeSkladTypePremise = {
    backgroundColor:
      typePremise === 'Склады' ? 'rgb(60, 80, 254)' : 'transparent',
    color: typePremise === 'Склады' ? 'white' : 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const activeEmptyTypePremise = {
    backgroundColor:
      typePremise === 'Пустые помещения' ? 'rgb(60, 80, 254)' : 'transparent',
    color: typePremise === 'Пустые помещения' ? 'white' : 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const activeOfficeTypePremise = {
    backgroundColor:
      typePremise === 'Офисы' ? 'rgb(60, 80, 254)' : 'transparent',
    color: typePremise === 'Офисы' ? 'white' : 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  };

  const activeComercialTypePremise = {
    backgroundColor:
      typePremise === 'Коммерческие помещения'
        ? 'rgb(60, 80, 254)'
        : 'transparent',
    color: typePremise === 'Коммерческие помещения' ? 'white' : 'black',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
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
    <div className="premiseData">
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
          placeholder="Название помещения"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="premiseName"
          placeholder="адресс"
          value={adress}
          onChange={(e) => setAdress(e.target.value)}
        />
        <div className="changeCharacteristicList">
          <button
            type="button"
            style={activeZiliuyTypePremise}
            onClick={() => setTypePremise('Жилые помещения')}
          >
            Жилые помещения
          </button>
          <button
            type="button"
            style={activeEmptyTypePremise}
            onClick={() => setTypePremise('Пустые помещения')}
          >
            Пустые помещения
          </button>
          <button
            type="button"
            style={activeComercialTypePremise}
            onClick={() => setTypePremise('Коммерческие помещения')}
          >
            Коммерческие помещения
          </button>
          <button
            type="button"
            style={activeOfficeTypePremise}
            onClick={() => setTypePremise('Офисы')}
          >
            Офисы
          </button>
          <button
            type="button"
            style={activeSkladTypePremise}
            onClick={() => setTypePremise('Склады')}
          >
            Склады
          </button>
        </div>
      </form>

      {typePremise === 'Жилые помещения' && (
        <form className="premiseCharacteristics">
          <div className="area-price">
            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Площадь"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Мебель"
            value={furniture}
            onChange={(e) => setFurniture(e.target.value)}
          />
          <input
            type="text"
            placeholder="Бассейн"
            value={pool}
            onChange={(e) => setPool(e.target.value)}
          />
          <input
            type="text"
            placeholder="Бильярд"
            value={billiards}
            onChange={(e) => setBilliards(e.target.value)}
          />
          <input
            type="text"
            placeholder="Ремонт"
            value={repair}
            onChange={(e) => setRepair(e.target.value)}
          />
        </form>
      )}

      {typePremise === 'Пустые помещения' && (
        <form className="premiseCharacteristics">
          <div className="area-price">
            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Площадь"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Ремонт"
            value={repair}
            onChange={(e) => setRepair(e.target.value)}
          />
        </form>
      )}

      {typePremise === 'Коммерческие помещения' && (
        <form className="premiseCharacteristics">
          <div className="area-price">
            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Площадь"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Ремонт"
            value={repair}
            onChange={(e) => setRepair(e.target.value)}
          />
          <input
            type="text"
            placeholder="Мебель"
            value={furniture}
            onChange={(e) => setFurniture(e.target.value)}
          />
        </form>
      )}

      {typePremise === 'Офисы' && (
        <form className="premiseCharacteristics">
          <div className="area-price">
            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Площадь"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Ремонт"
            value={repair}
            onChange={(e) => setRepair(e.target.value)}
          />
          <input
            type="text"
            placeholder="Мебель"
            value={furniture}
            onChange={(e) => setFurniture(e.target.value)}
          />
        </form>
      )}

      {typePremise === 'Склады' && (
        <form className="premiseCharacteristics">
          <div className="area-price">
            <input
              type="number"
              placeholder="Цена"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Площадь"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Ремонт"
            value={repair}
            onChange={(e) => setRepair(e.target.value)}
          />
        </form>
      )}
      <p id="errorMessage" style={{ marginTop: '15px' }}>
        {errorText}
      </p>
      <button className="addButton" onClick={add}>
        Добавить
      </button>
    </div>
  );
}

export default AddPremiseData;
