const http = require('http');

const data = JSON.stringify({
  username: 'admin',
  password: 'password123'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => console.log(`STATUS: ${res.statusCode}\nBODY: ${body}`));
});

req.on('error', error => console.error(`ERROR: ${error.message}`));
req.write(data);
req.end();
