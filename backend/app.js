const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PW + process.env.MONGO_URI, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('Connected Successfully!');
}).catch((e) => {
  console.log('Connection Failed!:', e);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static("backend/images"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/post', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
