const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const userId = session.metadata.userId;

    const { getDatabase } = await import('@netlify/database');
    const db = getDatabase();
    await db.sql`UPDATE profiles SET entered = true WHERE id = ${userId}`;
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
