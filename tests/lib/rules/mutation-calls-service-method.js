const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/mutation-calls-service-method');

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

ruleTesterInstance.run('mutation-calls-service-method', ruleUnderTest, {
  valid: [
    {
      code: `import { AuthService } from 'src/auth/services';
    @Resolver(() => String)
    export class AuthResolver {
      constructor(private readonly authService: AuthService) {
      }
      @Mutation(() => String)
      logout():  Promise<string>  { return this.authService.register(input); }
    }`,
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
    {
      code: `import { PlatformService } from 'src/platform/services/platform.service';
      @Resolver()
      export class PlatformResolver {
        constructor(private readonly platformService: PlatformService) {}

        @Mutation(() => String)
        async testGateway(): Promise<string> {
          const response = await this.platformService.request();
          return JSON.stringify(response);
        }
      }`,
      filename: 'backend/src/platform/resolvers/platform.resolver.ts',
    },
    {
      code: `import { PlatformService } from 'src/platform/services/platform.service';
      @Resolver()
      export class PlatformResolver {
        constructor(private readonly platformService: PlatformService) {}

        @Mutation(() => String)
        async testGateway(): Promise<string> {
          return JSON.stringify(await this.platformService.request());
        }
      }`,
      filename: 'backend/src/platform/resolvers/platform.resolver.ts',
    },

  ],
  invalid: [
    {
      code: `@Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        @Mutation(() => String)
        login(): Promise<string> { return 'loggedIn'  }
      }`,
      errors: [{
        line: 1,
        column: 1,
        messageId: 'missingServiceImport',
        endLine: 6,
        endColumn: 8,
      }, {
        line: 5,
        column: 14,
        messageId: 'missingServiceMethodCall',
        endLine: 5,
        endColumn: 56,
      }],
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
    {
      code: `import { AuthService } from 'src/auth/services'
      @Resolver(() => String)
      export class AuthResolver {
        constructor() { /* Constructor Body */ }
        @Mutation(() => String)
        login(): Promise<string> { return 'loggedIn'  }
      }`,
      errors: [{
        line: 6,
        column: 14,
        messageId: 'missingServiceMethodCall',
        endLine: 6,
        endColumn: 56,
      }],
      filename: 'backend/src/auth/resolvers/auth.resolver.ts',
    },
  ],
});
