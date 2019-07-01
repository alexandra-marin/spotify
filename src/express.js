import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import config from './config';
import rest from './rest';

export default () => {
  const app = express();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use(fileUpload({ limits: { fileSize: config.fileUpload.maxSize } }));

  const router = express.Router();
  Object.values(rest).forEach(api => api(router));
  app.use('/', router);

  const server = app.listen(config.apiPort, () => {
    console.log(`[Server] listening on port ${config.apiPort}`);
  });

  app.close = () => server.close();

  return app;
};
