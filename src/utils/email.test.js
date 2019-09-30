import 'jest';
import EmailService from './email';

let mockSendgridClient;
let email;

describe('Email service', () => {
  beforeEach(() => {
    mockSendgridClient = {
      setApiKey: jest.fn(),
      setSubstitutionWrappers: jest.fn(),
      send: jest.fn(),
    };
    email = new EmailService(mockSendgridClient);
  });

  it('sets API key', () => {
    expect(mockSendgridClient.setApiKey).toHaveBeenCalled();
  });

  it('sets substitution wrappers', () => {
    expect(mockSendgridClient.setSubstitutionWrappers).toHaveBeenCalledWith('{{', '}}');
  });

  it('extracts charge params and sends email', async () => {
    await email.sendChargeEmail({
      email: 'test_email@email.com',
      name: 'test user',
      total_amount: 500,
      order_id: 1,
      description: 'Your payment is tested',
    });
    expect(mockSendgridClient.send).toHaveBeenCalledWith({
      to: 'test_email@email.com',
      from: 'support@shopmate.com',
      subject: 'Payment Completion',
      templateId: '6ec0243a-9a6d-4c5a-a043-399e051b2a29',
      substitutions: {
        name: 'test user',
        total_amount: 500,
        order_id: 1,
        description: 'Your payment is tested',
      },
    });
  });
});
