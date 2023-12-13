require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const profilingRoutes = require("./routes/profilingRoutes");
var cors = require("cors");

const app = express();
const port = process.env.PORT;
const MongoURL = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("hello from express");
});

app.use("/api", userRoutes);
app.use("/api", profilingRoutes);

mongoose
  .connect(MongoURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
