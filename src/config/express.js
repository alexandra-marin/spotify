import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

export default app => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
  }));
};
