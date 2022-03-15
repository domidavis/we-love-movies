const { PORT = 5000 } = process.env;
const express = require("express");
const cors = require("cors");
const knex = require("./db/connection");

const app = express();
const router = express.Router()
const listener = () => console.log(`Listening on Port ${PORT}!`);

router.get('/', cors(), (req, res) => {
  res.json({ message: 'Hello Heroku!' });
})

app.use('/', router);

knex.migrate
  .latest()
  .then((migrations) => {
    console.log("migrations", migrations);
    app.listen(PORT, listener);
  })
  .catch(console.error);

module.exports = app