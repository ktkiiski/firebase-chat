import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({
    method: request.method,
    baseUrl: request.baseUrl,
    hostname: request.hostname,
    path: request.path,
    query: request.query,
    params: request.params,
    url: request.url,
    originalUrl: request.originalUrl,
  }));
});
