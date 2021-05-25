require('dotenv').config();
require('./config/mongo-init');
const express = require('express');
const cors = require('cors');
const path = require('path');

const posts = require('./routes/posts');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join('uploads')));

app.use('/posts', posts);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}!`));
