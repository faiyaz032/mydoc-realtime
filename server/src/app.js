//dependencies
const dotenv = require('dotenv');
const express = require('express');
const apiRouter = require('./routes');
const morgan = require('morgan');
const cors = require('cors');
const errorMiddlewares = require('./middlewares/errorMiddlewares');

//env config
dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

//api routes
app.use('/api', apiRouter);

app.all('*', errorMiddlewares.notFoundHandler);
app.use(errorMiddlewares.defaultErrorHandler);

module.exports = app;
