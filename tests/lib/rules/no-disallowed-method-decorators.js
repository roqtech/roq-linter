const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/no-disallowed-method-decorators');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021 },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('no-disallowed-method-decorators', ruleUnderTest, {
  valid: [
    {
      code: `@Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        @Mutation(() => String)
        login(): Promise<string> { /* Method Body */   }
      }`,
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
    {
      code: `@Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        @Query(() => String)
        logout():  Promise<string>  { /* Method Body */   }
      }`,
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
    {
      code: `@Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        @Query(() => String)
        @UseGuards(JwtAuthGuard)
        logout():  Promise<string>  { /* Method Body */   }
      }`,
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },

  ],
  invalid: [
    {
      code: `@Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        logout():  Promise<string>  { /* Method Body */   }
      }`,
      errors: [
        {
          message: 'Methods in resolvers should have either one of these decorators ResolveField,Query,Mutation',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 60,
        },
      ],
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
    {
      code: `@Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        @UseGuards(JwtAuthGuard)
        logout():  Promise<string>  { /* Method Body */   }
      }`,
      errors: [
        {
          message: 'Methods in resolvers should have either one of these decorators ResolveField,Query,Mutation',
          line: 4,
          column: 9,
          endLine: 5,
          endColumn: 60,
        },
      ],
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
  ],
});
