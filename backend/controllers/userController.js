const usersDb = require('../repositories/usersDb');
const authenticateToken = require('../services/tokenService');

const imgSrc = 'data:image/png;base64,';

module.exports = {
  async editUser(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      await usersDb.editUserByLogin(
        req.body.login,
        req.body.name,
        req.body.surname,
        req.body.phoneNumber
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при редактировании пользователя:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async editUserById(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 2) return res.status(403).send();

      const user = await usersDb.findUserByLogin(req.body.login);
      if (user && user.ID !== parseInt(req.body.id))
        return res.status(409).send();

      await usersDb.editUserById(
        parseInt(req.body.id),
        req.body.login,
        req.body.password,
        parseInt(req.body.role),
        req.body.name,
        req.body.surname,
        req.body.phoneNumber
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при редактировании пользователя по ID:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async addUser(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 2) return res.status(403).send();

      if (await usersDb.findUserByLogin(req.body.login))
        return res.status(409).send();
      await usersDb.createUser(
        req.body.login,
        req.body.password,
        parseInt(req.body.role),
        req.body.name,
        req.body.surname,
        req.body.phoneNumber
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при добавлении пользователя:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getUser(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const user = await usersDb.findUserById(parseInt(req.query.id));
      user.Photo =
        imgSrc + `${user.Photo ? user.Photo.toString('base64') : null}`;

      if (!user) {
        return res.status(404).send('User not found');
      }

      res.send(user);
    } catch (error) {
      console.error('Ошибка при получении пользователя:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getMyUser(req, res) {
    try {
      const userData = authenticateToken(req, res);

      const user = await usersDb.findUserById(parseInt(userData.id));
      user.Photo =
        imgSrc + `${user.Photo ? user.Photo.toString('base64') : null}`;

      if (!user) {
        return res.status(404).send('User not found');
      }

      res.send(user);
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async deleteUser(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 2) return res.status(403).send();

      await usersDb.deleteUserById(parseInt(req.body.id));

      res.send();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getAllUser(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 2) return res.status(403).send();

      const users = await usersDb.findAllUsers();

      for (const user of users)
        user.Photo =
          imgSrc + `${user.Photo ? user.Photo.toString('base64') : null}`;

      res.send(users);
    } catch (error) {
      console.error('Ошибка при получении всех пользователей:', error);
      return res.status(500).send('Internal Server Error');
    }
  },
};
