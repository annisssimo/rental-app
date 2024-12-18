const premisesDb = require('../repositories/premisesDb');
const authenticateToken = require('../services/tokenService');

const imgSrc = 'data:image/png;base64,';

module.exports = {
  async getPremises(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const premises = req.query.id
        ? await premisesDb.findNotRentedPremisesByType(parseInt(req.query.id))
        : await premisesDb.findNotRentedPremises();

      for (const premise of premises)
        premise.Image =
          imgSrc + `${premise.Image ? premise.Image.toString('base64') : null}`;

      return res.status(200).send(premises);
    } catch (error) {
      console.error('Ошибка при получении помещений:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getMyPremises(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const premises = await premisesDb.findPremisesByOwner(
        parseInt(userData.id)
      );

      for (const premise of premises)
        premise.Image =
          imgSrc + `${premise.Image ? premise.Image.toString('base64') : null}`;

      return res.status(200).send(premises);
    } catch (error) {
      console.error('Ошибка при получении моих помещений:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getMyRentedPremises(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      if (req.query.ID)
        return res
          .status(200)
          .send(
            await premisesDb.findRentedPremisesByOwner(parseInt(userData.id))
          );
    } catch (error) {
      console.error('Ошибка при получении моих арендованных помещений:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getPremise(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const premise = await premisesDb.findPremiseById(parseInt(req.query.id));
      premise.Image =
        imgSrc + `${premise.Image ? premise.Image.toString('base64') : null}`;

      return res.status(200).send(premise);
    } catch (error) {
      console.error('Ошибка при получении помещения:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async addPremise(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 1) return res.status(403).send();

      await premisesDb.createPremise(
        req.body.name,
        parseFloat(req.body.price),
        req.body.adress,
        parseInt(req.body.type),
        parseInt(userData.id),
        req.body.descriptions
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при добавлении помещения:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async editPremise(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 1) return res.status(403).send('У вас нет прав!');

      if (
        !(await premisesDb.findPremisesByIdAndOwner(
          parseInt(req.body.id),
          parseInt(userData.id)
        ))
      )
        return res.status(403).send('У вас нет прав!');

      await premisesDb.editPremiseById(
        parseInt(req.body.id),
        req.body.name,
        parseFloat(req.body.price),
        req.body.adress,
        parseInt(req.body.type),
        req.body.descriptions
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при редактировании помещения:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async deletePremise(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 1) return res.status(403).send('У вас нет прав!');

      if (
        !(await premisesDb.findPremisesByIdAndOwner(
          parseInt(req.body.id),
          parseInt(userData.id)
        ))
      )
        return res.status(403).send('У вас нет прав!');
      await premisesDb.deletePremiseById(parseInt(req.body.id));

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при удалении помещения:', error);
      return res.status(500).send('Внутренняя ошибка сервера');
    }
  },
};
