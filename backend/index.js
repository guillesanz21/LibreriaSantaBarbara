const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const router = require("./routes");

// --------------------------------------------- //

dotenv.config({
  path: path.resolve(__dirname, `./config/.env.${process.env.ENVIRONMENT}`),
});

require("./models/Book");

const connection = mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("CONNECTED TO DB!");
  })
  .catch((err) => {
    console.log("ERROR", err.message);
  });

//autoIncrement.initialize(connection);

const app = express();

// ---------------------------------------------- //

app.use(bodyParser.json());

app.use("/", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log("API REST Server listening on port 3000!!");
});
