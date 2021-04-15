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
    @Resolver(() => UserModel)
    class UserResolver {
    async user(@Args({ name: 'id', type: () => String }, ParseUUIDPipe) id: string) {
  }
  }
  `,
  }],
  invalid: [
    {
      code: `
    @Resolver(() => UserModel)
    class UserResolver {
    async user(@Args({ name: 'id', type: () => String }) id: string) {

  }
  }
    `,
      errors: [{ message: 'ParseUUIDPipe is not found in @Args decorators' }],
    },
  ],
});
