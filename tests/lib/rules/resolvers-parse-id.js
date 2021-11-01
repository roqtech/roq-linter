const { RuleTester } = require('eslint');
const resolversParseId = require('../../../lib/rules/resolvers-parse-id');

const ruleTester = new RuleTester(
  {
    parserOptions: { ecmaVersion: 2021 },
    parser: require.resolve('@typescript-eslint/parser'),
  },
);

ruleTester.run('resolvers-parse-id', resolversParseId, {
  valid: [{
    code: `
      import { ParseUUIDPipe } from '@nestjs/common';

      @Resolver(() => UserModel)
      class UserResolver {
        async user(
          @Args({ name: 'randomNumber', type: () => Number }) random: number,
          @Args({ name: 'id', type: () => String }, ParseUUIDPipe) id: string) {}
      }
  `,
  },
  {
    code: `
      import { ParseUUIDPipe as idParsePipe } from '@nestjs/common';

      @Resolver(() => UserModel)
      class UserResolver {
        async user(@Args({ name: 'id', type: () => String }, idParsePipe) id: string) {}
      }
  `,
  }],
  invalid: [
    {
      code: `
        import { ParseUUIDPipe } from '@nestjs/common';

        @Resolver(() => UserModel)
        class UserResolver {
          async user(@Args({ name: 'id', type: () => String }) id: string) {}
        }
    `,
      errors: [{ message: 'ParseUUIDPipe needs to be the second param in the @Args decorator' }],
    },
    {
      code: `
        import { ParseUUIDPipe } from 'some-other-package';

        @Resolver(() => UserModel)
        class UserResolver {
          async user(@Args({ name: 'id', type: () => String }) id: string) {}
        }
    `,
      errors: [{ message: 'Missing/Invalid Destructured Import for ParseUUIDPipe from @nestjs/common' }],
    },
  ],
});
