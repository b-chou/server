import postGres from './postgres';
import data1 from './aug_5';
import dotenv from 'dotenv';
dotenv.config();

/* eslint-disable */
postGres.sequelize.sync({ force: true })
  .then(() => {
    for (let i = 0; i < data1.length; i++) {
      postGres.Hypee.create({
        name: data1[i].name,
        start_time: data1[i].start,
        end_time: data1[i].end,
        location: data1[i].stage,
        genre: data1[i].genre,
        image: data1[i].image,
        description: data1[i].description,
        upvotes: data1[i].upvotes,
        events: data1[i].events,
        followers: data1[i].followers,
        album: data1[i].album,
        time: data1[i].time,
        day: 1,
      });
    }
  });
