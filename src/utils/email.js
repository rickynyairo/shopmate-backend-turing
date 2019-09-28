/* eslint-disable camelcase */
import sendgridClient from '@sendgrid/mail';

export default class EmailService {
  constructor() {
    this.sendgrid = sendgridClient;
    this.sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    this.sendgrid.setSubstitutionWrappers('{{', '}}');
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
    this.sendgrid.send(message);
  }
}
