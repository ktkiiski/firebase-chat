import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const info = functions.https.onRequest((request, response) => {
  response.setHeader('Content-Type', 'text/html');
  response.send(`<!DOCTYPE HTML>
    <html>
    <head>
      <title>Chat</title>
    </head>
    <body>
      <pre>INFO
      baseUrl: ${JSON.stringify(request.baseUrl)}
      hostname: ${JSON.stringify(request.hostname)}
      method: ${JSON.stringify(request.method)}
      path: ${JSON.stringify(request.path)}
      query: ${JSON.stringify(request.query)}
      params: ${JSON.stringify(request.params)}
      url: ${JSON.stringify(request.url)}
      originalUrl: ${JSON.stringify(request.originalUrl)}
      </pre>
    </body>
    </html>
  `);
});
