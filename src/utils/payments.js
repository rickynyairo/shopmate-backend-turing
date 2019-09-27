/* eslint-disable camelcase */
/* eslint-disable import/prefer-default-export */
import sendgridClient from '@sendgrid/mail';
import stripe from 'stripe';

export class EmailService {
  constructor() {
    this.sendgrid = sendgridClient;
    this.sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    this.sendgrid.setSubstitutionWrappers('{{', '}}');
  }

  sendMessage(message) {
    if (process.env.SENDGRID_ENABLED === 'true') {
      this.sendgrid.send(message);
    } else {
      console.log('-------- Sendgrid message --------');
      console.log(message);
      console.log('----------------------------------');
    }
  }

  async sendChargeEmail(charge) {
    const { email, name, total_amount, order_id, description } = charge;
    const message = {
      to: email,
      from: 'support@shopmate.com',
      subject: 'Payment Completion',
      templateId: '6ec0243a-9a6d-4c5a-a043-399e051b2a29',
      substitutions: {
        name,
        total_amount,
        order_id,
        description,
      },
    };
    this.sendMessage(message);
  }
}

export class StripePayment {
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
      const customerPayment = await this.stripeAPI.customers.create({
        email: this.email,
        source: this.stripeToken,
      });
      const pay = await customerPayment.charges.create({
        amount: this.total_amount,
        currency: 'usd',
        customer: this.customer_id,
      });
      const sendMail = await this.mailer.sendChargeEmail({
        email: this.email,
        total_amount: this.total_amount,
        order_id: this.order_id,
        description: this.description,
        name: this.name,
      });
      if (pay && sendMail) {
        // payment and email succesfull
        return [true, pay];
      }
      // payment failed
      return [false, pay];
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      throw error;
    }
  }
}
