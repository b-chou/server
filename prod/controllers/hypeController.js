'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _postgres = require('../database/postgres');

var _postgres2 = _interopRequireDefault(_postgres);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
// returns a numerical value given a 'Hypee' id -- get
var getHypeCount = function getHypeCount(req, res) {
  if (boolBox[req.query.Hypee] === false) {
    if (cache[req.query.Hypee]) {
      res.status(200).send({ hypeCount: cache[req.query.Hypee] });
    } else {
      _postgres2.default.Hypee.find({
        where: {
          id: req.query.Hypee
        }
      }).then(function (hypeData) {
        console.log('!!');
        res.status(200).send({ hypeCount: hypeData.hypes });
      });
    }
  } else {
    _postgres2.default.Hypee.find({
      where: {
        id: req.query.Hypee
      }
    }).then(function (hypeData) {
      console.log(hypeData, 'aksja;flaskldf');
      var minuteToElapse = minuteDifference(hypeData.start_time, hypeData.end_time);
      // first array corresponds to all new entries within a minute time frame
      // second array corresponds to an array of total values per minute
      timeBox[req.query.Hypee] = [[], [], minuteToElapse];
      console.log(timeBox[req.query.Hypee], req.query.Hypee, '*******');
      // update values every minute
      var timeBar = setInterval(function () {
        timeBox[req.query.Hypee][1].push(timeBox[req.query.Hypee][0].length);
        timeBox[req.query.Hypee][0].splice(0, timeBox[req.query.Hypee][0].length);
      }, 60000);
      // clear the set interval after x minutes
      setTimeout(function () {
        clearInterval(timeBar);
        fetch('http://localhost:8000/hypeCount', {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Hypee: req.query.Hypee })
        });
      }, 60000 * (minuteToElapse + 10));
      boolBox[req.query.Hypee] = true;
      res.status(200).send({ hypeCount: hypeData.hypes });
    });
  }
};
// returns a numerical value after increasing hype value by 1, given a 'Hypee' id -- post
// post this data with an associated timestamp for use for statistics later
var increaseHypeCount = function increaseHypeCount(req, res) {
  if (cache[req.body.Hypee]) {
    cache[req.body.Hypee]++;
  } else {
    cache[req.body.Hypee] = 1;
  }
  console.log(timeBox);
  timeBox[req.body.Hypee][0].push(req.body.timeStamp);
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