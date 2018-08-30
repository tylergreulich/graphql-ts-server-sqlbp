import { request } from 'graphql-request';
import { host } from './constants';
import { createConnection } from 'typeorm';
import { User } from '../entity/User';

const email = 'bob@bob.com';
const password = 'aieurguiaer';

const mutation = `
  mutation {
    registerUser(email: '${email}', password: '${password}')
  }
`;

beforeEach(async () => {
  await createConnection();
});

test('It should register a user', async () => {
  const response = await request(host, mutation);
  expect(response).toEqual({ register: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
