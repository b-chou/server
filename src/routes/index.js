import express from 'express';
import usersController from '../controllers/usersController';
import hypeController from '../controllers/hypeController';
import fetch from 'node-fetch';

// Create Router
// eslint-disable-next-line
const router = express.Router();

// router.get('/api/users', usersController.getUsers);
router.route('/validation')
  .get(usersController.redisCheck)
  .post(usersController.postUser)
  .put(usersController.changeUserInfo);

router.route('/hypeCount')
  .get(hypeController.getHypeCount)
  .post(hypeController.increaseHypeCount)
  .delete(hypeController.deleteHypeEvent);

router.route('/getAllEvents')
  .get(hypeController.getAllEvents);

router.route('/getCurrentEvents')
  .get(hypeController.getCurrentEvents);

router.route('/getHypeTimeline')
  .get(hypeController.getTimeline);

router.route('/getSpecificEvent')
  .get(hypeController.getSpecificEvent);
router.route('/testing')
  .get((req, res) => {
    const limit = 1000;
    let testcount = 0;
    fetch('http://107.170.231.229:8000/getallevents?day=1')
      .then(data => data.json())
      .then(data => data.events)
      .then(events => {
        const startId = events[0].id;
        for (let i = 0; i < limit; i++) {
          setTimeout(() => {
            console.log(testcount);
            testcount += 1;
            const randomHype = Math.floor(Math.random() * (30 - startId)) + startId;
            if (testcount === limit) {
              res.send('Done');
            }
            fetch('http://107.170.231.229:8000/hypecount', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                Hypee: randomHype,
                timestamp: Date.now(),
              }),
            });
          }, i * 200);
        }
      });
  });


export default router;
