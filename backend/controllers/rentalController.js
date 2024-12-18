const authenticateToken = require('../services/tokenService');
const rentalsDb = require('../repositories/rentalsDb');

const imgSrc = 'data:image/png;base64,';

module.exports = {
  async getRentals(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const rentals = await rentalsDb.findRentalsWithPremiseByTenant(
        parseInt(userData.id)
      );

      for (const rental of rentals)
        rental.Premise.Image =
          imgSrc +
          `${
            rental.Premise.Image
              ? rental.Premise.Image.toString('base64')
              : null
          }`;

      return res.status(200).send(rentals);
    } catch (error) {
      console.error('Ошибка при получении аренд:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getMyRentals(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const rentals = await rentalsDb.findRentalsWithPremiseByOwner(
        parseInt(userData.id)
      );

      for (const rental of rentals)
        rental.Premise.Image =
          imgSrc +
          `${
            rental.Premise.Image
              ? rental.Premise.Image.toString('base64')
              : null
          }`;

      return res.status(200).send(rentals);
    } catch (error) {
      console.error('Ошибка при получении аренд владельца:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async addRental(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      await rentalsDb.createRental(
        parseInt(req.body.premise),
        parseInt(userData.id)
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при создании аренды:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getStatus(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      const rental = await rentalsDb.findRentalsByPremiseAndTenant(
        parseInt(req.query.premise),
        parseInt(userData.id)
      );

      if (!rental[0]) return res.status(200).send('not_sent');

      switch (rental[0].Status) {
        case 0:
          return res.status(200).send('considered');
        case 1:
          return res.status(200).send('accepted');
        default:
          return res.status(200).send('not_sent');
      }
    } catch (error) {
      console.error('Ошибка при получении статуса аренды:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async cancelApplication(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      await rentalsDb.deleteRentalsByPremiseAndTenant(
        parseInt(req.body.premise),
        parseInt(userData.id)
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при удалении заявки на аренду:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async deleteRental(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();

      await rentalsDb.deleteRentalById(parseInt(req.body.id));

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при удалении аренды:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async getApplications(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 1) return res.status(403).send();

      const rentals = await rentalsDb.findRentalsWithPremiseAndTenantByOwner(
        parseInt(userData.id),
        0
      );

      for (const rental of rentals) {
        rental.Premise.Image =
          imgSrc +
          `${
            rental.Premise.Image
              ? rental.Premise.Image.toString('base64')
              : null
          }`;
        rental.Tenant.Photo =
          imgSrc +
          `${
            rental.Tenant.Photo ? rental.Tenant.Photo.toString('base64') : null
          }`;
      }

      return res.status(200).send(rentals);
    } catch (error) {
      console.error('Ошибка при получении заявок:', error);
      return res.status(500).send('Internal Server Error');
    }
  },

  async acceptApplication(req, res) {
    try {
      const userData = authenticateToken(req, res);
      if (!userData) return res.status(401).send();
      if (userData.role !== 1) return res.status(403).send();

      await rentalsDb.changeRentalStatusToAccepted(parseInt(req.body.id));
      await rentalsDb.deleteRentalsWithConsideredStatusByPremise(
        parseInt(req.body.ID_premise)
      );

      return res.status(200).send();
    } catch (error) {
      console.error('Ошибка при подтверждении заявки:', error);
      return res.status(500).send('Internal Server Error');
    }
  },
};
