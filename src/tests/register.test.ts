import { request } from 'graphql-request';
import { host } from './constants';
import { User } from '../entity/User';
import { createTypeormConnection } from '../utils/createTypeormConnection';

const email = 'tom@bob.com';
const password = 'aieurguiaer';

const mutation = `
  mutation {
    registerUser(email: "${email}", password: "${password}")
  }
`;

beforeAll(async () => {
  await createTypeormConnection();
});

test('It should register a user', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ registerUser: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
