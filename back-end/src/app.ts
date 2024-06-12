import express from 'express';
import logger from 'morgan';
import { config } from 'dotenv';
import imagesRouter from './routes/images';

config();

const PORT = process.env.PORT || 80;

const app = express();

const log = logger('dev');

app
  .use(log)
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/api/images', imagesRouter)
  .use(express.json({limit: '25mb'}))
  .use(express.urlencoded({limit: '25mb', extended: true}))
  .listen(PORT);