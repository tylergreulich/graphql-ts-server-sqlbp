import { ResolverMap } from '../../types/graphql-utils';
import { GQL } from '../../types/schema';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'bye'
  },
  Mutation: {
    registerUser: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        User.create({
          email,
          password: hashedPassword
        }).save();
        return true;
      } catch (error) {
        return error;
      }
    }
  }
};
