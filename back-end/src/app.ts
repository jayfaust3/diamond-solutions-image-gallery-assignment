import { dirname } from 'path';
import express from 'express';
import logger from 'morgan';
import { config } from 'dotenv';
import imagesRouter from './routes/images';

config({
  path: dirname(__dirname)
});

const {
  PORT: appPort
} = process.env;

const app = express();

app
  .use(logger('dev'))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use('/api/images', imagesRouter)
  .use(express.json({limit: '25mb'}))
  .use(express.urlencoded({limit: '25mb', extended: true}))
  .listen(appPort ? +appPort : 80);