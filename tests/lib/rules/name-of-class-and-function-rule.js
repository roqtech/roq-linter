const { RuleTester } = require('eslint');
const ruleUnderTest = require('../../../lib/rules/name-of-class-and-function-rule');

const ruleTesterInstance = new RuleTester({
  parserOptions: { ecmaVersion: 2021, sourceType: 'module' },
  settings: {
    'roq-linter': {
      backendBasePath: 'backend/src',
      frontendBasePath: 'frontend/src',
      backendTestsBasePath: 'backend/tests',
    },
  },
});

ruleTesterInstance.run('name-of-class-and-function-rule', ruleUnderTest, {
  valid: [
    {
      code: 'export class SomeClass {}',
      filename: 'some.class.ts',
    },
    {
      code: 'export class AnyComponent {}',
      filename: 'any-component.ts',
    },
    {
      code: 'export function someFunc() {}',
      filename: 'some.func.ts',
    },
    {
      code: 'export function usefulFunc() {}',
      filename: 'useful-func.ts',
    },
  ],
  invalid: [
    {
      code: 'export class AnyComponent {}',
      errors: [{
        message: 'The name of class should be same as file, in PascalCase without \'.\' and \'-\'. Class name AnyComponent, file name some.component.',
        line: 1,
        column: 8,
        endLine: 1,
        endColumn: 29,
      }],
      filename: 'folder/some.component.ts',
    },
    {
      code: 'export class SomeComponent {}',
      errors: [{
        message: 'The name of class should be same as file, in PascalCase without \'.\' and \'-\'. Class name SomeComponent, file name any-component.',
        line: 1,
        column: 8,
        endLine: 1,
        endColumn: 30,
      }],
      filename: 'folder/any-component.ts',
    },
    {
      code: 'export function anyFunction() {}',
      errors: [{
        message: 'The name of functions should be same as file, in camelCase without \'.\' and \'-\'. Function name anyFunction, file name some.component.',
        line: 1,
        column: 8,
        endLine: 1,
        endColumn: 33,
      }],
      filename: 'folder/some.component.ts',
    },
    {
      code: 'export function someFunction() {}',
      errors: [{
        message: 'The name of functions should be same as file, in camelCase without \'.\' and \'-\'. Function name someFunction, file name any-function.',
        line: 1,
        column: 8,
        endLine: 1,
        endColumn: 34,
      }],
      filename: 'folder/any-function.ts',
    },
  ],
});
