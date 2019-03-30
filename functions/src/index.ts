import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const api = functions.https.onRequest(async (request, response) => {
  const result = await handleRequest(request);
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
});

async function handleRequest(request: functions.https.Request) {
  // NOTE: Because this is a POC, the routing is done in a simple way!
  if (request.path === '/info') {
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
  } else if (request.path === '/api/rooms') {
    if (request.method === 'GET') {
      return [{
        id: "foo",
        name: "Foo",
      }, {
        id: "bar",
        name: "Bar",
      }];
    } else if (request.method === 'POST') {
      console.log(request.body);
      return {
        id: 'xxx',
        name: request.body.name,
      };
    }
  }
  return null;
}
