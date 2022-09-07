const express = require('express');
// const { cwd } = require('process');
const db = require('./config/connection');
const routes = require ('./routes');

const app = express();
const PORT = proces.env.port || 3001;

// const activity = cwd.includes('01-Activities')
//     ? cwd.split('/01-Activities/')[1]
//     : cwd;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(routes);

db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server for ${activity} running on port ${PORT}!`);
    });
  });
