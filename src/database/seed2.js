import postGres from './postgres';
import data1 from './aug_5';
import dotenv from 'dotenv';
dotenv.config();

/* eslint-disable */
postGres.sequelize.sync({ force: true })
  .then(() => {
    for (let i = 0; i < data1.length; i++) {
      postGres.Hypee.create({
        name: data1.name,
        start_time: data1.start,
        end_time: data1.end,
        location: data1.stage,
        genre: data1.genre,
        upvotes: data1.upvotes,
        events: data1.events,
        followers: data1.followers,
        album: data1.album,
        time: data1.time,
        day: 1,
      });
    }
  });
