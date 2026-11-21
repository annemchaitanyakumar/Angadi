import http from 'http';

http.get('http://localhost:3000/admin', (res) => {
  console.log('HTTP Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('HTML Length:', data.length);
    console.log('Includes shell:', data.includes('id="shell"'));
    console.log('Includes signin:', data.includes('id="signin"'));
    console.log('Includes admin-fixes.css:', data.includes('/assets/admin-fixes.css'));
    console.log('Includes AdminRealtimeSync:', data.includes('live-pill') || data.includes('AdminRealtimeSync') || data.includes('Live'));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
