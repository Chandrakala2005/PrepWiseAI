import expressApp from '../server/server.cjs';

// Extract default export if wrapped by CommonJS loader
const app = expressApp.default || expressApp;

export default function handler(req, res) {
  return app(req, res);
}
