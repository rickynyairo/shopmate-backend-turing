/* eslint-disable camelcase */
import stripe from 'stripe';
import EmailService from './email';

export default class StripePayment {
  constructor(paymentDetails) {
    const {
      stripeToken,
      email,
      customer_id,
      shipping_type,
      name,
      total_amount,
      description,
      order_id,
    } = paymentDetails;
    this.stripeAPI = stripe(process.env.STRIPE_SECRET_KEY);
    this.stripeToken = stripeToken;
    this.customer_id = customer_id;
    this.shipping_type = shipping_type;
    this.name = name;
    this.mailer = new EmailService();
    this.total_amount = total_amount;
    this.description = description;
    this.order_id = order_id;
    this.email = email;
  }

  async stripePayment() {
    try {
      const customer = await this.stripeAPI.customers.create({
        email: this.email,
        source: this.stripeToken,
      });
      const charge = await this.stripeAPI.charges.create({
        amount: Math.round(this.total_amount * 100),
        currency: 'usd',
        customer: customer.id,
      });
      await this.mailer.sendChargeEmail({
        email: this.email,
        total_amount: this.total_amount,
        order_id: this.order_id,
        description: this.description,
        name: this.name,
      });
      return {
        success: !!charge,
        charge,
      };
    } catch (error) {
      // TODO = integrate error logger
      console.log(error);
      throw error;
    }
  }
}
