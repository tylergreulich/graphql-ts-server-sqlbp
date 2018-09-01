import { request } from 'graphql-request';
import { invalidLogin } from './errorMessages';
import { createTypeormConnection } from '../../utils/createTypeormConnection';

const loginMutation = (e: string, p: string) => `
  mutation {
    loginUser(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

beforeAll(async () => {
  await createTypeormConnection();
});

describe('Login user', () => {
  it('Should test for a valid email', async () => {
    const response = await request(
      process.env.TEST_HOST as string,
      loginMutation('tom@tom.com', 'whatever')
    );

    expect(response).toEqual({
      loginUser: invalidLogin('email', 'Email is invalid')
    });
  });
});
