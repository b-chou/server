'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postgres = require('../database/postgres');

var _postgres2 = _interopRequireDefault(_postgres);

var _cron = require('cron');

var _cron2 = _interopRequireDefault(_cron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CronJob = _cron2.default.CronJob;
var schedule = [];
// cache will clear when an event is deleted
var cache = {};
var timeBox = {};
var boolBox = {};

// utility function to return minutes between a start and end time in format: 12:32
var minuteDifference = function minuteDifference(startTime, endTime) {
  var start = startTime.split(':');
  var end = endTime.split(':');
  var startDate = new Date(0, 0, 0, start[0], start[1], 0);
  var endDate = new Date(0, 0, 0, end[0], end[1], 0);
  var diff = endDate.getTime() - startDate.getTime();
  var hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  var minutes = Math.floor(diff / 1000 / 60) + hours * 60;
  return minutes;
};

_postgres2.default.Hypee.findAll().then(function (hypees) {
  hypees.forEach(function (hypee) {
    var start = hypee.start_time.split(':');
    var end = hypee.end_time.split(':');
    var cronDay = hypee.day + 4;
    var cronMinute = '00';
    var cronHour = '12';
    if (start[0] === end[0]) {
      cronHour = start[0];
    } else {
      cronHour = start[0] + '-' + end[0];
    }
    if (Number(start[1]) > Number(end[1])) {
      cronMinute = start[1] + '-59,0-' + end[1];
    } else {
      cronMinute = start[1] + '-' + end[1];
    }
    // const cronTime = '00 * * * * *';
    var cronTime = '00 ' + cronMinute + ' ' + cronHour + ' ' + cronDay + ' 9 *';
    console.log('Creating job for', hypee.name, cronTime);
    schedule.push(new CronJob({
      cronTime: cronTime,
      onTick: function onTick() {
        if (!timeBox[hypee.id]) {
          var minuteToElapse = minuteDifference(hypee.start_time, hypee.end_time);
          timeBox[hypee.id] = [[], [], minuteToElapse];
        }
        timeBox[hypee.id][1].push(timeBox[hypee.id][0].length);
        timeBox[hypee.id][0].splice(0, timeBox[hypee.id][0].length);
        console.log(timeBox);
      },
      onComplete: function onComplete() {
        fetch('http://localhost:8000/hypeCount', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Hypee: hypee.id })
        });
      },
      start: true,
      timeZone: 'America/Los_Angeles'
    }));
  });
});

// returns a numerical value given a 'Hypee' id -- get
var getHypeCount = function getHypeCount(req, res) {
  if (cache[req.query.Hypee]) {
    res.status(200).send({ hypeCount: cache[req.query.Hypee] });
  } else {
    _postgres2.default.Hypee.find({
      where: {
        id: req.query.Hypee
      }
    }).then(function (hypeData) {
      res.status(200).send({ hypeCount: hypeData.hypes });
    });
  }
  // if (boolBox[req.query.Hypee] !== undefined) {
  //   if (cache[req.query.Hypee]) {
  //     res.status(200).send({ hypeCount: cache[req.query.Hypee] });
  //   } else {
  //     postGres.Hypee.find({
  //       where: {
  //         id: req.query.Hypee,
  //       },
  //     }).then(hypeData => {
  //       res.status(200).send({ hypeCount: hypeData.hypes });
  //     });
  //   }
  // } else {
  //   postGres.Hypee.find({
  //     where: {
  //       id: req.query.Hypee,
  //     },
  //   }).then(hypeData => {
  //     const minuteToElapse = minuteDifference(hypeData.start_time, hypeData.end_time);
  //     // first array corresponds to all new entries within a minute time frame
  //     // second array corresponds to an array of total values per minute
  //     timeBox[req.query.Hypee] = [[], [], minuteToElapse];
  //     // update values every minute
  //     const timeBar = setInterval(() => {
  //       timeBox[req.query.Hypee][1].push(timeBox[req.query.Hypee][0].length);
  //       timeBox[req.query.Hypee][0].splice(0, timeBox[req.query.Hypee][0].length);
  //     }, 60000);
  //     // clear the set interval after x minutes
  //     setTimeout(() => {
  //       clearInterval(timeBar);
  //       fetch('http://localhost:8000/hypeCount', {
  //         method: 'DELETE',
  //         headers: {
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ Hypee: req.query.Hypee }),
  //       });
  //     }, 60000 * (minuteToElapse + 10));
  //     boolBox[req.query.Hypee] = true;
  //     res.status(200).send({ hypeCount: hypeData.hypes });
  //   });
  // }
};
// returns a numerical value after increasing hype value by 1, given a 'Hypee' id -- post
// post this data with an associated timestamp for use for statistics later
var increaseHypeCount = function increaseHypeCount(req, res) {
  if (cache[req.body.Hypee]) {
    cache[req.body.Hypee]++;
  } else {
    cache[req.body.Hypee] = 1;
  }
  if (timeBox[req.body.Hypee]) {
    timeBox[req.body.Hypee][0].push(new Date());
  }
  res.status(200).send({ hypeCount: cache[req.body.Hypee] });
};
// deletes a cached version of an event when it is over -- delete
var deleteHypeEvent = function deleteHypeEvent(req, res) {
  _postgres2.default.Hypee.find({
    where: {
      id: req.body.Hypee
    }
  }).then(function (hypeData) {
    var total = 0;
    // eslint-disable-next-line
    cache[req.body.Hypee].forEach(function (val) {
      return total += val;
    });
    hypeData.updateAttributes({ hypes: total });
  });
  delete cache[req.body.Hypee];
  delete boolBox[req.body.Hypee];
  res.sendStatus(200);
};
// returns all events in an array
var getAllEvents = function getAllEvents(req, res) {
  _postgres2.default.Hypee.findAll().then(function (data) {
    return res.status(200).send({ events: data });
  });
};
// returns a spread of hypes per minute
var getTimeline = function getTimeline(req, res) {
  res.send({ data: timeBox[req.query.Hypee][1], totalTime: timeBox[req.query.Hypee][2] });
};
exports.default = { getHypeCount: getHypeCount, increaseHypeCount: increaseHypeCount, deleteHypeEvent: deleteHypeEvent, getAllEvents: getAllEvents, getTimeline: getTimeline };