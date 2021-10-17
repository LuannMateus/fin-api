import http from 'http';
import App from './app';

const PORT = process.env.PORT || 3000;

const appInitialize = new App();

const app = appInitialize.getApp;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
