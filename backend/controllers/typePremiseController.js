const authenticateToken = require('../services/tokenService');
const typePremiseDb = require('../repositories/typePremiseDb');

module.exports = {
    async getTypesPremise(req, res) {
        try {
            const userData = authenticateToken(req, res);
            if (!userData) return res.status(401).send();
    
            return res.status(200).send(await typePremiseDb.findAllTypesPremises());
        } catch (error) {
            console.error('Ошибка при получении типов помещений:', error);
            return res.status(500).send('Internal Server Error');
        }
    },
    
    async getTypePremise (req, res) {
        try {
            const userData = authenticateToken(req, res);
            if (!userData) return res.status(401).send();

            return res.status(200).send(
                await prisma.typePremises.findUnique({
                    where: {
                        ID: parseInt(req.query.id),
                    },
                })
            );
        } catch (error) {
            console.error('Ошибка при получении типа помещения:', error);
            return res.status(500).send('Internal Server Error');
        }
    }
}

