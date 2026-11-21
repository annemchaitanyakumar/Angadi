import http from 'http';

http.get('http://localhost:3000/assets/admin-fixes.css', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Total Length:', data.length);
    console.log('Checks:');
    console.log('1. .pcard__name (Fix 1):', data.includes('.page--admin .pcard__name'));
    console.log('2. .seg__btn[aria-pressed="true"] (Fix 2 & 3):', data.includes('.page--admin .seg__btn[aria-pressed="true"]'));
    console.log('3. .tabs__line (Fix 4):', data.includes('.page--admin .tabs__line'));
    console.log('4. .select select (Fix 5 & 6):', data.includes('.page--admin .select select'));
    console.log('5. .pcard__price (Fix 1):', data.includes('.page--admin .pcard__price'));
    console.log('6. cream color for active seg:', data.includes('color: var(--cream) !important;'));
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
