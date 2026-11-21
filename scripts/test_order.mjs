async function testOrder() {
  const payload = {
    orderId: 'ANG-2026-TEST1',
    customer: {
      name: 'Chaitanya Kumar',
      email: 'chaitanya@example.com'
    },
    address: {
      line1: '123 Banjara Hills',
      city: 'Hyderabad',
      region: 'Telangana',
      postal: '500034',
      country: 'IN'
    },
    lines: [
      {
        id: 'talus',
        name: 'Talus Wind Shell',
        size: 'L',
        qty: 1,
        price: 14500,
        img: '/photos/158-solum/product-talus.webp'
      }
    ],
    subtotal: 14500,
    shipping: 0,
    total: 14500,
    paymentMethod: 'UPI'
  };

  try {
    const res = await fetch('http://localhost:3000/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Result status:', res.status);
    console.log('Result body:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testOrder();
