import * as functions from 'firebase-functions';
import * as express from 'express';
import { initializeApp, firestore } from 'firebase-admin';

initializeApp();

const app = express();

app.get('/api/info', respond(async (request) => {
  return {
    method: request.method,
    baseUrl: request.baseUrl,
    hostname: request.hostname,
    path: request.path,
    query: request.query,
    params: request.params,
    url: request.url,
    originalUrl: request.originalUrl,
  };
}));

app.get('/api/rooms', respond(async (request) => {
  const rooms = await firestore().collection('rooms').get();
  return rooms.docs.map(doc => ({
    id: doc.id, ...doc.data(),
  }));
}));

app.post('/api/rooms', respond(async (request) => {
  const {name} = request.body;
  const data = {name};
  const doc = await firestore().collection('rooms').add(data);
  return { id: doc.id, ...data };
}));

function respond(cb: (req: express.Request) => Promise<any>) {
  return async function(request: express.Request, response: express.Response) {
    try {
      const result = await cb(request);
      if (result) {
        response.status(200);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(result));
      } else {
        response.status(404);
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify({
          message: `Endpoint ${request.path} not found`,
        }));
      }
    } catch (error) {
      console.error(error);
      response.status(500);
      response.send(String(error));
    }
  }
}

export const api = functions.https.onRequest(app);
