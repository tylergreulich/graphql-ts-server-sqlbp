import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { startServer } from '../../startServer';

let getHost = () => '';

beforeAll(async () => {
  const app = await startServer();
  const { port }: any = app.address();
  getHost = () => `http://127.0.0.1:${port}`;
});

const email = 'tom@bob.com';
const password = 'aieurguiaer';

const mutation = `
  mutation {
    registerUser(email: "${email}", password: "${password}")
  }
`;

test('It should register a user', async () => {
  const response = await request(getHost(), mutation);
  expect(response).toEqual({ registerUser: true });
  const users = await User.find({ where: { email } });
  expect(users).toHaveLength(1);
  const user = users[0];
  expect(user.email).toEqual(email);
  expect(user.password).not.toEqual(password);
});
