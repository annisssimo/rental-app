const express = require("express");
const rentalController = require('../controllers/rentalController.js');

module.exports = () => {
    const router = express.Router(); 

    router.get('/all', (req, res) => rentalController.getRentals(req, res));
    router.get('/my', (req, res) => rentalController.getMyRentals(req, res));
    router.get('/applications', (req, res) => rentalController.getApplications(req, res));
    router.post('/add', (req, res) => rentalController.addRental(req, res));
    router.get('/status', (req, res) => rentalController.getStatus(req, res));
    router.delete('/remove', (req, res) => rentalController.cancelApplication(req, res));
    router.delete('/remove_by_id', (req, res) => rentalController.deleteRental(req, res));
    router.put('/accept', (req, res) => rentalController.acceptApplication(req, res));
    router.use((req, res) => res.status(404).send('404'));

    return router;
}