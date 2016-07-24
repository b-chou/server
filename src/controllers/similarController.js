import { Similar, Hypee } from '../database/postgres';
import Sequelize from 'sequelize';

const getSimilar = (req, res) => {
  const hypeeID = req.body.id;
  Similar.findAll({
    where: {
      originalHypee: hypeeID,
      include: [{
        model: Hypee,
        as: 'originalHypee',
      }],
    },
    order: [Sequelize.fn('RAND')],
    limit: 3,
  })
    .then(results => {
      res.status(200).send(results.rows);
    });
};

export default { getSimilar };
