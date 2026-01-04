const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? require('stripe')(stripeSecret) : null;

app.post('/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: 'Stripe non configure (STRIPE_SECRET_KEY manquant).' });
    }
    const { amount, currency } = req.body;
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ error: 'Montant invalide.' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amt * 100),
      currency: currency || 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: {
        campaignTitle: req.body.campaignTitle || '',
        donorEmail: req.body.email || '',
      },
    });
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Stripe test server running on http://localhost:${PORT}`);
});
