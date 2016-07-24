import postGres from '../database/postgres';

// cache will clear when an event is deleted
const cache = {};
// returns a numerical value given a 'hypee' id -- get
const getHypeCount = (req, res) => {
  if (cache.req.query.Hypee) {
    res.status(200).send({ hypeCount: cache.req.query.Hypee });
  } else {
    postGres.Hypee.find({
      where: {
        id: req.query.Hypee,
      },
    }).then(hypeData => res.status(200).send({ hypeCount: hypeData.hypes }));
  }
};

// returns a numerical value after increasing hype value by 1, given a 'hypee' id -- post
const increaseHypeCount = (req, res) => {
  if (cache.req.body.Hypee) {
    cache.req.body.Hypee++;
  } else {
    cache.req.body.Hypee = 1;
  }
  res.status(200).send({ hypeCount: cache.req.body.Hypee });
};

// deletes a cached version of an event when it is over -- delete
const deleteHypeEvent = (req, res) => {
  postGres.Hypee.find({
    where: {
      id: req.body.Hypee,
    },
  }).then(hypeData => hypeData.updateAttributes({ hypes: cache.req.body.Hypee }));
  delete cache.req.body.Hypee;
  res.sendStatus(200);
};

export default { getHypeCount, increaseHypeCount, deleteHypeEvent };
