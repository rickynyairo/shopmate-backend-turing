/* eslint-disable lines-between-class-members */
/* eslint-disable camelcase */
import sendgridClient from '@sendgrid/mail';

export default class EmailService {
  constructor(client = sendgridClient) {
    this.sendgrid = client;
    this.sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
    this.sendgrid.setSubstitutionWrappers('{{', '}}');
  }
  /**
   * get all products
   *
   * @async
   * @param {object} charge charge object containing payment and user details
   * @memberof EmailService
   */
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
