import postGres from './postgres';
import data1 from './aug_5';
import data2 from './aug_6';
import data3 from './aug_7';
import dotenv from 'dotenv';
dotenv.config();

/* eslint-disable */
postGres.sequelize.sync({ force: true })
  .then(() => {
    const stages = Object.keys(data1);
    for (let i = 0; i < stages.length; i++) {
      const events = data1[stages[i]];
      for (let eventItr = 0; eventItr < events.length; eventItr++) {
        const event = events[eventItr];
        postGres.Hypee.create({
          name: event.name,
          start_time: event.start,
          end_time: event.end,
          location: stages[i],
          day: 1,
          description: event.description,
        });
      }
    }
  })
  .then(() => {
    const stages = Object.keys(data2);
    for (let i = 0; i < stages.length; i++) {
      const events = data2[stages[i]];
      for (let eventItr = 0; eventItr < events.length; eventItr++) {
        const event = events[eventItr];
        postGres.Hypee.create({
          name: event.name,
          start_time: event.start,
          end_time: event.end,
          location: stages[i],
          day: 2,
          description: event.description,
        });
      }
    }    
  })
  .then(() => {
    const stages = Object.keys(data3);
    for (let i = 0; i < stages.length; i++) {
      const events = data3[stages[i]];
      for (let eventItr = 0; eventItr < events.length; eventItr++) {
        const event = events[eventItr];
        postGres.Hypee.create({
          name: event.name,
          start_time: event.start,
          end_time: event.end,
          location: stages[i],
          day: 3,
          description: event.description,
        });
      }
    }    
  });
