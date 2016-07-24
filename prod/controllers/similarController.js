'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postgres = require('../database/postgres');

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getSimilar = function getSimilar(req, res) {
  var hypeeID = req.body.id;
  _postgres.Similar.findAll({
    where: {
      originalHypee: hypeeID,
      include: [{
        model: _postgres.Hypee,
        as: 'originalHypee'
      }]
    },
    order: [_sequelize2.default.fn('RAND')],
    limit: 3
  }).then(function (results) {
    res.status(200).send(results.rows);
  });
};

exports.default = { getSimilar: getSimilar };