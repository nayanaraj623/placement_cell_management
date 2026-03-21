const http = require('http');

function makeRequest(path, method, data, token, callback) {
  const payload = JSON.stringify(data);
  const headers = { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  
  const req = http.request({ hostname: 'localhost', port: 5000, path, method, headers }, res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => callback(res.statusCode, body));
  });
  req.on('error', e => console.error(e));
  req.write(payload);
  req.end();
}

// 1. Login as Student
makeRequest('/api/auth/login', 'POST', { username: 'student1', password: 'password123' }, null, (status, body) => {
  console.log('LOGIN:', status, body);
  const data = JSON.parse(body);
  if (status === 200 && data.accessToken) {
    // 2. Apply for a Job (Assume job_id = 1 is the seeded Google Job)
    makeRequest('/api/placements/apply', 'POST', { job_id: 1 }, data.accessToken, (status2, body2) => {
      console.log('APPLY:', status2, body2);
    });
  }
});
