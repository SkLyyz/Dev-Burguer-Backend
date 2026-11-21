import Stripe from "stripe";
import * as Yup from "yup";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return current.price * current.quantity + acc;
  }, 0);

  return total;
};

class CreatePaymentIntentController {
  async store(req, res) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          }),
        ),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { products } = req.body;
    const amount = calculateOrderAmount(products);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('PaymentIntent criado:', paymentIntent.id);

    const account = await stripe.accounts.retrieve();

    console.log("Conta Stripe:", account.id);
    console.log("PaymentIntent:", paymentIntent.id);
    console.log("Modo:", paymentIntent.livemode ? "Produção" : "Teste");

    res.json({
      clientSecret: paymentIntent.client_secret,
      dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
    });
  }
}

export default new CreatePaymentIntentController();
