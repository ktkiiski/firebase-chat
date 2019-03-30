import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest((request, response) => {
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({
    method: JSON.stringify(request.method),
    baseUrl: JSON.stringify(request.baseUrl),
    hostname: JSON.stringify(request.hostname),
    path: JSON.stringify(request.path),
    query: JSON.stringify(request.query),
    params: JSON.stringify(request.params),
    url: JSON.stringify(request.url),
    originalUrl: JSON.stringify(request.originalUrl),
  }));
});
