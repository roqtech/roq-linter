const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/exports-should-follow-conventions');

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

ruleTesterInstance.run('exports-should-follow-conventions', ruleUnderTest, {
  valid: [
    {
      code:
        'export const something = 1',
      filename: 'sample.ts',
    },
    {
      code: 'export { SomeClass } from "something"',
      filename: 'frontend/src/pages/login/index.tsx',
    },
    {
      code:
        'export default accountActivatePage = ""',
      filename: 'frontend/src/pages/account-activate/index.tsx',
    },
    {
      code:
        'export type { SampleInterface } from "/src/dummy/interfaces/dummy.interface"',
      filename: 'sample.dummy.ts',
    },
  ],
  invalid: [
    {
      code: 'export default something',
      errors: [{
        message: 'Default exports are not allowed anywhere other than frontend slices and pages',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 25,
      }],
      filename: 'sample.ts',
    },
    {
      code: 'export * from "something"',
      errors: [{
        message: 'Wildcard exports are not allowed',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 26,
      }],
      filename: 'sample.ts',
    },
    {
      code: 'export * from "something"; export * from "something2"',
      errors: 2,
      filename: 'sample.ts',
    },
    {
      code: 'export default something; export * from "something2"',
      errors: 2,
      filename: 'sample.ts',
    },
    {
      code:
        'export { SampleInterface } from "/src/dummy/interfaces/dummy.interface"',
      errors: [
        {
          message: 'Interfaces should be exported like "export type {...} from ..."',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 72,
        },
      ],
      filename: 'sample.dummy.ts',
    },
  ],
});
