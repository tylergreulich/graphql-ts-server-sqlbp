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

test('It should register a user', async () => {
  // Making sure we can register a user
  const response = await request(getHost(), mutation(email, password));
  expect(response).toEqual({ registerUser: null });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);

  // Testing for duplicate emails
  const responseTwo: any = await request(getHost(), mutation(email, password));
  expect(responseTwo.registerUser).toHaveLength(1);
  expect(responseTwo.registerUser[0]).toEqual({
    path: 'email',
    message: duplicateEmail
  });

  // Validating email
  const responseThree: any = await request(getHost(), mutation('a', password));
  expect(responseThree).toEqual({
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

  // Validating password length
  const responseFour: any = await request(getHost(), mutation(email, 'a'));
  expect(responseFour.registerUser[0]).toEqual({
    path: 'password',
    message: passwordIsTooShort
  });

  // Validating email and password fields
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
