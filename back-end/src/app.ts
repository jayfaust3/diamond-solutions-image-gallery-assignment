import { dirname } from 'path';
import express from 'express';
import logger from 'morgan';
import { config } from 'dotenv';
import imagesRouter from './routes/images';

config({
  path: `${dirname(__dirname)}/.env`
});

const {
  PORT
} = process.env;

const appPort = PORT ? +PORT : 80;

const app = express();

app
  .use(logger('dev'))
  // .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/api/images', imagesRouter)
  // .use(express.json({limit: '25mb'}))
  // .use(express.urlencoded({limit: '25mb', extended: true}))
  .listen(appPort);