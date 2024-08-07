const express = require('express');
const connectDB = require('./middleware/dbConnect');
const login = require('./routes/login.routes');
const upload = require('./routes/upload.routes');
const setupMiddleware = require('./middleware/app.middleware');
require('dotenv').config();
const app = express();

setupMiddleware(app);

connectDB();

app.use(login)
app.use(upload)

app.listen(4000, () => {
  console.log('Server is running at http://localhost:4000');
});