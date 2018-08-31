// import { ResolverMap } from '../../types/graphql-utils';
// import { GQL } from '../../types/schema';
// import { User } from '../../entity/User';

// export const resolvers: ResolverMap = {
//   Query: {
//     bye: () => 'bye'
//   },
//   Mutation: {
//     loginUser: async (
//       _,
//       { email, password }: GQL.IRegisterOnMutationArguments
//     ) => {
//       const userAlreadyExists = await User.findOne({
//         where: { email },
//         select: ['id']
//       });

//       if (!userAlreadyExists) {
//         return [
//           {
//             path: 'email',
//             message: 'User does not exist'
//           }
//         ];
//       }

//       try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         User.create({
//           email,
//           password: hashedPassword
//         }).save();
//         return null;
//       } catch (error) {
//         return error;
//       }
//     }
//   }
// };
