import postGres from '../database/postgres';

// cache will clear when an event is deleted
const cache = {};

const timeBox = {};
const boolBox = {};

// utility function to return minutes between a start and end time in format: 12:32
const minuteDifference = (startTime, endTime) => {
  const start = startTime.split(':');
  const end = endTime.split(':');
  const startDate = new Date(0, 0, 0, start[0], start[1], 0);
  const endDate = new Date(0, 0, 0, end[0], end[1], 0);
  let diff = endDate.getTime() - startDate.getTime();
  const hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / 1000 / 60) + (hours * 60);
  return minutes;
};

// returns a numerical value given a 'Hypee' id -- get
const getHypeCount = (req, res) => {
  if (!boolBox[req.query.Hypee]) {
    if (cache[req.query.Hypee]) {
      res.status(200).send({ hypeCount: cache[req.query.Hypee] });
    } else {
      postGres.Hypee.find({
        where: {
          id: req.query.Hypee,
        },
      }).then(hypeData => res.status(200).send({ hypeCount: hypeData.hypes }));
    }
  } else {
    postGres.Hypee.find({
      where: {
        id: req.query.Hypee,
      },
    }).then(hypeData => {
      const minuteToElapse = minuteDifference(hypeData.start_time, hypeData.end_time);
      // first array corresponds to all new entries within a minute time frame
      // second array corresponds to an array of total values per minute
      timeBox[req.query.Hypee] = [[], [], minuteToElapse];
      // update values every minute
      const timeBar = setInterval(() => {
        timeBox[req.query.Hypee][1].push(timeBox[req.query.Hypee][0].length);
        timeBox[req.query.Hypee][0].splice(0, timeBox[req.query.Hypee][0].length);
      }, 60000);
      // clear the set interval after x minutes
      setTimeout(() => {
        clearInterval(timeBar);
        fetch('http://localhost:8000/hypeCount', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Hypee: req.query.Hypee }),
        });
      }, 60000 * (minuteToElapse + 10));
      boolBox[req.query.Hypee] = true;
      res.status(200).send({ hypeCount: hypeData.hypes });
    });
  }
};

// returns a numerical value after increasing hype value by 1, given a 'Hypee' id -- post
// post this data with an associated timestamp for use for statistics later
const increaseHypeCount = (req, res) => {
  if (cache.req.body.Hypee) {
    cache[req.body.Hypee]++;
  } else {
    cache[req.body.Hypee] = 1;
  }
  timeBox[req.query.Hypee][0].push(req.body.timeStamp);
  res.status(200).send({ hypeCount: cache[req.body.Hypee] });
};

// deletes a cached version of an event when it is over -- delete
const deleteHypeEvent = (req, res) => {
  postGres.Hypee.find({
    where: {
      id: req.body.Hypee,
    },
  }).then(hypeData => {
    let total = 0;
    // eslint-disable-next-line
    cache[req.body.Hypee].forEach(val => total += val);
    hypeData.updateAttributes({ hypes: total });
  });
  delete cache[req.body.Hypee];
  delete boolBox[req.body.Hypee];
  res.sendStatus(200);
};

// returns all events in an array
const getAllEvents = (req, res) => {
  postGres.Hypee.findAll()
    .then(data => res.status(200).send({ events: data }));
};

// returns a spread of hypes per minute
const getTimeline = (req, res) => {
  res.send({ data: timeBox[req.query.Hypee][1], totalTime: timeBox[req.query.Hypee][2] });
};

export default { getHypeCount, increaseHypeCount, deleteHypeEvent, getAllEvents, getTimeline };
