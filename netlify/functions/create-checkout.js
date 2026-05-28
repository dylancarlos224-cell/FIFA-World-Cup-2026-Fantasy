const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  const { userId, username } = JSON.parse(event.body);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    mode: 'payment',
    success_url: 'https://fifaworldcupfantasy.netlify.app/?payment=success&user=' + userId,
    cancel_url: 'https://fifaworldcupfantasy.netlify.app/?payment=cancelled',
    metadata: { userId, username },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ url: session.url }),
  };
};
