const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/only-constants-in-enum');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  parser: require.resolve('@typescript-eslint/parser'),
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('only-constants-in-enum', ruleUnderTest, {
  valid: [
    {
      code: `import { registerEnumType } from '@nestjs/graphql';
      export enum UserLoginStatusEnum {
        LOGGED_IN = 'loggedIn',
        LOGGED_OUT = 'loggedOut',
      }
      registerEnumType(UserLoginStatusEnum, {
        name: 'UserLoginStatusEnum',
      });`,
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
    {
      code: `import { registerEnumType } from '@nestjs/graphql';
      export enum UserLoginStatusEnum {
        LOGGED_IN = 1,
        LOGGED_OUT = 0,
      }
      registerEnumType(UserLoginStatusEnum, {
        name: 'UserLoginStatusEnum',
      });
      `,
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
  ],
  invalid: [
    {
      code: `import { registerEnumType } from '@nestjs/graphql';
      export enum UserLoginStatusEnum {
        LOGGED_IN = 'loggedIn',
        LOGGED_OUT = ()=>'loggedOut',
      }
      registerEnumType(UserLoginStatusEnum, {
        name: 'UserLoginStatusEnum',
      });
      `,
      errors: [
        {
          messageId: 'nonConstantMembersFound',
          line: 4,
          column: 9,
          endLine: 4,
          endColumn: 37,
        },
      ],
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
    {
      code: `import { registerEnumType } from '@nestjs/graphql';
      const logOut = () => 'loggedOut';
        export enum UserLoginStatusEnum {
          LOGGED_IN = 'loggedIn',
          LOGGED_OUT = logOut(),
        }
        registerEnumType(UserLoginStatusEnum, {
          name: 'UserLoginStatusEnum',
        });
          `,
      errors: [
        {
          messageId: 'onlyEnumDeclarationAllowed',
          line: 2,
          column: 7,
          endLine: 2,
          endColumn: 40,
        },
        {
          messageId: 'nonConstantMembersFound',
          line: 5,
          column: 11,
          endLine: 5,
          endColumn: 32,
        },
      ],
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
    {
      code: `export enum UserLoginStatusEnum {
        LOGGED_IN = 1,
        LOGGED_OUT = 0,
      }
      registerEnumType(UserLoginStatusEnum, {
        name: 'UserLoginStatusEnum',
      });
      `,
      errors: [
        {
          messageId: 'missingOrExtraNecessaryComponents',
          line: 1,
          column: 1,
          endLine: 8,
          endColumn: 7,
        }],
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
    {
      code: `import { registerEnumType } from '@nestjs/graphql';
      export enum UserLoginStatusEnum {
        LOGGED_IN = 1,
        LOGGED_OUT = 0,
      }
      `,
      errors: [
        {
          messageId: 'missingOrExtraNecessaryComponents',
          line: 1,
          column: 1,
          endLine: 6,
          endColumn: 7,
        }],
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
  ],
});
