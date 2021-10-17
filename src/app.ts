import express from 'express';
import { AccountRouter } from './routes';

class App {
  private app;

  constructor() {
    this.app = express();

    this.init();
  }

  init() {
    this.middleware();
    this.routes();
  }

  middleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use('/api/v1', AccountRouter);
  }

  public get getApp() {
    return this.app;
  }
}

export default App;
