import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { startServer } from '../../startServer';
import {
  duplicateEmail,
  emailIsTooShort,
  invalidEmail,
  passwordIsTooShort
} from './errorMessages';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'tom@bob.com';
const password = 'aieurguiaer';

const mutation = (e: string, p: string) => `
  mutation {
    registerUser(email: "${e}", password: "${p}") {
      path
      message
    }
  }
`;

describe('Register User', () => {
  it('Should register a user', async () => {
    const response = await request(getHost(), mutation(email, password));
    expect(response).toEqual({ registerUser: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const responseTwo: any = await request(
      getHost(),
      mutation(email, password)
    );
    expect(responseTwo.registerUser).toHaveLength(1);
    expect(responseTwo.registerUser[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it('Should test for an invalid password', async () => {
    const responseThree: any = await request(getHost(), mutation(email, 'a'));
    expect(responseThree.registerUser[0]).toEqual({
      path: 'password',
      message: passwordIsTooShort
    });
  });

  it('Should test for an invalid email', async () => {
    const responseFour: any = await request(getHost(), mutation('a', password));
    expect(responseFour).toEqual({
      registerUser: [
        {
          path: 'email',
          message: emailIsTooShort
        },
        {
          path: 'email',
          message: invalidEmail
        }
      ]
    });
  });

  it('Should test for an invalid email and an invalid password', async () => {
    const responseFive: any = await request(getHost(), mutation('a', 'b'));
    expect(responseFive).toEqual({
      registerUser: [
        {
          path: 'email',
          message: emailIsTooShort
        },
        {
          path: 'email',
          message: invalidEmail
        },
        {
          path: 'password',
          message: passwordIsTooShort
        }
      ]
    });
  });
});
