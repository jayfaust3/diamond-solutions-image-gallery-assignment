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
  .use(express.urlencoded({ extended: false }))
  .use(express.json())
  .use('/api/images', imagesRouter)
  .listen(appPort);