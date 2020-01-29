const http = require('http');
const { methods } = require('./lib/handlers');

const processRequest = function(request, comment) {
  const handlers = methods[request.method] || methods.NOT_ALLOWED;
  const handler = handlers[request.url] || handlers.default;
  return handler(request, comment);
};

const handleRequest = function(request, response) {
  let comment = '';
  request.on('data', chunk => (comment += chunk));
  request.on('end', () => {
    const { contentType, statusCode, body } = processRequest(request, comment);
    response.setHeader('Content-Type', contentType);
    response.writeHead(statusCode);
    response.end(body);
  });
};

const main = function(port = 4000) {
  const server = http.createServer(handleRequest);
  server.on('error', err => console.error('server error', err));
  server.listen(port, () =>
    console.warn('started listening', server.address())
  );
};

main(process.argv[2]);
