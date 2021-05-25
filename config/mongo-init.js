const mongoose = require('mongoose');

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const role = process.env.MONGO_ROLE;
const db = process.env.MONGO_DB_NAME;

const mongoConnection = mongoose
  .connect(`mongodb+srv://${user}:${password}@cluster0.wrpxx.mongodb.net/${db}?${role}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('connected to database'))
  .catch(err => console.log(err));

module.exports = mongoConnection;
