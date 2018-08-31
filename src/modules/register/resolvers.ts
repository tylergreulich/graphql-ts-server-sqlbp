import { ResolverMap } from '../../types/graphql-utils';
import { GQL } from '../../types/schema';
import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entity/User';

import { formatYupError } from '../../utils/formatYupError';
import {
  duplicateEmail,
  invalidEmail,
  emailIsTooShort,
  passwordIsTooShort
} from './errorMessages';
import { createConfirmEmailLink } from '../../utils/createConfirmEmailLink';

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3, emailIsTooShort)
    .max(255)
    .email(invalidEmail),
  password: yup
    .string()
    .min(3, passwordIsTooShort)
    .max(255)
});

export const resolvers: ResolverMap = {
  Query: {
    bye: () => 'bye'
  },
  Mutation: {
    registerUser: async (
      _,
      args: GQL.IRegisterOnMutationArguments,
      { redis, url }
    ) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (error) {
        return formatYupError(error);
      }

      const { email, password } = args;

      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ['id']
      });

      if (userAlreadyExists) {
        return [
          {
            path: 'email',
            message: duplicateEmail
          }
        ];
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User.create({
          email,
          password: hashedPassword
        });

        await user.save();

        const link = await createConfirmEmailLink(url, user.id, redis);

        return null;
      } catch (error) {
        return error;
      }
    }
  }
};
