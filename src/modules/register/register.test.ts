import { request } from 'graphql-request';
import { User } from '../../entity/User';
import {
  duplicateEmail,
  emailIsTooShort,
  invalidEmail,
  passwordIsTooShort
} from './errorMessages';
import { createTypeormConnection } from '../../utils/createTypeormConnection';

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

beforeAll(async () => {
  await createTypeormConnection();
});

describe('Register User', () => {
  it('check for duplicate emails', async () => {
    // make sure we can register a user
    const response = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response).toEqual({ registerUser: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, password)
    );
    expect(response2.registerUser).toHaveLength(1);
    expect(response2.registerUser[0]).toEqual({
      path: 'email',
      message: duplicateEmail
    });
  });

  it('Should test for an invalid password', async () => {
    const responseThree: any = await request(
      process.env.TEST_HOST as string,
      mutation(email, 'a')
    );
    expect(responseThree.registerUser[0]).toEqual({
      path: 'password',
      message: passwordIsTooShort
    });
  });

  it('Should test for an invalid email', async () => {
    const responseFour: any = await request(
      process.env.TEST_HOST as string,
      mutation('a', password)
    );
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
    const responseFive: any = await request(
      process.env.TEST_HOST as string,
      mutation('a', 'b')
    );
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
