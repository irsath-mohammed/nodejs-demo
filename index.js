const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const bodyParser = require('body-parser');

// Import routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const userRoute = require('./routes/users');


dotenv.config();

// conect db
mongoose.connect("mongodb+srv://irsath:Shift%40786@cluster0.x1bfw.mongodb.net/DemoDB?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true},
  () => console.log('DB connected')
);

// middleware
app.use(express.json());

//Route middleware
app.use('/api/user', authRoute);

app.use('/api/posts', postRoute);

app.use('/api/users', userRoute);

app.listen(3000, () => console.log('server up and running'));