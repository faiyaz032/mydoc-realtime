//dependencies
const dotenv = require('dotenv');
const express = require('express');
const apiRouter = require('./routes');
const morgan = require('morgan');
const cors = require('cors');
const errorMiddlewares = require('./middlewares/errorMiddlewares');
const isAuth = require('./middlewares/isAuth');

//env config
dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', isAuth, (req, res, next) => {
  res.json({ status: 'success', message: 'Welcome to the server of MyDoc' });
});

//api routes
app.use('/api', apiRouter);

app.all('*', errorMiddlewares.notFoundHandler);
app.use(errorMiddlewares.defaultErrorHandler);

module.exports = app;
