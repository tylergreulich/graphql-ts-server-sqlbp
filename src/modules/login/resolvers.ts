import { ResolverMap } from '../../types/graphql-utils';
import { GQL } from '../../types/schema';
import { User } from '../../entity/User';
import * as bcrypt from 'bcryptjs';
import { invalidLogin } from './errorMessages';

export const resolvers: ResolverMap = {
  Query: {
    bye2: () => 'bye'
  },
  Mutation: {
    loginUser: async (
      _,
      { email, password }: GQL.ILoginUserOnMutationArguments,
      { session }
    ) => {
      const user = await User.findOne({
        where: { email },
        select: ['id']
      });

      if (!user) return invalidLogin('email', 'Email is invalid');

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) return invalidLogin('password', 'Password is invalid');

      session.userId = user.id;

      return null;
    }
  }
};
