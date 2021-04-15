const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exactly-one-enum-definition');

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

ruleTesterInstance.run('exactly-one-enum-definition', ruleUnderTest, {
  valid: [
    {
      code: `
      import { registerEnumType } from '@nestjs/graphql';
      export enum UserLoginStatusEnum {
        LOGGED_IN = 'loggedIn',
        LOGGED_OUT = 'loggedOut',
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
      code: `
      import { registerEnumType } from '@nestjs/graphql';
      export enum UserLoginStatusEnum {
          LOGGED_IN = 'loggedIn',
          LOGGED_OUT = 'loggedOut',
        }
        export enum UserTypeEnum {
          PASSIVE = 'passive',
          ACTIVE = 'active',
        }
        registerEnumType(UserLoginStatusEnum, {
          name: 'UserLoginStatusEnum',
        });
        registerEnumType(UserTypeEnum, {
          name: 'UserTypeEnum',
        });
      `,
      errors: [{
        messageId: 'enumCountMismatch',
        line: 7,
        column: 16,
        endLine: 10,
        endColumn: 10,
      },
      ],
      filename: 'backend/src/auth/enums/user-login.enum.ts',
    },
  ],
});
