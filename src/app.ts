import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
require('dotenv').config();

import AppDataSource from './db/data-source';
import * as middlewares from './middlewares/middlewares';
import taskRoutes from './routes/taskRoutes';
import userRoutes from './routes/userRoutes';
import MessageResponse from './interfaces/MessageResponse';


const app = express();
// console.log('here', process.env.NODE_ENV)
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


// to initialize the initial connection with the database, register all entities
// and "synchronize" database schema, call "initialize()" method of a newly created database
// once in your application bootstrap

AppDataSource.initialize()
  .then(() => {
    console.log('App database is connected')
  })
  .catch((error) => console.log(error))


app.use('/', taskRoutes);
app.use('/users', userRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
